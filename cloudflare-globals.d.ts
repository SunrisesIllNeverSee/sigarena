/**
 * Cloudflare Worker runtime globals — minimal type declarations for the
 * Cache API (caches.default) used by lib/api.ts for edge caching.
 *
 * These are only available at runtime in the Cloudflare Worker, not during
 * Next.js build (static generation) or local dev. The code guards with
 * `typeof caches !== "undefined"` so the types only need to satisfy tsc.
 */

interface Cache {
  match(request: RequestInfo | URL): Promise<Response | undefined>;
  put(request: RequestInfo | URL, response: Response): Promise<void>;
  delete(request: RequestInfo | URL): Promise<boolean>;
}

interface CacheStorage {
  readonly default: Cache;
  open(cacheName: string): Promise<Cache>;
}

declare const caches: CacheStorage;
