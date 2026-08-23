/**
 * @module test-utils/config
 *
 * Shared Config fixture for unit tests — built on `defaultConfig()` so a new
 * required Config field lands in every test automatically instead of breaking
 * N hand-written literals (the exact tax the PromptStyle/glossary rollouts
 * paid three times over). TEST-ONLY: production code must never import this.
 */

import type { Config } from '@/data/models';
import { defaultConfig } from '@/services/config/schema';

/** A full valid Config with shallow node overrides. */
export function makeTestConfig(overrides: Partial<Config> = {}): Config {
  return { ...defaultConfig(), ...overrides };
}
