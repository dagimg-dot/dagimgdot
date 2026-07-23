import { CONFIG } from "./types";
import { detectLocation } from "./geolocation";
import { translateHello } from "./translator";
import { getNativeGreeting } from "./greetings-map";
import { runDecipher } from "./decipher";
import { getCachedGreeting, setCachedGreeting } from "./cache";

async function resolveGreeting(): Promise<{
  text: string;
  language: string;
} | null> {
  const cached = getCachedGreeting();
  if (cached) {
    return { text: cached, language: "cached" };
  }

  const geo = await detectLocation();
  if (!geo || geo.primaryLanguage === "en") return null;

  // 1. Try authentic native greeting map first (instant, 100% natural)
  const native = getNativeGreeting(geo.primaryLanguage);
  if (native) {
    setCachedGreeting(native, geo.primaryLanguage);
    return { text: native, language: geo.primaryLanguage };
  }

  // 2. Fall back to translation API for unmapped languages
  const translated = await translateHello(geo.primaryLanguage);
  if (!translated) return null;

  setCachedGreeting(translated, geo.primaryLanguage);
  return { text: translated, language: geo.primaryLanguage };
}

let initialized = false;

export async function initGreeting(): Promise<void> {
  if (initialized) return;
  initialized = true;

  const element = document.getElementById(CONFIG.ELEMENT_ID);
  if (!element) return;

  try {
    const result = await resolveGreeting();
    if (!result || result.text === element.textContent?.trim()) return;

    await delay(CONFIG.DECIPHER.START_DELAY_MS);
    await runDecipher({
      element,
      targetText: result.text,
    });
  } catch {
    // Graceful degradation
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
