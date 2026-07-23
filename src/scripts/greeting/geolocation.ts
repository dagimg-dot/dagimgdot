import { CONFIG, type GeoResponse, type GeoResult } from "./types";

function languageForCountry(countryCode: string): string {
  try {
    const locale = new Intl.Locale("und", { region: countryCode });
    return locale.maximize().language;
  } catch {
    return "en";
  }
}

export async function detectLocation(): Promise<GeoResult | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CONFIG.API_TIMEOUT_MS);

  try {
    const res = await fetch(CONFIG.GEO_API, { signal: controller.signal });
    if (!res.ok) return null;

    const data: GeoResponse = await res.json();
    if (!data.success || !data.country_code) return null;

    return {
      countryCode: data.country_code,
      primaryLanguage: languageForCountry(data.country_code),
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
