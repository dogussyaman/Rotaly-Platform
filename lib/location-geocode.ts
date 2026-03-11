export interface GeocodedLocation {
  lat: number;
  lng: number;
  raw?: unknown;
}

/**
 * OpenStreetMap Nominatim tabanlı basit geocode helper.
 * NOT: Nominatim kullanım politikası gereği bu isteğe kendinize ait bir
 * User-Agent ve tercihen iletişim e-postası eklemeniz önerilir.
 */
export async function geocodeAddress(address: string): Promise<GeocodedLocation | null> {
  if (!address || address.trim().length < 3) {
    return null;
  }

  const searchParams = new URLSearchParams({
    q: address,
    format: 'json',
    addressdetails: '1',
    limit: '1',
  });

  const url = `https://nominatim.openstreetmap.org/search?${searchParams.toString()}`;

  const res = await fetch(url, {
    headers: {
      // Burayı projeye göre özelleştir:
      // Örn: 'MyRotalyApp/1.0 (contact@example.com)'
      'User-Agent': 'RotalyPlatform/1.0 (change-this-to-your-email@example.com)',
    },
  });

  if (!res.ok) {
    console.error('Nominatim geocode error:', res.status, res.statusText);
    return null;
  }

  const data = (await res.json()) as Array<{
    lat: string;
    lon: string;
    [key: string]: unknown;
  }>;

  if (!data || data.length === 0) {
    return null;
  }

  const first = data[0];

  const lat = Number.parseFloat(first.lat);
  const lng = Number.parseFloat(first.lon);

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return null;
  }

  return {
    lat,
    lng,
    raw: first,
  };
}

