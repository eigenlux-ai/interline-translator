/** Observe root replacement without watching every editor mutation in the subtree. */
export function watchDocumentRoot(onChange: () => void): () => void {
  let root = document.documentElement;
  const observer = new MutationObserver(() => {
    if (document.documentElement === root) return;
    root = document.documentElement;
    onChange();
  });
  observer.observe(document, { childList: true });
  return () => observer.disconnect();
}
