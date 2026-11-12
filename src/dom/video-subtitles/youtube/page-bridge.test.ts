import { Window as HappyWindow } from 'happy-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PROJECT_PREFIX } from '@/constants';
import {
  BRIDGE_REQUEST,
  BRIDGE_RESPONSE,
  MAX_SUBTITLE_BYTES,
  validBridgeResponse,
  type YoutubeBridgeResponse,
} from './bridge-protocol';
import { boundedSubtitleText, installYoutubeBridge, YOUTUBE_CAPTURE_TIMEOUT_MS } from './page-bridge';

const body = '{"events":[{"tStartMs":0,"dDurationMs":1000,"segs":[{"utf8":"caption"}]}]}';
const baseUrl = 'https://www.youtube.com/api/timedtext?v=video_123&lang=en';
const track = { vssId: '.en', languageCode: 'en', baseUrl };
let browser: HappyWindow;
let win: Window;
let dispose: (() => void) | undefined;
let fetched: ReturnType<typeof vi.fn<typeof fetch>>;
let posted: ReturnType<typeof vi.fn<(message: YoutubeBridgeResponse) => void>>;

async function settle() {
  for (let index = 0; index < 20; index += 1) await Promise.resolve();
}
function read(requestId = 'request', knownTrackId?: string, enableCaptions = false, resetRetry = false) {
  win.dispatchEvent(
    new browser.MessageEvent('message', {
      origin: win.location.origin,
      source: browser,
      data: { type: BRIDGE_REQUEST, version: 1, action: 'read', requestId, enableCaptions, knownTrackId, resetRetry },
    }) as unknown as MessageEvent
  );
}
function stop() {
  win.dispatchEvent(
    new browser.MessageEvent('message', {
      origin: win.location.origin,
      source: browser,
      data: { type: BRIDGE_REQUEST, version: 1, action: 'stop', requestId: 'stop' },
    }) as unknown as MessageEvent
  );
}
function responses() {
  return posted.mock.calls.map(([data]) => data).filter((data) => data.type === BRIDGE_RESPONSE);
}

beforeEach(() => {
  vi.useFakeTimers();
  browser = new HappyWindow({ url: 'https://www.youtube.com/watch?v=video_123' });
  win = browser as unknown as Window;
  fetched = vi.fn<typeof fetch>().mockImplementation(async () => new Response(body));
  win.fetch = fetched;
  posted = vi.fn<(message: YoutubeBridgeResponse) => void>();
  win.postMessage = posted;
  const player = win.document.createElement('div');
  player.id = 'movie_player';
  Object.assign(player, {
    getPlayerResponse: () => ({
      videoDetails: { videoId: 'video_123', title: 'Example' },
      captions: { playerCaptionsTracklistRenderer: { captionTracks: [track] } },
    }),
    getOption: () => track,
  });
  win.document.body.append(player);
});
afterEach(async () => {
  dispose?.();
  dispose = undefined;
  await browser.happyDOM.close();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('bounded subtitle response reader', () => {
  it('rejects timed-out partial text rather than caching a truncated successful response', async () => {
    const response = new Response(
      new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('partial'));
        },
      })
    );
    const result = expect(boundedSubtitleText(response)).rejects.toThrow('timeout');
    await vi.advanceTimersByTimeAsync(YOUTUBE_CAPTURE_TIMEOUT_MS);
    await result;
  });

  it('accepts multi-hour caption payloads through the reader and bridge', async () => {
    const text = JSON.stringify({ events: [], padding: ' '.repeat(3_600_000) });
    expect(await boundedSubtitleText(new Response(text))).toBe(text);
    expect(
      validBridgeResponse({
        type: BRIDGE_RESPONSE,
        version: 1,
        requestId: 'long-video',
        text,
        snapshot: {
          videoId: 'video_123',
          title: '',
          ad: false,
          hasTracks: true,
          track: { id: '.en', language: 'en', kind: 'manual' },
        },
      })
    ).toBe(true);
  });

  it('enforces the streaming byte budget even without content-length', async () => {
    await expect(boundedSubtitleText(new Response('x'.repeat(MAX_SUBTITLE_BYTES + 1)))).rejects.toThrow('oversize');
  });

  it('rejects oversized bodies and supports explicit abort', async () => {
    await expect(
      boundedSubtitleText(new Response('x', { headers: { 'content-length': String(MAX_SUBTITLE_BYTES + 1) } }))
    ).rejects.toThrow('oversize');
    const controller = new AbortController();
    const response = new Response(new ReadableStream({ start() {} }));
    const result = expect(boundedSubtitleText(response, controller.signal)).rejects.toThrow('aborted');
    controller.abort();
    await result;
  });
});

