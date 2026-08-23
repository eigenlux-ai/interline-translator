/**
 * @module services
 *
 * Aggregate registration of every background-side proxy service. Called ONCE
 * from `entrypoints/background.ts`. This is the ONLY module outside the
 * background entrypoint allowed to import service `impl.ts` files — it pulls
 * the heavy implementations (ai-sdk/dexie) into the background bundle and
 * nowhere else.
 */

import { registerTranslationService } from './translation/impl';

export function registerAllServices() {
  registerTranslationService();
}
