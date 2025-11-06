type CacheEntry<T> = { value: T; expiresAt: number };

const DEFAULT_TTL_MIN = Number(process.env.CACHE_TTL_MINUTES || 15);
const store = new Map<string, CacheEntry<any>>();

export function cacheGet<T>(key: string): T | undefined {
  const entry = store.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return undefined;
  }
  return entry.value as T;
}

export function cacheSet<T>(key: string, value: T, ttlMinutes = DEFAULT_TTL_MIN) {
  const expiresAt = Date.now() + ttlMinutes * 60 * 1000;
  store.set(key, { value, expiresAt });
}


