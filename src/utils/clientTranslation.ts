// Client-side translation utility
// This runs in the browser and can be imported by client-side scripts

interface MyMemoryResponse {
  responseData: {
    translatedText: string;
  };
  quotaFinished?: boolean;
  mtLangSupported?: boolean;
  responseDetails?: string;
  responseStatus?: number;
}

// Client-side cache to reduce API calls
const clientTranslationCache = new Map<string, string>();

/**
 * Client-side translation using MyMemory API
 * @param text Text to translate
 * @param targetLang Target language code (e.g., 'es', 'fr', 'de')
 * @param sourceLang Source language code (default: 'en')
 * @returns Translated text
 */
export async function translateText(
  text: string,
  targetLang: string,
  sourceLang: string = "en"
): Promise<string> {
  // Don't translate if source and target languages are the same
  if (sourceLang === targetLang) {
    return text;
  }

  const cacheKey = `${text}-${sourceLang}-${targetLang}`;

  // Check cache first
  if (clientTranslationCache.has(cacheKey)) {
    return clientTranslationCache.get(cacheKey)!;
  }

  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`
    );

    if (!response.ok) {
      throw new Error(`MyMemory failed: ${response.status}`);
    }

    const data: MyMemoryResponse = await response.json();
    const translatedText = data.responseData?.translatedText || text;

    // Check if the translation is valid (not an error message)
    if (translatedText.includes("PLEASE SELECT TWO DISTINCT LANGUAGES") || 
        translatedText.includes("ERROR") ||
        translatedText.includes("INVALID TARGET LANGUAGE") ||
        translatedText.includes("LANGPAIR=") ||
        translatedText === text) {
      console.warn(`Invalid translation result: ${translatedText}`);
      return text;
    }

    // Cache the result
    clientTranslationCache.set(cacheKey, translatedText);

    return translatedText;
  } catch (error) {
    console.error("Client translation error:", error);
    return text; // Return original text on error
  }
}

/**
 * Clear client-side translation cache
 */
export function clearClientTranslationCache(): void {
  clientTranslationCache.clear();
}

/**
 * Get client-side cache size
 */
export function getClientCacheSize(): number {
  return clientTranslationCache.size;
}
