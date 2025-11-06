// backend/utils/osrm.js
import fetch from "node-fetch";

const distanceCache = new Map();

async function getDrivingDistance(startLat, startLng, endLat, endLng) {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=false`;
    const res = await fetch(url);
    const text = await res.text();

    if (!res.ok || text.trim().startsWith("<")) return null;
    const data = JSON.parse(text);
    if (data?.routes?.length) return (data.routes[0].distance / 1000).toFixed(2);
    return null;
  } catch (err) {
    console.error("Error fetching OSRM distance:", err);
    return null;
  }
}

function makeCacheKey(a, b, c, d) {
  return `${a},${b}-${c},${d}`;
}

export async function getCachedDistance(startLat, startLng, endLat, endLng) {
  const key = makeCacheKey(startLat, startLng, endLat, endLng);
  if (distanceCache.has(key)) return distanceCache.get(key);

  if (getCachedDistance.activeRequests >= 3) return "N/A";
  getCachedDistance.activeRequests++;

  let distance = null;
  try {
    distance = await getDrivingDistance(startLat, startLng, endLat, endLng);
  } catch (err) {
    console.error("OSRM fetch failed:", err);
  } finally {
    getCachedDistance.activeRequests--;
  }

  distanceCache.set(key, distance ?? "N/A");
  return distance ?? "N/A";
}
getCachedDistance.activeRequests = 0;
