import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SubtitleTimeline } from '@/core/subtitles';
import type { SubtitleTranslationEvent, SubtitleWindow } from '@/services/subtitles/protocol';
import { defaultVideoSubtitles } from '../../services/config/video-subtitles';
import type { VideoPlatformAdapter, VideoSubtitleSourceEvent } from './platform';
import {
  createSubtitleRuntime,
  createYoutubeSubtitleRuntime,
  type VideoSubtitleRuntimePorts,
  type VideoSubtitleSettings,
  type VideoSubtitleView,
} from './runtime';
import { BRIDGE_REQUEST, BRIDGE_RESPONSE } from './youtube/bridge-protocol';

const settings = (): VideoSubtitleSettings => ({
  config: defaultVideoSubtitles(),
  allowed: true,
  targetLanguage: 'zh-CN',
  providerId: 'test',
  providerKind: 'google-mt',
  providers: [],
});
let runtime: ReturnType<typeof createYoutubeSubtitleRuntime>;
let actions: Parameters<VideoSubtitleRuntimePorts['render']>[1];
let latest: VideoSubtitleView;
let windows: SubtitleWindow[];
let emit: (event: SubtitleTranslationEvent) => void;
let disconnect: () => void;
let video: HTMLVideoElement;
let close = vi.fn<() => void>();
let renderFailure = false;
let rendererConnected = true;
function setup(auto = false) {
  rendererConnected = true;
  const config = settings();
  config.config.platforms.youtube.autoEnable = auto;
  document.body.innerHTML =
    '<div id="movie_player"><video></video><div class="ytp-caption-window-container"><span class="ytp-caption-segment"></span></div></div>';
  video = document.querySelector('video')!;
  windows = [];
  close = vi.fn();
  runtime = createYoutubeSubtitleRuntime(window, config, {
    render: (_player, a) => {
      actions = a;
      rendererConnected = true;
      return {
        isConnected: () => rendererConnected,
        render: (value) => {
          if (renderFailure) throw new Error('renderer failed');
          latest = value;
        },
        dispose: vi.fn(),
      };
    },
    connect: (handlers) => {
      emit = handlers.onEvent;
      disconnect = handlers.onDisconnect;
      return {
        updateWindow: (value) => {
          windows.push(value);
        },
        close,
      };
    },
    patch: vi.fn().mockResolvedValue(undefined),
    more: vi.fn(),
  });
  return config;
}
function track(text = 'Hello world', trackId = 'en', live = false) {
  const calls = vi.mocked(window.postMessage).mock.calls;
  const request = [...calls]
    .reverse()
    .find(([data]) => data.type === BRIDGE_REQUEST && data.action === 'read' && !data.targetLanguage)![0];
  window.dispatchEvent(
    new MessageEvent('message', {
      source: window,
      origin: location.origin,
      data: {
        type: BRIDGE_RESPONSE,
        version: 1,
        requestId: request.requestId,
        snapshot: {
          videoId: 'abcdefghi12',
          title: 'Example',
          live,
          ad: false,
          hasTracks: true,
          track: { id: trackId, language: 'en', kind: 'manual' },
        },
        text: JSON.stringify({
          events: [
            { tStartMs: 0, dDurationMs: 5000, segs: [{ utf8: text }] },
            { tStartMs: 6000, dDurationMs: 4000, segs: [{ utf8: 'Next line' }] },
          ],
        }),
      },
    })
  );
}
function livePacket(revision: number, cues: { start: number; end: number; text: string }[]) {
  const request = [...vi.mocked(window.postMessage).mock.calls]
    .reverse()
    .find(([data]) => data.type === BRIDGE_REQUEST && data.action === 'read' && !data.targetLanguage)![0];
  window.dispatchEvent(
    new MessageEvent('message', {
      source: window,
      origin: location.origin,
      data: {
        type: BRIDGE_RESPONSE,
        version: 1,
        requestId: request.requestId,
        snapshot: {
          videoId: 'abcdefghi12',
          title: 'Live',
          live: true,
          ad: false,
          hasTracks: true,
          track: { id: 'en', language: 'en', kind: 'auto' },
        },
        liveRevision: revision,
        text: JSON.stringify({
          events: cues.map((c) => ({ tStartMs: c.start, dDurationMs: c.end - c.start, segs: [{ utf8: c.text }] })),
        }),
      },
    })
  );
}
function targetTrack(
  cues: { tStartMs: number; dDurationMs: number; segs: { utf8: string }[] }[] | null,
  requestId?: string
) {
  const request = [...vi.mocked(window.postMessage).mock.calls]
    .reverse()
    .find(([data]) => data.type === BRIDGE_REQUEST && data.action === 'read' && data.targetLanguage)![0];
  window.dispatchEvent(
    new MessageEvent('message', {
      source: window,
      origin: location.origin,
      data: {
        type: BRIDGE_RESPONSE,
        version: 1,
        requestId: requestId ?? request.requestId,
        snapshot: {
          videoId: 'abcdefghi12',
          title: 'Example',
          ad: false,
          hasTracks: true,
          track: cues ? { id: '.zh-Hans', language: 'zh-Hans', kind: 'manual' } : null,
        },
        ...(cues ? { text: JSON.stringify({ events: cues }) } : {}),
      },
    })
  );
  return request.requestId as string;
}
function complete(windowValue = windows.at(-1)!, text = '你好') {
  const sub = windowValue.subscriptions[0];
  emit({
    version: 1,
    type: 'completed',
    generation: windowValue.generation,
    trackVersion: windowValue.trackVersion,
    ...sub,
    text,
  });
}
beforeEach(() => {
  vi.spyOn(Math, 'random').mockReturnValue(0);
  vi.useFakeTimers();
  renderFailure = false;
  window.location.href = 'https://www.youtube.com/watch?v=abcdefghi12';
  vi.spyOn(window, 'postMessage').mockImplementation(() => {});
});
afterEach(() => {
  runtime?.dispose();
  vi.restoreAllMocks();
  vi.useRealTimers();
  document.body.innerHTML = '';
});
describe('YouTube subtitle runtime integration', () => {
  it('appends live packets without losing translations and rejects revised or out-of-order results', () => {
    setup(true);
    const first = { start: 0, end: 5000, text: 'First' };
    livePacket(1, [first]);
    const originalRequest = windows.at(-1)!;
    complete(originalRequest, '第一句');
    const closes = close.mock.calls.length;
    livePacket(2, [first, { start: 6000, end: 9000, text: 'Second' }]);
    expect(latest.translation).toBe('第一句');
    expect(close).toHaveBeenCalledTimes(closes);
    expect(windows.at(-1)!.generation).toBe(originalRequest.generation);
    livePacket(3, [{ ...first, text: 'Revised' }]);
    expect(latest.original).toBe('Revised');
    expect(latest.translation).toBe('');
    complete(originalRequest, '迟到的旧句');
    expect(latest.translation).toBe('');
    complete(undefined, '修订句');
    expect(latest.translation).toBe('修订句');
    livePacket(2, [first]);
    expect(latest.original).toBe('Revised');
  });

  it('reuses in-band live translations after DVR seeks but not after configuration changes', async () => {
    const config = setup(true);
    track('ignored finite body', 'en', true);
    await vi.advanceTimersByTimeAsync(3000);
    const caption = document.querySelector('.ytp-caption-segment')!;
    caption.textContent = 'First native line';
    await vi.advanceTimersByTimeAsync(500);
    complete(undefined, '第一句原生字幕');
    caption.textContent = 'Second native line';
    await vi.advanceTimersByTimeAsync(500);
    complete(undefined, '第二句原生字幕');
    Object.defineProperty(video, 'seeking', { configurable: true, value: true });
    video.dispatchEvent(new Event('seeking'));
    Object.defineProperty(video, 'seeking', { configurable: true, value: false });
    video.dispatchEvent(new Event('seeked'));
    caption.textContent = 'First native line';
    await vi.advanceTimersByTimeAsync(500);
    expect(latest.translation).toBe('第一句原生字幕');
    video.dispatchEvent(new Event('emptied'));
    expect(latest.original).toBe('');
    expect(latest.translation).toBe('');
    caption.textContent = 'Fresh after reload';
    await vi.advanceTimersByTimeAsync(500);
    caption.textContent = 'First native line';
    await vi.advanceTimersByTimeAsync(500);
    expect(latest.translation).toBe('');
    complete(undefined, '重新翻译');
    expect(latest.translation).toBe('重新翻译');
    runtime.configure({ ...config, targetLanguage: 'ja' });
    expect(latest.translation).toBe('');
  });

  it('lets an in-flight live prefix finish through word growth, but discards corrections', async () => {
    setup(true);
    track('ignored', 'en', true);
    await vi.advanceTimersByTimeAsync(3000);
    const caption = document.querySelector('.ytp-caption-segment')!;
    caption.textContent = 'A live sentence';
    await vi.advanceTimersByTimeAsync(500);
    const pending = windows.at(-1)!;
    caption.textContent = 'A live sentence keeps growing';
    await vi.advanceTimersByTimeAsync(1600);
    expect(windows.at(-1)?.subscriptions[0]?.subscriptionId).toBe(pending.subscriptions[0].subscriptionId);
    complete(pending, '直播句子');
    expect(latest.translation).toBe('直播句子');
    caption.textContent = 'A corrected sentence';
    await vi.advanceTimersByTimeAsync(500);
    complete(pending, '旧前缀');
    expect(latest.translation).toBe('');
    complete(undefined, '修订后的句子');
    expect(latest.translation).toBe('修订后的句子');
  });

  it('does not let a late live prefix overwrite a full cached translation', async () => {
    setup(true);
    track('ignored', 'en', true);
    await vi.advanceTimersByTimeAsync(3000);
    const caption = document.querySelector('.ytp-caption-segment')!;
    caption.textContent = 'A full sentence';
    await vi.advanceTimersByTimeAsync(500);
    complete(undefined, '完整译文');
    caption.textContent = 'Another sentence';
    await vi.advanceTimersByTimeAsync(500);
    caption.textContent = 'A full';
    await vi.advanceTimersByTimeAsync(500);
    const prefix = windows.at(-1)!;
    caption.textContent = 'A full sentence';
    await vi.advanceTimersByTimeAsync(500);
    expect(latest.translation).toBe('完整译文');
    complete(prefix, '不完整');
    expect(latest.translation).toBe('完整译文');
  });

  it('evicts old in-band translations after the bounded history fills', async () => {
    setup(true);
    track('ignored', 'en', true);
    await vi.advanceTimersByTimeAsync(3000);
    const caption = document.querySelector('.ytp-caption-segment')!;
    for (let i = 0; i < 257; i += 1) {
      caption.textContent = `Native ${i}`;
      await vi.advanceTimersByTimeAsync(500);
      complete(undefined, `译文 ${i}`);
    }
    caption.textContent = 'Native 0';
    await vi.advanceTimersByTimeAsync(500);
    expect(latest.translation).toBe('');
    expect(windows.at(-1)?.subscriptions[0]?.text).toBe('Native 0');
  });

  it('starts a new live epoch on media reload and ignores the old pending packet', () => {
    setup(true);
    livePacket(1, [{ start: 0, end: 5000, text: 'Old stream' }]);
    const old = windows.at(-1)!;
    complete(old, '旧流');
    video.dispatchEvent(new Event('emptied'));
    expect(latest.original).toBe('');
    livePacket(2, [{ start: 0, end: 5000, text: 'Stale response' }]);
    expect(latest.original).toBe('');
    vi.advanceTimersByTime(1000);
    livePacket(3, [{ start: 0, end: 5000, text: 'New stream' }]);
    complete(old, '迟到');
    expect(latest.original).toBe('New stream');
    expect(latest.translation).toBe('');
    complete(undefined, '新流');
    expect(latest.translation).toBe('新流');
  });

  it('uses fresh DOM captions in unbuffered DVR ranges and resumes timed live cues', async () => {
    setup(true);
    livePacket(1, [{ start: 0, end: 5000, text: 'First' }]);
    complete(undefined, '第一句');
    video.currentTime = 100;
    Object.defineProperty(video, 'seeking', { configurable: true, value: true });
    video.dispatchEvent(new Event('seeking'));
    expect(latest.original).toBe('');
    Object.defineProperty(video, 'seeking', { configurable: true, value: false });
    video.dispatchEvent(new Event('seeked'));
    document.querySelector('.ytp-caption-segment')!.textContent = 'Fresh DVR caption';
    await vi.advanceTimersByTimeAsync(3000);
    expect(latest.original).toBe('Fresh DVR caption');
    await vi.advanceTimersByTimeAsync(500);
    expect(windows.at(-1)?.subscriptions[0]?.cueId).toBe('current');
    complete(undefined, '回看字幕');
    expect(latest.translation).toBe('回看字幕');
    livePacket(2, [{ start: 100000, end: 105000, text: 'Timed recovery' }]);
    expect(latest.original).toBe('Timed recovery');
    complete(undefined, '时间轴恢复');
    expect(latest.translation).toBe('时间轴恢复');
    video.currentTime = 1;
    video.dispatchEvent(new Event('timeupdate'));
    expect(latest.translation).toBe('第一句');
  });

  it('reuses the opening subtitle after a loop without showing the ending translation', () => {
    setup(true);
    track();
    complete(undefined, '开头');
    expect(latest.translation).toBe('开头');
    video.currentTime = 7;
    video.dispatchEvent(new Event('timeupdate'));
    expect(latest.original).toBe('Next line');
    complete(undefined, '结尾');
    expect(latest.translation).toBe('结尾');
    video.currentTime = 0;
    video.dispatchEvent(new Event('timeupdate'));
    expect(latest.original).toBe('Hello world');
    expect(latest.translation).toBe('开头');
    expect(latest.enabled).toBe(true);
  });

  it('uses independent human target timings, skips covered requests and translates uncovered intervals', () => {
    const config = setup();
    config.config.translation.preferHumanCaptions = true;
    runtime.configure(config);
    actions.toggle();
    track();
    expect(windows).toHaveLength(0);
    targetTrack([
      { tStartMs: 0, dDurationMs: 2000, segs: [{ utf8: '人工第一句' }] },
      { tStartMs: 2000, dDurationMs: 2000, segs: [{ utf8: '人工第二句' }] },
      { tStartMs: 6000, dDurationMs: 4000, segs: [{ utf8: '人工下一句' }] },
    ]);
    expect(latest.original).toBe('Hello world');
    expect(latest.translation).toBe('人工第一句');
    expect(windows).toHaveLength(0);
    video.currentTime = 2.5;
    video.dispatchEvent(new Event('timeupdate'));
    expect(latest.original).toBe('Hello world');
    expect(latest.translation).toBe('人工第二句');
    video.currentTime = 4.5;
    video.dispatchEvent(new Event('timeupdate'));
    expect(windows.at(-1)?.subscriptions.map((item) => item.text)).toEqual(['Hello world']);
    complete(undefined, '机器补空档');
    expect(latest.translation).toBe('机器补空档');
    video.currentTime = 2.5;
    video.dispatchEvent(new Event('timeupdate'));
    expect(latest.translation).toBe('人工第二句');
    runtime.configure({
      ...config,
      config: { ...config.config, translation: { ...config.config.translation, preferHumanCaptions: false } },
    });
    expect(latest.translation).toBe('机器补空档');
  });

  it('does not let a missing or delayed human track block machine fallback or revive after disabling', () => {
    const config = setup();
    config.config.translation.preferHumanCaptions = true;
    runtime.configure(config);
    actions.toggle();
    track();
    const id = targetTrack(null);
    expect(windows.at(-1)?.subscriptions[0].text).toBe('Hello world');
    runtime.configure({
      ...config,
      config: { ...config.config, translation: { ...config.config.translation, preferHumanCaptions: false } },
    });
    targetTrack([{ tStartMs: 0, dDurationMs: 5000, segs: [{ utf8: '过期人工字幕' }] }], id);
    expect(latest.translation).not.toBe('过期人工字幕');
  });

  it('bounds the initial human-caption wait when the target request never completes', () => {
    const config = setup();
    config.config.translation.preferHumanCaptions = true;
    runtime.configure(config);
    actions.toggle();
    track();
    expect(windows).toHaveLength(0);
    vi.advanceTimersByTime(2000);
    expect(windows.at(-1)?.subscriptions[0].text).toBe('Hello world');
  });

  it('stays manual by default, plans a bounded window and displays individual results', () => {
    setup();
    expect(latest.enabled).toBe(false);
    expect(windows).toHaveLength(0);
    actions.toggle();
    track();
    expect(latest.original).toBe('Hello world');
    expect(windows.at(-1)?.subscriptions.map((item) => item.priority)).toEqual(['current', 'prefetch']);
    complete();
    expect(latest.translation).toBe('你好');
    actions.toggle();
    expect(latest.original).toBe('');
    expect(close).toHaveBeenCalled();
    expect(document.querySelector('#movie_player style')).toBeNull();
  });
  it('rejects late results after language config changes and SPA video navigation', () => {
    const config = setup(true);
    track();
    const old = windows.at(-1)!;
    runtime.configure({ ...config, targetLanguage: 'ja' });
    complete(old);
    expect(latest.translation).toBe('');
    window.history.replaceState({}, '', '/watch?v=zyxwvutsr12');
    vi.advanceTimersByTime(1000);
    complete(old);
    expect(latest.original).toBe('');
    expect(latest.translation).toBe('');
  });
  it('clears subtitle output and subscriptions during ads, and resumes on content', () => {
    setup(true);
    track();
    complete();
    document.querySelector('#movie_player')!.classList.add('ad-showing');
    video.dispatchEvent(new Event('timeupdate'));
    expect(latest.original).toBe('');
    expect(latest.translation).toBe('');
    expect(windows.at(-1)?.subscriptions).toEqual([]);
    document.querySelector('#movie_player')!.classList.remove('ad-showing');
    video.dispatchEvent(new Event('timeupdate'));
    expect(latest.original).toBe('Hello world');
    expect(latest.translation).toBe('你好');
  });
  it('reconnects after a service disconnect and resubmits the current window', () => {
    setup(true);
    track();
    const count = windows.length;
    disconnect();
    vi.advanceTimersByTime(3000);
    expect(windows.length).toBeGreaterThan(count);
    expect(windows.at(-1)?.subscriptions[0].priority).toBe('current');
  });
  it('stabilizes DOM text and never renders an earlier text revision', () => {
    setup(true);
    vi.advanceTimersByTime(3000);
    const segment = document.querySelector('.ytp-caption-segment')!;
    segment.textContent = 'One';
    video.dispatchEvent(new Event('timeupdate'));
    vi.advanceTimersByTime(450);
    const old = windows.at(-1)!;
    expect(old.subscriptions[0].text).toBe('One');
    segment.textContent = 'One two';
    video.dispatchEvent(new Event('timeupdate'));
    complete(old);
    expect(latest.original).toBe('One two');
    expect(latest.translation).toBe('');
    vi.advanceTimersByTime(450);
    complete();
    expect(latest.translation).toBe('你好');
  });
  it('drops a complete track when a stream becomes live and keeps observing new DOM captions', async () => {
    setup(true);
    track();
    complete();
    const old = windows.at(-1)!;
    vi.advanceTimersByTime(3000);
    track('Stale complete track', 'en', true);
    complete(old);
    expect(latest.original).toBe('');
    const segment = document.querySelector('.ytp-caption-segment')!;
    segment.textContent = 'Live first';
    video.dispatchEvent(new Event('timeupdate'));
    await vi.advanceTimersByTimeAsync(450);
    expect(windows.at(-1)?.subscriptions[0].text).toBe('Live first');
    segment.textContent = 'Live second';
    video.dispatchEvent(new Event('timeupdate'));
    await vi.advanceTimersByTimeAsync(450);
    expect(windows.at(-1)?.subscriptions[0].text).toBe('Live second');
    expect(latest.original).not.toBe('Stale complete track');
  });

  it('waits for fresh DOM after seek, including paused seeks and repeated dialogue', async () => {
    setup(true);
    vi.advanceTimersByTime(3000);
    const segment = document.querySelector('.ytp-caption-segment')!;
    segment.textContent = 'Repeated line';
    video.dispatchEvent(new Event('timeupdate'));
    await vi.advanceTimersByTimeAsync(450);
    complete();
    const old = windows.at(-1)!;
    Object.defineProperty(video, 'seeking', { configurable: true, value: true });
    video.dispatchEvent(new Event('seeking'));
    video.currentTime = 50;
    Object.defineProperty(video, 'seeking', { configurable: true, value: false });
    video.dispatchEvent(new Event('seeked'));
    await vi.advanceTimersByTimeAsync(2000);
    complete(old);
    expect(latest.original).toBe('');
    expect(latest.translation).toBe('');
    segment.textContent = 'Repeated line';
    await vi.advanceTimersByTimeAsync(1500);
    expect(latest.original).toBe('Repeated line');
    expect(windows.at(-1)?.subscriptions[0].text).toBe('Repeated line');
    Object.defineProperty(video, 'seeking', { configurable: true, value: true });
    video.dispatchEvent(new Event('seeking'));
    segment.textContent = 'Updated during seek';
    await vi.advanceTimersByTimeAsync(10);
    Object.defineProperty(video, 'seeking', { configurable: true, value: false });
    video.dispatchEvent(new Event('seeked'));
    await vi.advanceTimersByTimeAsync(450);
    expect(latest.original).toBe('Updated during seek');
  });

  it('uses the native display language for DOM fallback and invalidates it independently of the source track', () => {
    setup(true);
    vi.advanceTimersByTime(3000);
    const segment = document.querySelector('.ytp-caption-segment')!;
    segment.textContent = 'Bonjour';
    const metadata = (domLanguage: string) => {
      const request = [...vi.mocked(window.postMessage).mock.calls]
        .reverse()
        .find(([data]) => data.type === BRIDGE_REQUEST && data.action === 'read' && !data.targetLanguage)![0];
      window.dispatchEvent(
        new MessageEvent('message', {
          source: window,
          origin: location.origin,
          data: {
            type: BRIDGE_RESPONSE,
            version: 1,
            requestId: request.requestId,
            error: 'fetch',
            snapshot: {
              videoId: 'abcdefghi12',
              title: '',
              ad: false,
              hasTracks: true,
              domLanguage,
              track: { id: 'en', language: 'en', kind: 'auto' },
            },
          },
        })
      );
    };
    metadata('fr');
    vi.advanceTimersByTime(450);
    expect(windows.at(-1)?.sourceLanguage).toBe('fr');
    expect(latest.sourceLanguage).toBe('fr');
    const old = windows.at(-1)!;
    complete(old, '旧译文');
    metadata('de');
    expect(latest.translation).toBe('');
    vi.advanceTimersByTime(450);
    expect(windows.at(-1)?.sourceLanguage).toBe('de');
    expect(windows.at(-1)?.generation).not.toBe(old.generation);
    complete(old, '迟到的旧译文');
    expect(latest.translation).toBe('');
    track();
    expect(windows.at(-1)?.sourceLanguage).toBe('en');
    expect(latest.sourceLanguage).toBe('en');
  });

  it('keeps DOM fallback status through caption gaps and repeated track-fetch errors', () => {
    setup(true);
    const fetchFailure = (trackId = 'en') => {
      const request = [...vi.mocked(window.postMessage).mock.calls]
        .reverse()
        .find(([data]) => data.type === BRIDGE_REQUEST && data.action === 'read' && !data.targetLanguage)![0];
      window.dispatchEvent(
        new MessageEvent('message', {
          source: window,
          origin: location.origin,
          data: {
            type: BRIDGE_RESPONSE,
            version: 1,
            requestId: request.requestId,
            error: 'fetch',
            snapshot: {
              videoId: 'abcdefghi12',
              title: '',
              ad: false,
              hasTracks: true,
              track: { id: trackId, language: 'en', kind: 'auto' },
            },
          },
        })
      );
    };
    fetchFailure();
    expect(latest.status).toBe('fetch-failed');
    vi.advanceTimersByTime(3000);
    const segment = document.querySelector('.ytp-caption-segment')!;
    segment.textContent = 'Native captions still work';
    video.dispatchEvent(new Event('timeupdate'));
    vi.advanceTimersByTime(450);
    complete();
    expect(latest.status).toBe('dom');
    segment.textContent = '';
    video.dispatchEvent(new Event('timeupdate'));
    for (let i = 0; i < 3; i++) {
      vi.advanceTimersByTime(1000);
      fetchFailure();
      expect(latest.status).toBe('dom');
      expect(latest.original).toBe('');
    }
    fetchFailure('new-track');
    expect(latest.status).toBe('fetch-failed');
  });

  it('surfaces a DOM translation failure, keeps the original, and resubmits from retry', () => {
    setup(true);
    vi.advanceTimersByTime(3000);
    document.querySelector('.ytp-caption-segment')!.textContent = 'A stable sentence';
    video.dispatchEvent(new Event('timeupdate'));
    vi.advanceTimersByTime(450);
    const request = windows.at(-1)!;
    expect(latest.status).toBe('loading');
    emit({
      version: 1,
      type: 'failed',
      generation: request.generation,
      trackVersion: request.trackVersion,
      ...request.subscriptions[0],
      error: { code: 'translation-failed', retryable: true },
    });
    expect(latest.status).toBe('translation-failed');
    expect(latest.original).toBe('A stable sentence');
    expect(windows.at(-1)!.subscriptions).toEqual([]);
    actions.retry();
    expect(latest.status).toBe('loading');
    expect(windows.at(-1)!.subscriptions[0].text).toBe('A stable sentence');
    complete();
    expect(latest.status).toBe('dom');
    expect(latest.translation).toBe('你好');
  });
  it('restarts reconnect backoff after a recovered connection returns a valid result', () => {
    setup(true);
    track();
    disconnect();
    vi.advanceTimersByTime(2000);
    complete();
    const recoveredCount = windows.length;
    disconnect();
    vi.advanceTimersByTime(1999);
    expect(windows).toHaveLength(recoveredCount);
    vi.advanceTimersByTime(1);
    expect(windows.length).toBeGreaterThan(recoveredCount);
    expect(windows.at(-1)!.subscriptions[0].text).toBe('Next line');
  });
  it('invalidates completed results on semantic revision changes while appearance-only changes preserve them', () => {
    const config = setup(true);
    runtime.configure({ ...config, translationRevision: 'one' });
    track();
    const old = windows.at(-1)!;
    complete(old, 'Old model');
    expect(latest.translation).toBe('Old model');
    const next = { ...config, translationRevision: 'two' };
    runtime.configure(next);
    expect(latest.translation).toBe('');
    expect(windows.at(-1)!.generation).toBeGreaterThan(old.generation);
    expect(windows.at(-1)!.subscriptions[0].text).toBe('Hello world');
    complete(old, 'Late old model');
    expect(latest.translation).toBe('');
    complete(windows.at(-1)!, 'New model');
    const count = windows.length;
    runtime.configure({ ...next, config: { ...next.config, appearance: { ...next.config.appearance, fontSize: 30 } } });
    expect(latest.translation).toBe('New model');
    expect(windows).toHaveLength(count);
  });
  it('treats malformed timedtext as fetch failure without throwing or losing teardown', () => {
    setup(true);
    const request = vi.mocked(window.postMessage).mock.calls.find(([data]) => data.action === 'read')![0];
    expect(() =>
      window.dispatchEvent(
        new MessageEvent('message', {
          source: window,
          origin: location.origin,
          data: {
            type: BRIDGE_RESPONSE,
            version: 1,
            requestId: request.requestId,
            snapshot: {
              videoId: 'abcdefghi12',
              title: '',
              ad: false,
              hasTracks: true,
              track: { id: 'en', language: 'en', kind: 'manual' },
            },
            text: '{bad json',
          },
        })
      )
    ).not.toThrow();
    expect(latest.status).toBe('fetch-failed');
    actions.toggle();
    expect(latest.enabled).toBe(false);
  });
  it('preserves native captions until original text is successfully rendered and restores after render failure', () => {
    setup(true);
    expect(document.querySelector('#movie_player style')).toBeNull();
    track();
    expect(document.querySelector('#movie_player style')).not.toBeNull();
    renderFailure = true;
    expect(() => video.dispatchEvent(new Event('timeupdate'))).not.toThrow();
    expect(document.querySelector('#movie_player style')).toBeNull();
    renderFailure = false;
  });

  it('adopts a recovered track when the ad ends before its next playback event', () => {
    setup(true);
    const player = document.querySelector('#movie_player')!;
    player.classList.add('ad-showing');
    video.dispatchEvent(new Event('timeupdate'));
    player.classList.remove('ad-showing');
    track();
    expect(latest.original).toBe('Hello world');
    expect(windows.at(-1)?.subscriptions[0].text).toBe('Hello world');
  });

  it('adopts track data fetched during seeking and presents it immediately after seek completion', () => {
    setup(true);
    Object.defineProperty(video, 'seeking', { configurable: true, value: true });
    track();
    expect(latest.original).toBe('');
    Object.defineProperty(video, 'seeking', { configurable: true, value: false });
    video.dispatchEvent(new Event('seeked'));
    expect(latest.original).toBe('Hello world');
    expect(windows.at(-1)?.subscriptions[0].text).toBe('Hello world');
  });

  it('restores native captions when an asynchronous renderer reports a failure', () => {
    setup(true);
    track();
    expect(document.querySelector('#movie_player style')).not.toBeNull();
    actions.fail();
    expect(document.querySelector('#movie_player style')).toBeNull();
    expect(close).toHaveBeenCalled();
  });

  it('retranslates unchanged DOM text after a language change and preserves manual enable on media replacement', () => {
    const config = setup();
    actions.toggle();
    vi.advanceTimersByTime(3000);
    document.querySelector('.ytp-caption-segment')!.textContent = 'Still here';
    video.dispatchEvent(new Event('timeupdate'));
    vi.advanceTimersByTime(450);
    const before = windows.at(-1)!.generation;
    runtime.configure({ ...config, targetLanguage: 'ja' });
    vi.advanceTimersByTime(450);
    expect(windows.at(-1)?.subscriptions[0].text).toBe('Still here');
    expect(windows.at(-1)!.generation).toBeGreaterThan(before);
    video.replaceWith(document.createElement('video'));
    vi.advanceTimersByTime(1000);
    expect(latest.enabled).toBe(true);
  });

  it('preserves manual enable across a delayed media replacement but not a new video', () => {
    setup();
    actions.toggle();
    video.remove();
    vi.advanceTimersByTime(2000);
    document.querySelector('#movie_player')!.prepend(document.createElement('video'));
    vi.advanceTimersByTime(1000);
    expect(latest.enabled).toBe(true);
    window.history.replaceState({}, '', '/watch?v=zyxwvutsr12');
    vi.advanceTimersByTime(1000);
    expect(latest.enabled).toBe(false);
    expect(actions.uiState?.open).toBe(false);
  });

  it('remounts a removed satellite and preserves manual enable on the same player', () => {
    setup();
    actions.toggle();
    track();
    actions.saveUiState!({ open: true, focusControl: 2 });
    rendererConnected = false;
    vi.advanceTimersByTime(1000);
    expect(actions.uiState).toEqual({ open: true, focusControl: 2 });
    expect(rendererConnected).toBe(true);
    expect(latest.enabled).toBe(true);
    track();
    expect(latest.original).toBe('Hello world');
  });

  it('supports a registered non-YouTube mock and plans on cue changes rather than every frame', () => {
    const config = settings();
    Object.assign(config.config.platforms, { mock: { enabled: true, autoEnable: true } });
    let sourceListener: (event: VideoSubtitleSourceEvent) => void = () => {};
    let onFrame = () => {};
    let timeMs = 0;
    const mount = document.createElement('section');
    const adapter: VideoPlatformAdapter = {
      id: 'mock',
      capabilities: {
        timeline: true,
        currentText: false,
        trackSelection: false,
        adDetection: false,
        fullscreen: false,
      },
      videoId: () => 'mock-video',
      mount: () => mount,
      matches: () => true,
      hideNativeCaptions: () => () => {},
      playback: {
        snapshot: () => ({ timeMs, paused: false, playbackRate: 1 }),
        subscribe: () => () => {},
        subscribeFrames: (listener) => {
          onFrame = listener;
          return () => {};
        },
        dispose: () => {},
      },
      source: {
        subscribe: (listener) => {
          sourceListener = listener;
          return () => {};
        },
        dispose: () => {},
      },
      start() {
        sourceListener({
          type: 'track',
          sessionVersion: 0,
          track: {
            id: 'mock-track',
            videoId: 'mock-video',
            language: 'en',
            kind: 'manual',
            contentVersion: '1',
            cues: [
              { id: 'first', startMs: 0, endMs: 1000, text: 'First' },
              { id: 'second', startMs: 2000, endMs: 3000, text: 'Second' },
            ],
          },
        });
      },
      stop: () => {},
      poll: () => {},
      retry: () => {},
      dispose: () => {},
    };
    windows = [];
    runtime = createSubtitleRuntime(
      window,
      config,
      {
        render: () => ({
          render: (view) => {
            latest = view;
          },
          dispose: () => {},
        }),
        connect: () => ({
          updateWindow: (value) => {
            windows.push(value);
          },
          close: () => {},
        }),
        patch: async () => {},
        more: () => {},
      },
      [{ id: 'mock', create: () => adapter }]
    );
    expect(latest.original).toBe('First');
    const planned = vi.spyOn(SubtitleTimeline.prototype, 'window');
    for (let index = 0; index < 100; index += 1) onFrame();
    expect(planned).not.toHaveBeenCalled();
    timeMs = 2000;
    onFrame();
    expect(latest.original).toBe('Second');
    vi.advanceTimersByTime(1);
    expect(planned).toHaveBeenCalledTimes(1);
    expect(windows.at(-1)?.subscriptions[0].priority).toBe('current');
  });
  it('sends an explicit source retry after the read-frequency window and cancels it on shutdown', () => {
    setup(true);
    actions.retry();
    expect(vi.mocked(window.postMessage).mock.calls.some(([data]) => data.resetRetry === true)).toBe(false);
    vi.advanceTimersByTime(200);
    expect(vi.mocked(window.postMessage).mock.calls.some(([data]) => data.resetRetry === true)).toBe(true);
    actions.retry();
    actions.toggle();
    vi.mocked(window.postMessage).mockClear();
    vi.advanceTimersByTime(200);
    expect(vi.mocked(window.postMessage).mock.calls.some(([data]) => data.resetRetry === true)).toBe(false);
  });
});
