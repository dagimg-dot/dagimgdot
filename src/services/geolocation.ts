export interface UserLocation {
  countryCode: string;
  countryName: string;
  languages: string[];
}

interface IPGeolocationResponse {
  location: {
    country_code2: string;
    country_name: string;
  };
  country_metadata: {
    languages: string[];
  };
}

/**
 * Get country info of the user by IP using direct HTTP call.
 * If no IP is provided, it fetches geolocation info of the request IP automatically.
 * @param ip optional IP address to lookup; if undefined, uses caller's IP
 * @returns country name, country code (ISO 2-letter), and languages or null on failure
 */
export async function getUserCountry(
  ip?: string
): Promise<UserLocation | null> {
  try {
    const apiKey = import.meta.env.IP_GEOLOCATION_API_KEY;

    if (!apiKey) {
      console.warn("IP_GEOLOCATION_API_KEY not found, using fallback");
      return getFallbackLocation();
    }

    const url = new URL("https://api.ipgeolocation.io/v2/ipgeo");
    if (ip) {
      url.searchParams.set("ip", ip);
    }
    url.searchParams.set("apiKey", apiKey);
    url.searchParams.set(
      "fields",
      "location.country_code2,location.country_name,country_metadata.languages"
    );

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: IPGeolocationResponse = await response.json();

    if (data && data.location && data.country_metadata) {
      console.log("data", data);
      return {
        countryCode: data.location.country_code2,
        countryName: data.location.country_name,
        languages: data.country_metadata.languages || [],
      };
    }
  } catch (error) {
    console.error("Failed to fetch IP geolocation:", error);
  }

  return getFallbackLocation();
}

/**
 * Get fallback location when API fails
 */
function getFallbackLocation(): UserLocation {
  return {
    countryCode: "ET",
    countryName: "Ethiopia",
    languages: ["am-ET", "en"],
  };
}
