/**
 * Save an item in localStorage with an expiry time.
 * @param key The key name to store the value under.
 * @param value The value to store (any serializable data).
 * @param ttlMinutes Time to live in minutes (default: 10).
 */
export function setWithExpiry<T>(key: string, value: T, ttlMinutes: number = 10): void {
  const now = new Date();

  const item = {
    value,
    expiry: now.getTime() + ttlMinutes * 60 * 1000,
  };

  localStorage.setItem(key, JSON.stringify(item));
}

/**
 * Retrieve an item from localStorage and automatically remove it if expired.
 * @param key The key name of the stored value.
 * @returns The value if valid and not expired, otherwise null.
 */
export function getWithExpiry<T>(key: string): T | null {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  try {
    const item = JSON.parse(itemStr);
    const now = new Date();

    localStorage.removeItem(key);

    if (now.getTime() <= item.expiry) {
      return item.value as T;
    }

    return null;
  } catch (err) {
    console.error(`Error parsing localStorage item "${key}":`, err);
    localStorage.removeItem(key);
    return null;
  }
}
