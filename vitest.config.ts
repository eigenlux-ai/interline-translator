import { WxtVitest } from 'wxt/testing';
import { defineConfig } from 'vitest/config';

// WxtVitest wires the `@`/`~` path aliases and a fake `#imports` (browser /
// storage, via @webext-core/fake-browser) so tests resolve the same module
// graph as the build. happy-dom gives DOM + MutationObserver for the satellite
// custody and useExtStorage (renderHook) tests; pure-logic tests run fine in it
// too. NOTE: behaviours that need a real layout engine / compositor
// (computeHostRemScale's min-font-size clamping, elementsFromPoint hit-tests)
// are deliberately NOT unit-tested — happy-dom would give false confidence;
// they stay browser-verified by hand.
export default defineConfig({
  plugins: [WxtVitest()],
  test: {
    environment: 'happy-dom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'vite-plugins/**/*.test.ts'],
  },
});
