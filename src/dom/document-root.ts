/** Observe root replacement without watching every editor mutation in the subtree. */
export function watchDocumentRoot(onChange: () => void): () => void {
  let root = document.documentElement;
  const observer = new MutationObserver(() => {
    // document.open() may deliver "root removed" and "root added" separately;
    // only the new root is a replacement worth reporting.
    const next = document.documentElement;
    if (!next || next === root) return;
    root = next;
    onChange();
  });
  observer.observe(document, { childList: true });
  return () => observer.disconnect();
}
