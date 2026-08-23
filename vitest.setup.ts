import { fakeBrowser } from 'wxt/testing';
import { beforeEach } from 'vitest';

// Reset the in-memory extension APIs (storage, etc.) between tests so storage
// state and onChanged listeners never leak across cases.
beforeEach(() => {
  fakeBrowser.reset();
});
