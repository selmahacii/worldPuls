/**
 * Simple in-memory TTL cache for API responses.
 * Prevents hammering external APIs when multiple requests come in.
 */

interface CacheEntry<T> {
  value: T;
  expires: number;
}

class MemoryCache {
  private store: Map<string, CacheEntry<unknown>> = new Map();

  /**
   * Get a cached value if it exists and hasn't expired.
   */
  get<T>(key: string, fallback?: T): T | undefined {
    const entry = this.store.get(key);
    if (!entry) {
      return fallback;
    }
    if (Date.now() > entry.expires) {
      this.store.delete(key);
      return fallback;
    }
    return entry.value as T;
  }

  /**
   * Set a value with TTL in seconds.
   */
  set<T>(key: string, value: T, ttlSeconds: number = 30): void {
    this.store.set(key, {
      value,
      expires: Date.now() + ttlSeconds * 1000,
    });
  }

  /**
   * Remove a cached value.
   */
  invalidate(key: string): void {
    this.store.delete(key);
  }

  /**
   * Clear all cached values.
   */
  clear(): void {
    this.store.clear();
  }
}

// Export singleton instance
export const cache = new MemoryCache();

// Cache keys for each data source
export const CACHE_KEYS = {
  FLIGHTS: 'world-pulse:flights',
  CRYPTO_PRICE: 'world-pulse:crypto-price',
  MARKETS: 'world-pulse:markets',
  SPORTS: 'world-pulse:sports',
} as const;
