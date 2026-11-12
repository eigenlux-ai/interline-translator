import { observeSubtitleDiagnostics, type SubtitleDiagnostic } from '@/core/subtitles/diagnostics';

/** Send bounded metadata batches only while the subtitle UI is mounted. */
export function relaySubtitleDiagnostics() {
  let pending: SubtitleDiagnostic[] = [];
  let timer: ReturnType<typeof setTimeout> | undefined;
  let stopped = false;
  const flush = () => {
    timer = undefined;
    const events = pending;
    pending = [];
    if (events.length) {
      try {
        void browser.runtime.sendMessage({ type: 'subtitle:diagnostics', version: 1, events }).catch(() => {});
      } catch {
        /* Extension reload must not break cleanup. */
      }
    }
  };
  const unwatch = observeSubtitleDiagnostics((event) => {
    if (stopped) return;
    pending.push(event);
    if (pending.length > 32) pending.shift();
    timer ??= setTimeout(flush, 1000);
  });
  return () => {
    stopped = true;
    unwatch();
    if (timer) clearTimeout(timer);
    flush();
  };
}
