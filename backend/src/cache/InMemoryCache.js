class InMemoryCache {
  constructor() {
    this.cache = new Map();
  }

  set(key, value, ttlSeconds) {
    const expiry = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { value, expiry });
  }

  get(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() > cached.expiry) {
      this.cache.delete(key);
      return null;
    }

    return cached.value;
  }

  delete(key) {
    this.cache.delete(key);
  }

  invalidatePattern(pattern) {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  clear() {
    this.cache.clear();
  }
}

const cache = new InMemoryCache();
module.exports = cache;
