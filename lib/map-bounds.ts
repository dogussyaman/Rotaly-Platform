export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export function isLatLngInBounds(lat: number, lng: number, b: MapBounds): boolean {
  if (lat < b.south || lat > b.north) return false;
  if (b.west <= b.east) {
    return lng >= b.west && lng <= b.east;
  }
  return lng >= b.west || lng <= b.east;
}

export function filterListingsByBounds<T extends { lat: number; lng: number }>(
  items: T[],
  bounds: MapBounds | null,
): T[] {
  if (!bounds) return items;
  return items.filter((l) => {
    if (l.lat === 0 && l.lng === 0) return false;
    return isLatLngInBounds(l.lat, l.lng, bounds);
  });
}
