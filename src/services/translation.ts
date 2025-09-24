// Removed unused interface

interface MyMemoryResponse {
  responseData: {
    translatedText: string;
  };
  quotaFinished?: boolean;
  mtLangSupported?: boolean;
  responseDetails?: string;
  responseStatus?: number;
}

// Translation cache to reduce API calls
const translationCache = new Map<string, string>();

/**
 * Translate text using MyMemory API (more reliable)
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
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  try {
    // Use MyMemory API as primary (more reliable)
    const translatedText = await translateWithMyMemory(
      text,
      targetLang,
      sourceLang
    );

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
    translationCache.set(cacheKey, translatedText);

    return translatedText;
  } catch (error) {
    console.error("Translation error:", error);
    // Return original text on error
    return text;
  }
}

/**
 * Alternative translation using MyMemory API
 * @param text Text to translate
 * @param targetLang Target language code
 * @param sourceLang Source language code
 * @returns Translated text
 */
export async function translateWithMyMemory(
  text: string,
  targetLang: string,
  sourceLang: string = "en"
): Promise<string> {
  // Don't translate if source and target languages are the same
  if (sourceLang === targetLang) {
    return text;
  }

  const cacheKey = `mymemory-${text}-${sourceLang}-${targetLang}`;

  // Check cache first
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
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
        translatedText.includes("LANGPAIR=")) {
      console.warn(`MyMemory returned error message: ${translatedText}`);
      return text;
    }

    // Cache the result
    translationCache.set(cacheKey, translatedText);

    return translatedText;
  } catch (error) {
    console.error("MyMemory error:", error);
    return text; // Return original text on error
  }
}

/**
 * Get greeting with fallback system
 * @param targetLanguage Target language code
 * @returns Greeting in target language
 */
export async function getGreetingWithFallback(
  targetLanguage: string
): Promise<string> {
  try {
    const translated = await translateText("Hello", targetLanguage, "en");
    console.log("API translation successful", translated);
    return translated;
  } catch (error) {
    console.error("API translation failed:", error);
    return "Hello";
  }
}

/**
 * Clear translation cache (useful for testing)
 */
export function clearTranslationCache(): void {
  translationCache.clear();
}

/**
 * Get cache size (useful for monitoring)
 */
export function getCacheSize(): number {
  return translationCache.size;
}