describe('recoverable YouTube network bridge', () => {
  it('preserves native fetch promise/arguments and reuses captured captions without a second request', async () => {
    const promise = Promise.resolve(new Response(body));
    fetched.mockReturnValue(promise);
    const originalOpen = browser.XMLHttpRequest.prototype.open;
    dispose = installYoutubeBridge(win);
    expect(installYoutubeBridge(win)).toBe(dispose);
    const options = { credentials: 'include' as const };
    expect(win.fetch(baseUrl, options)).toBe(promise);
    await settle();
    read();
    await settle();
    expect(fetched).toHaveBeenCalledExactlyOnceWith(baseUrl, options);
    expect(responses().at(-1)?.text).toBe(body);
    await vi.advanceTimersByTimeAsync(250);
    read('known', '.en');
    await settle();
    expect(responses().at(-1)).not.toHaveProperty('text');
    stop();
    expect(win.fetch).not.toBe(fetched);
    dispose();
    expect(win.fetch).toBe(fetched);
    expect(browser.XMLHttpRequest.prototype.open).toBe(originalOpen);
  });

  it('retains native captions across delayed enable and a user restart', async () => {
    dispose = installYoutubeBridge(win);
    await win.fetch(baseUrl);
    await settle();
    await vi.advanceTimersByTimeAsync(6000);
    expect(win.fetch).not.toBe(fetched);
    fetched.mockResolvedValue(new Response(''));
    read('delayed-enable');
    await settle();
    expect(responses().at(-1)?.text).toBe(body);
    expect(fetched).toHaveBeenCalledTimes(1);
    stop();
    await vi.advanceTimersByTimeAsync(250);
    read('restart');
    await settle();
    expect(responses().at(-1)?.text).toBe(body);
    expect(fetched).toHaveBeenCalledTimes(1);
  });

  it('captures SPA navigation captions before a delayed enable and ignores the previous adapter stop', async () => {
    dispose = installYoutubeBridge(win);
    await vi.advanceTimersByTimeAsync(6000);
    expect(win.fetch).not.toBe(fetched);
    win.document.dispatchEvent(new browser.Event('yt-navigate-start') as unknown as Event);
    browser.happyDOM.setURL('https://www.youtube.com/watch?v=other_123');
    const nextUrl = baseUrl.replace('video_123', 'other_123');
    Object.assign(win.document.querySelector('#movie_player')!, {
      getPlayerResponse: () => ({
        videoDetails: { videoId: 'other_123' },
        captions: { playerCaptionsTracklistRenderer: { captionTracks: [{ ...track, baseUrl: nextUrl }] } },
      }),
    });
    let resolve!: (response: Response) => void;
    fetched.mockImplementationOnce(
      () =>
        new Promise((done) => {
          resolve = done;
        })
    );
    const native = win.fetch(nextUrl);
    win.dispatchEvent(
      new browser.MessageEvent('message', {
        origin: win.location.origin,
        source: browser,
        data: { type: BRIDGE_REQUEST, version: 1, action: 'stop', requestId: 'old-stop', videoId: 'video_123' },
      }) as unknown as MessageEvent
    );
    // Legacy stop messages must not cancel an in-flight navigation capture either.
    stop();
    win.document.dispatchEvent(new browser.Event('yt-navigate-finish') as unknown as Event);
    resolve(new Response(body));
    await native;
    await settle();
    await vi.advanceTimersByTimeAsync(6000);
    expect(win.fetch).not.toBe(fetched);
    fetched.mockResolvedValue(new Response(''));
    read('enable-new-video');
    await settle();
    expect(responses().at(-1)?.snapshot.videoId).toBe('other_123');
    expect(responses().at(-1)?.text).toBe(body);
    expect(fetched).toHaveBeenCalledTimes(1);
  });

  it('removes SPA navigation listeners on disposal', () => {
    dispose = installYoutubeBridge(win);
    dispose();
    win.document.dispatchEvent(new browser.Event('yt-navigate-start') as unknown as Event);
    win.document.dispatchEvent(new browser.Event('yt-navigate-finish') as unknown as Event);
    expect(win.fetch).toBe(fetched);
  });

  it.each(['<html>temporary error</html>', '{"events":', '{"events":[]}'])(
    'retries an invalid body without retaining it as usable cache: %s',
    async (invalid) => {
      fetched.mockResolvedValueOnce(new Response(invalid));
      dispose = installYoutubeBridge(win);
      read('invalid');
      await settle();
      expect(responses().at(-1)?.error).toBe('fetch');
      await vi.advanceTimersByTimeAsync(250);
      read('retry', undefined, false, true);
      await settle();
      expect(responses().at(-1)?.text).toBe(body);
      expect(fetched).toHaveBeenCalledTimes(2);
      stop();
      read('healthy-cache');
      await settle();
      expect(responses().at(-1)?.text).toBe(body);
      expect(fetched).toHaveBeenCalledTimes(2);
    }
  );

  it('retains auto-translated request context but never caches its translated body as the source', async () => {
    dispose = installYoutubeBridge(win);
    fetched.mockResolvedValueOnce(new Response(body.replace('caption', 'translated')));
    await win.fetch(`${baseUrl}&tlang=fr&pot=fresh-token&signature=fresh-signature&c=WEB`);
    await settle();
    read();
    await settle();
    expect(fetched).toHaveBeenCalledTimes(2);
    const requested = new URL(String(fetched.mock.calls[1][0]));
    expect(requested.searchParams.get('tlang')).toBeNull();
    expect(requested.searchParams.get('pot')).toBe('fresh-token');
    expect(requested.searchParams.get('signature')).toBe('fresh-signature');
    expect(requested.searchParams.get('c')).toBe('WEB');
    expect(responses().at(-1)?.text).toBe(body);
    expect(responses().at(-1)?.snapshot.domLanguage).toBe('fr');
    await vi.advanceTimersByTimeAsync(250);
    read('after-original-fetch', '.en');
    expect(responses().at(-1)?.snapshot.domLanguage).toBe('fr');
  });

  it('does not let an older native body overwrite a newer observed request context', async () => {
    dispose = installYoutubeBridge(win);
    let finish!: (response: Response) => void;
    fetched.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        })
    );
    const older = win.fetch(`${baseUrl}&pot=older`);
    fetched.mockResolvedValueOnce(new Response('', { status: 403 }));
    await win.fetch(`${baseUrl}&tlang=fr&pot=newer`);
    finish(new Response('<html>invalid</html>'));
    await older;
    await settle();
    read();
    await settle();
    expect(new URL(String(fetched.mock.calls.at(-1)![0])).searchParams.get('pot')).toBe('newer');
    expect(responses().at(-1)?.snapshot.domLanguage).toBe('fr');
  });

  it('preserves the complete native request context when retrying a failed native response', async () => {
    fetched.mockResolvedValueOnce(new Response('', { status: 403 }));
    dispose = installYoutubeBridge(win);
    await win.fetch(`${baseUrl}&pot=fresh-native-token&potc=1&c=WEB&cver=current&signature=fresh-signature`);
    await settle();
    read();
    await settle();
    expect(fetched).toHaveBeenCalledTimes(2);
    const fallback = new URL(String(fetched.mock.calls[1][0]));
    expect(fallback.searchParams.get('pot')).toBe('fresh-native-token');
    expect(fallback.searchParams.get('potc')).toBe('1');
    expect(fallback.searchParams.get('c')).toBe('WEB');
    expect(fallback.searchParams.get('cver')).toBe('current');
    expect(fallback.searchParams.get('signature')).toBe('fresh-signature');
    expect(fallback.searchParams.get('fmt')).toBe('json3');
    expect(responses().at(-1)?.text).toBe(body);
  });

  it('keeps passive capture after delayed enable and explicit stop without stacked wrappers', async () => {
    dispose = installYoutubeBridge(win);
    const wrapper = win.fetch;
    await vi.advanceTimersByTimeAsync(5000);
    expect(win.fetch).toBe(wrapper);
    read();
    await settle();
    expect(win.fetch).toBe(wrapper);
    stop();
    expect(win.fetch).toBe(wrapper);
    read('restart');
    await settle();
    expect(win.fetch).toBe(wrapper);
    expect(responses().at(-1)?.text).toBe(body);
  });

  it('suspends for bfcache and accepts a fresh enabled read after pageshow', async () => {
    dispose = installYoutubeBridge(win);
    const hidden = new browser.Event('pagehide');
    Object.defineProperty(hidden, 'persisted', { value: true });
    win.dispatchEvent(hidden as unknown as Event);
    expect(win.fetch).toBe(fetched);
    read('hidden');
    expect(fetched).not.toHaveBeenCalled();
    win.dispatchEvent(new browser.Event('pageshow') as unknown as Event);
    read('restored');
    await settle();
    expect(responses().at(-1)?.text).toBe(body);
    expect(win.fetch).not.toBe(fetched);
  });

  it('captures native captions after a long ad without initiating requests while disabled', async () => {
    dispose = installYoutubeBridge(win);
    const player = win.document.querySelector('#movie_player')!;
    player.classList.add('ad-showing');
    await vi.advanceTimersByTimeAsync(30_000);
    expect(fetched).not.toHaveBeenCalled();
    player.classList.remove('ad-showing');
    await win.fetch(baseUrl);
    await settle();
    await vi.advanceTimersByTimeAsync(30_000);
    read('late-enable');
    await settle();
    expect(responses().at(-1)?.text).toBe(body);
    expect(fetched).toHaveBeenCalledTimes(1);
  });

  it('stopping active work preserves an in-flight passive native capture', async () => {
    dispose = installYoutubeBridge(win);
    let finish!: (value: Response) => void;
    fetched.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        })
    );
    const native = win.fetch(baseUrl);
    stop();
    finish(new Response(body));
    await native;
    await settle();
    read();
    await settle();
    expect(responses().at(-1)?.text).toBe(body);
    expect(fetched).toHaveBeenCalledTimes(1);
  });

  it('still captures XHR when the host fetch slot is read-only', async () => {
    Object.defineProperty(win, 'fetch', { value: fetched, writable: false, configurable: true });
    vi.spyOn(browser.XMLHttpRequest.prototype, 'send').mockImplementation(() => {});
    expect(() => {
      dispose = installYoutubeBridge(win);
    }).not.toThrow();
    const xhr = new browser.XMLHttpRequest();
    xhr.open('GET', baseUrl);
    xhr.send();
    Object.defineProperties(xhr, {
      status: { value: 200 },
      responseText: { value: body },
      responseURL: { value: baseUrl },
    });
    xhr.dispatchEvent(new browser.Event('loadend'));
    read();
    await settle();
    expect(responses().at(-1)?.text).toBe(body);
    expect(fetched).not.toHaveBeenCalled();
    expect(() => dispose?.()).not.toThrow();
  });

  it('keeps fetch capture and safe disposal when XHR methods are locked', async () => {
    const proto = browser.XMLHttpRequest.prototype;
    const descriptor = Object.getOwnPropertyDescriptor(proto, 'open');
    Object.defineProperty(proto, 'open', { value: proto.open, writable: false, configurable: true });
    try {
      dispose = installYoutubeBridge(win);
      await win.fetch(baseUrl);
      await settle();
      read();
      await settle();
      expect(responses().at(-1)?.text).toBe(body);
      // A host can also lock a wrapper after installation.
      Object.defineProperty(win, 'fetch', { value: win.fetch, writable: false, configurable: true });
      expect(() => dispose?.()).not.toThrow();
    } finally {
      if (descriptor) Object.defineProperty(proto, 'open', descriptor);
      else Reflect.deleteProperty(proto, 'open');
    }
  });

  it('retains endpoint cooldown across video changes and recovers after Retry-After without manual retry', async () => {
    fetched.mockResolvedValueOnce(new Response('', { status: 429, headers: { 'Retry-After': '120' } }));
    dispose = installYoutubeBridge(win);
    read();
    await settle();
    win.document.dispatchEvent(new browser.Event('yt-navigate-start') as unknown as Event);
    browser.happyDOM.setURL('https://www.youtube.com/watch?v=other_123');
    Object.assign(win.document.querySelector('#movie_player')!, {
      getPlayerResponse: () => ({
        videoDetails: { videoId: 'other_123' },
        captions: {
          playerCaptionsTracklistRenderer: {
            captionTracks: [{ ...track, baseUrl: baseUrl.replace('video_123', 'other_123') }],
          },
        },
      }),
    });
    win.document.dispatchEvent(new browser.Event('yt-navigate-finish') as unknown as Event);
    read('next-video', undefined, false, true);
    await settle();
    expect(responses().at(-1)?.error).toBe('rateLimit');
    expect(fetched).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(60_000);
    read('too-early', undefined, false, true);
    await settle();
    expect(fetched).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(60_000);
    read('cooldown-over');
    await settle();
    expect(fetched).toHaveBeenCalledTimes(2);
    expect(responses().at(-1)?.text).toBe(body);
  });

  it('does not fetch or reuse content during an advertisement', async () => {
    dispose = installYoutubeBridge(win);
    win.document.querySelector('#movie_player')!.classList.add('ad-showing');
    read();
    await settle();
    expect(fetched).not.toHaveBeenCalled();
    expect(responses().at(-1)?.snapshot.ad).toBe(true);
    expect(responses().at(-1)).not.toHaveProperty('text');
  });

  it('ignores forged message origins and stale asynchronous responses after video navigation', async () => {
    let resolve!: (response: Response) => void;
    fetched.mockImplementation(
      () =>
        new Promise((done) => {
          resolve = done;
        })
    );
    dispose = installYoutubeBridge(win);
    win.dispatchEvent(
      new browser.MessageEvent('message', {
        origin: 'https://evil.test',
        source: browser,
        data: { type: BRIDGE_REQUEST, version: 1, action: 'read', requestId: 'forged', enableCaptions: false },
      }) as unknown as MessageEvent
    );
    expect(fetched).not.toHaveBeenCalled();
    read();
    await settle();
    browser.happyDOM.setURL('https://www.youtube.com/watch?v=other_123');
    resolve(new Response(body));
    await settle();
    expect(responses().some((response) => response.text)).toBe(false);
  });
  it('follows real-player vss_id selection and restores only its own caption toggle', async () => {
    const player = win.document.querySelector('#movie_player')!;
    let enabled = false;
    const toggle = vi.fn(() => {
      enabled = !enabled;
    });
    Object.assign(player, {
      getPlayerResponse: () => ({
        videoDetails: { videoId: 'video_123' },
        captions: {
          playerCaptionsTracklistRenderer: {
            captionTracks: [
              { vssId: '.de', languageCode: 'de', baseUrl: baseUrl.replace('lang=en', 'lang=de') },
              track,
            ],
          },
        },
      }),
      getOption: () => ({ vss_id: '.en', languageCode: 'en', kind: '' }),
      isSubtitlesOn: () => enabled,
      toggleSubtitles: toggle,
    });
    dispose = installYoutubeBridge(win);
    read('native-selection', undefined, true);
    await settle();
    expect(responses().at(-1)?.snapshot.track?.id).toBe('.en');
    expect(new URL(String(fetched.mock.calls[0][0])).searchParams.get('lang')).toBe('en');
    expect(enabled).toBe(true);
    stop();
    expect(enabled).toBe(false);
    expect(toggle).toHaveBeenCalledTimes(2);
  });
  it('keeps the confirmed source through an empty player selection, follows explicit changes, and resets on a new video', async () => {
    const player = win.document.querySelector('#movie_player')!;
    let videoId = 'video_123';
    let selected: { vss_id?: string; languageCode?: string } | undefined = { vss_id: '.en', languageCode: 'en' };
    Object.assign(player, {
      getPlayerResponse: () => ({
        videoDetails: { videoId },
        captions: {
          playerCaptionsTracklistRenderer: {
            captionTracks: [
              {
                vssId: '.ar',
                languageCode: 'ar',
                baseUrl: `https://www.youtube.com/api/timedtext?v=${videoId}&lang=ar`,
              },
              { ...track, baseUrl: `https://www.youtube.com/api/timedtext?v=${videoId}&lang=en` },
            ],
          },
        },
      }),
      getOption: () => selected,
    });
    dispose = installYoutubeBridge(win);
    read('english');
    await settle();
    expect(responses().at(-1)?.snapshot.track?.id).toBe('.en');
    selected = undefined;
    await vi.advanceTimersByTimeAsync(250);
    read('temporarily-empty', '.en');
    await settle();
    expect(responses().at(-1)?.snapshot.track?.id).toBe('.en');
    selected = {};
    await vi.advanceTimersByTimeAsync(250);
    read('empty-object', '.en');
    await settle();
    expect(responses().at(-1)?.snapshot.track?.id).toBe('.en');
    expect(fetched).toHaveBeenCalledTimes(1);
    selected = { vss_id: '.ar', languageCode: 'ar' };
    await vi.advanceTimersByTimeAsync(250);
    read('explicit-arabic');
    await settle();
    expect(responses().at(-1)?.snapshot.track?.id).toBe('.ar');
    expect(new URL(String(fetched.mock.calls.at(-1)?.[0])).searchParams.get('lang')).toBe('ar');
    selected = { vss_id: '.en', languageCode: 'en' };
    await vi.advanceTimersByTimeAsync(250);
    read('explicit-english');
    await settle();
    expect(responses().at(-1)?.snapshot.track?.id).toBe('.en');
    videoId = 'other_123';
    selected = undefined;
    browser.happyDOM.setURL(`https://www.youtube.com/watch?v=${videoId}`);
    await vi.advanceTimersByTimeAsync(250);
    read('new-video');
    await settle();
    expect(responses().at(-1)?.snapshot.track?.id).toBe('.ar');
    expect(new URL(String(fetched.mock.calls.at(-1)?.[0])).searchParams.get('v')).toBe('other_123');
  });
  it('preserves native CC off/on button intent and does not reopen captions on the next polling read', async () => {
    const player = win.document.querySelector('#movie_player')!;
    let enabled = false;
    const toggle = vi.fn(() => {
      enabled = !enabled;
    });
    Object.assign(player, { isSubtitlesOn: () => enabled, toggleSubtitles: toggle });
    const button = win.document.createElement('button');
    button.className = 'ytp-subtitles-button';
    button.addEventListener('click', () => {
      enabled = !enabled;
    });
    player.append(button);
    dispose = installYoutubeBridge(win);
    read('enable', undefined, true);
    await settle();
    expect(enabled).toBe(true);
    button.click();
    expect(enabled).toBe(false);
    await vi.advanceTimersByTimeAsync(250);
    read('poll-after-user-off', '.en', true);
    await settle();
    expect(enabled).toBe(false);
    button.click();
    expect(enabled).toBe(true);
    stop();
    expect(enabled).toBe(true);
    expect(toggle).toHaveBeenCalledTimes(1);
    expect((player as typeof player & { toggleSubtitles: unknown }).toggleSubtitles).toBe(toggle);
  });
  it('preserves native CC off/on API operations in the same track without mistaking its own toggles for user changes', async () => {
    const player = win.document.querySelector('#movie_player')! as HTMLElement & { toggleSubtitles(): void };
    let enabled = false;
    const toggle = vi.fn(() => {
      enabled = !enabled;
    });
    Object.assign(player, { isSubtitlesOn: () => enabled, toggleSubtitles: toggle });
    dispose = installYoutubeBridge(win);
    read('enable', undefined, true);
    await settle();
    Reflect.apply(player.toggleSubtitles, player, ['external-user-toggle']);
    player.toggleSubtitles();
    expect(toggle).toHaveBeenNthCalledWith(2, 'external-user-toggle');
    expect(enabled).toBe(true);
    stop();
    expect(enabled).toBe(true);
    expect(toggle).toHaveBeenCalledTimes(3);
    expect(player.toggleSubtitles).toBe(toggle);
  });
  it('tracks internal caption state transitions between polls while excluding its own asynchronous button update', async () => {
    const player = win.document.querySelector('#movie_player')!;
    let enabled = false;
    const button = win.document.createElement('button');
    button.className = 'ytp-subtitles-button';
    button.setAttribute('aria-pressed', 'false');
    player.append(button);
    const toggle = vi.fn(() => {
      enabled = !enabled;
      button.setAttribute('aria-pressed', String(enabled));
    });
    Object.assign(player, { isSubtitlesOn: () => enabled, toggleSubtitles: toggle });
    dispose = installYoutubeBridge(win);
    read('enable', undefined, true);
    await settle();
    await vi.advanceTimersByTimeAsync(0);
    stop();
    expect(enabled).toBe(false); // Own API/observer transition retained custody.
    read('restart', undefined, true);
    await settle();
    await vi.advanceTimersByTimeAsync(0);
    expect(enabled).toBe(true);
    // The native settings menu can change CC internally without calling the public API.
    enabled = false;
    button.setAttribute('aria-pressed', 'false');
    enabled = true;
    button.setAttribute('aria-pressed', 'true');
    await vi.advanceTimersByTimeAsync(0);
    stop();
    expect(enabled).toBe(true);
    expect(toggle).toHaveBeenCalledTimes(3);
  });
  it('respects CC keyboard operations but ignores C typed in an editable field', async () => {
    const player = win.document.querySelector('#movie_player')!;
    let enabled = false;
    const toggle = vi.fn(() => {
      enabled = !enabled;
    });
    Object.assign(player, { isSubtitlesOn: () => enabled, toggleSubtitles: toggle });
    dispose = installYoutubeBridge(win);
    read('enable', undefined, true);
    await settle();
    const input = win.document.createElement('input');
    player.append(input);
    input.dispatchEvent(new browser.KeyboardEvent('keydown', { key: 'c', bubbles: true }) as unknown as Event);
    const ownHost = win.document.createElement(`${PROJECT_PREFIX}-video-subtitles`);
    const ownButton = win.document.createElement('button');
    ownHost.attachShadow({ mode: 'open' }).append(ownButton);
    player.append(ownHost);
    ownButton.dispatchEvent(
      new browser.KeyboardEvent('keydown', { key: 'c', bubbles: true, composed: true }) as unknown as Event
    );
    stop();
    expect(enabled).toBe(false);
    read('restart', undefined, true);
    await settle();
    expect(enabled).toBe(true);
    player.dispatchEvent(new browser.KeyboardEvent('keydown', { key: 'c', bubbles: true }) as unknown as Event);
    enabled = false;
    player.dispatchEvent(new browser.KeyboardEvent('keydown', { key: 'c', bubbles: true }) as unknown as Event);
    enabled = true;
    stop();
    expect(enabled).toBe(true);
    expect(toggle).toHaveBeenCalledTimes(3);
  });
  it('caps direct acquisition at three attempts and still recovers from a later native capture', async () => {
    fetched.mockImplementation(async () => new Response('', { status: 403 }));
    dispose = installYoutubeBridge(win);
    for (let attempt = 0; attempt < 3; attempt += 1) {
      read(`attempt-${attempt}`);
      await settle();
      await vi.advanceTimersByTimeAsync(10_000);
    }
    read('exhausted');
    await settle();
    expect(fetched).toHaveBeenCalledTimes(3);
    expect(responses().at(-1)?.error).toBe('fetch');
    fetched.mockResolvedValueOnce(new Response(body));
    await win.fetch(baseUrl);
    await settle();
    await vi.advanceTimersByTimeAsync(250);
    read('native-recovered');
    await settle();
    expect(fetched).toHaveBeenCalledTimes(4);
    expect(responses().at(-1)?.text).toBe(body);
  });

  it('allows explicit retry to reset an exhausted ordinary acquisition budget', async () => {
    fetched.mockImplementation(async () => new Response('', { status: 403 }));
    dispose = installYoutubeBridge(win);
    for (let attempt = 0; attempt < 3; attempt += 1) {
      read(`attempt-${attempt}`);
      await settle();
      await vi.advanceTimersByTimeAsync(10_000);
    }
    read('retry', undefined, false, true);
    await settle();
    expect(fetched).toHaveBeenCalledTimes(4);
  });

  it('does not let explicit retry or stop/restart bypass the minimum 429 cooldown', async () => {
    fetched.mockImplementation(async () => new Response('', { status: 429 }));
    dispose = installYoutubeBridge(win);
    read();
    await settle();
    await vi.advanceTimersByTimeAsync(250);
    read('retry-now', undefined, false, true);
    await settle();
    expect(fetched).toHaveBeenCalledTimes(1);
    expect(responses().at(-1)?.error).toBe('rateLimit');
    stop();
    read('restart', undefined, false, true);
    await settle();
    expect(fetched).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(60_000);
    read('retry-after-cooldown', undefined, false, true);
    await settle();
    expect(fetched).toHaveBeenCalledTimes(2);
  });
});
