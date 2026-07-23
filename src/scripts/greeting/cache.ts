import { CONFIG, type CachedGreeting } from "./types";

export function getCachedGreeting(): string | null {
  try {
    const raw = localStorage.getItem(CONFIG.CACHE_KEY);
    if (!raw) return null;

    const cached: CachedGreeting = JSON.parse(raw);

    if (
      !cached.timestamp ||
      Date.now() - cached.timestamp > CONFIG.CACHE_TTL_MS
    ) {
      localStorage.removeItem(CONFIG.CACHE_KEY);
      return null;
    }

    return cached.greeting;
  } catch {
    localStorage.removeItem(CONFIG.CACHE_KEY);
    return null;
  }
}

export function setCachedGreeting(greeting: string, language: string): void {
  try {
    const entry: CachedGreeting = {
      greeting,
      language,
      timestamp: Date.now(),
    };
    localStorage.setItem(CONFIG.CACHE_KEY, JSON.stringify(entry));
  } catch {
    // Ignore storage quota or access errors
  }
}
