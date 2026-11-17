// Geographic helpers

const EARTH_RADIUS_M = 6371000

/** Great-circle distance between two points, in meters (haversine). */
export function distanceMeters(lat1, lng1, lat2, lng2) {
  const toRad = (deg) => (deg * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_M * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/** Risk zones within `radiusM` of a point, nearest first, with `distance` in meters. */
export function findRisksWithin(point, risks, radiusM) {
  if (!point || !risks) return []
  return risks
    .map((risk) => ({
      ...risk,
      distance: distanceMeters(point.lat, point.lng, risk.lat, risk.lng)
    }))
    .filter((risk) => risk.distance <= radiusM)
    .sort((a, b) => a.distance - b.distance)
}

export function formatDistance(meters) {
  return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${Math.round(meters)} m`
}
