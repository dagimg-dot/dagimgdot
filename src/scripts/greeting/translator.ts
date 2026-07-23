import { CONFIG, type TranslationResponse } from "./types";

export async function translateHello(
  targetLang: string
): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CONFIG.API_TIMEOUT_MS);

  try {
    const params = new URLSearchParams({
      q: "Hello",
      langpair: `en|${targetLang}`,
    });

    const res = await fetch(`${CONFIG.TRANSLATION_API}?${params}`, {
      signal: controller.signal,
    });
    if (!res.ok) return null;

    const data: TranslationResponse = await res.json();
    if (data.responseStatus !== 200) return null;

    const translated = data.responseData?.translatedText?.trim();
    if (!translated || translated.toLowerCase() === "hello") return null;

    return translated;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
