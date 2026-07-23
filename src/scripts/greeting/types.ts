export interface GeoResponse {
  success: boolean;
  country_code: string;
  country: string;
}

export interface GeoResult {
  countryCode: string;
  primaryLanguage: string;
}

export interface TranslationResponse {
  responseData: {
    translatedText: string;
    match: number;
  };
  responseStatus: number;
}

export interface CachedGreeting {
  greeting: string;
  language: string;
  timestamp: number;
}

export const CONFIG = {
  DEFAULT_GREETING: "Hello",
  GEO_API: "https://ipwho.is/",
  TRANSLATION_API: "https://api.mymemory.translated.net/get",
  API_TIMEOUT_MS: 3000,
  CACHE_KEY: "dagim_greeting",
  CACHE_TTL_MS: 24 * 60 * 60 * 1000,
  ELEMENT_ID: "greeting-text",
  DECIPHER: {
    DURATION_MS: 1800,
    TICK_INTERVAL_MS: 40,
    START_DELAY_MS: 600,
  },
} as const;
