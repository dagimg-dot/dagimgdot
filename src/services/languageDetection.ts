import { getUserCountry } from "./geolocation";
import { getGreetingWithFallback } from "./translation";

export interface LanguageDetectionResult {
  language: string;
  greeting: string;
  countryCode: string;
  languages: string[];
}

/**
 * Get the best language for the user based on their location
 * @param ip Optional IP address (if not provided, uses request IP)
 * @returns Language detection result with greeting
 */
export async function getBestLanguageForUser(
  ip?: string
): Promise<LanguageDetectionResult> {
  try {
    // Get user's location and languages
    const userLocation = await getUserCountry(ip);

    if (!userLocation) {
      return getFallbackLanguage();
    }

    const { countryCode, languages } = userLocation;

    // Get the primary language (first in the array)
    const primaryLanguage = languages[0] || "en";
    const baseLanguage = primaryLanguage.split("-")[0]; // e.g., 'en' from 'en-US'

    // Translate "Hello" to the detected language
    const greeting = await getGreetingWithFallback(baseLanguage);

    // Ensure 'en' is always included in the languages array for convenient cycling
    const languagesWithEn = languages.includes("en")
      ? languages
      : [...languages, "en"];

    return {
      language: baseLanguage,
      greeting,
      countryCode,
      languages: languagesWithEn,
    };
  } catch (error) {
    console.error("Language detection failed:", error);
    return getFallbackLanguage();
  }
}

/**
 * Get fallback language when detection fails
 * @returns Default language detection result
 */
function getFallbackLanguage(): LanguageDetectionResult {
  // Try to get browser language if available
  if (typeof navigator !== "undefined") {
    const browserLang = navigator.language.split("-")[0];
    const languages = browserLang !== "en" ? [browserLang, "en"] : ["en"];
    return {
      language: browserLang,
      greeting: "Hello", // Will be translated by the component
      countryCode: "US",
      languages,
    };
  }

  // Default fallback
  return {
    language: "en",
    greeting: "Hello",
    countryCode: "US",
    languages: ["en"],
  };
}

/**
 * Get next language for cycling through available languages
 * @param currentLanguage Current language code
 * @param availableLanguages Array of available language codes
 * @returns Next language code
 */
export function getNextLanguage(
  currentLanguage: string,
  availableLanguages: string[]
): string {
  const currentIndex = availableLanguages.indexOf(currentLanguage);
  const nextIndex = (currentIndex + 1) % availableLanguages.length;
  return availableLanguages[nextIndex].split("-")[0]; // Get base language
}

/**
 * Create language options for the greeting component
 * @param languages Array of detected languages
 * @param countryCode Country code
 * @returns Object mapping language codes to greetings
 */
export async function createLanguageOptions(
  languages: string[],
  countryCode: string
): Promise<Record<string, string>> {
  const options: Record<string, string> = {};

  // Add detected languages
  for (const lang of languages) {
    const baseLang = lang.split("-")[0];
    try {
      const greeting = await getGreetingWithFallback(baseLang);
      options[baseLang] = greeting;
    } catch (error) {
      console.error(`Failed to get greeting for ${baseLang}:`, error);
    }
  }

  // Add country-specific defaults if not already present
  const countryDefaults: Record<string, string[]> = {
    ET: ["am", "en"],
    ER: ["am", "en"],
    US: ["en", "es"],
    FR: ["fr", "en"],
    DE: ["de", "en"],
    ES: ["es", "en"],
    IT: ["it", "en"],
    PT: ["pt", "en"],
    CN: ["zh", "en"],
    JP: ["ja", "en"],
    KR: ["ko", "en"],
    IN: ["hi", "en"],
    KE: ["sw", "en"],
    TZ: ["sw", "en"],
    NG: ["yo", "en"],
    ZA: ["zu", "en"],
    GH: ["tw", "en"],
  };

  if (countryDefaults[countryCode]) {
    for (const lang of countryDefaults[countryCode]) {
      if (!options[lang]) {
        try {
          const greeting = await getGreetingWithFallback(lang);
          options[lang] = greeting;
        } catch (error) {
          console.error(`Failed to get greeting for ${lang}:`, error);
        }
      }
    }
  }

  // Ensure we have at least English
  if (!options["en"]) {
    options["en"] = "Hello";
  }

  return options;
}

/**
 * Get browser language preference
 * @returns Browser language code or 'en' as fallback
 */
export function getBrowserLanguage(): string {
  if (typeof navigator !== "undefined") {
    return navigator.language.split("-")[0];
  }
  return "en";
}
