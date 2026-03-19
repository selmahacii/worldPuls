/**
 * OpenSky Network - Tracking the World's Planes
 * 
 * We use their free API to get a live snapshot of every commercial plane in the air.
 * No API key is needed for this, but they do have a 10-second rate limit for anonymous users,
 * so we cache the results to keep them happy.
 * 
 * Data Source: https://opensky-network.org/api/states/all
 */

import { Flight } from './types';
import { cache, CACHE_KEYS } from './cache';

// Let's set some limits to keep the globe smooth
const OPENSKY_API_URL = 'https://opensky-network.org/api/states/all';
const MAX_FLIGHTS = 5000; // If we show too many, the browser starts to sweat
const CACHE_TTL = 15;     // Wait 15 seconds before asking OpenSky for updates again

/**
 * Grabs the latest airborne aircraft from OpenSky.
 * We filter for planes that are actually in the sky and have valid GPS coordinates.
 */
export async function fetchFlights(): Promise<Flight[]> {
  // Check cache first
  const cached = cache.get<Flight[]>(CACHE_KEYS.FLIGHTS);
  if (cached && cached.length > 0) {
    return cached;
  }

  try {
    console.log('[Flights] Fetching live data from OpenSky Network...');

    const response = await fetch(OPENSKY_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // 25 second timeout - OpenSky can be slow
      signal: AbortSignal.timeout(25000),
    });

    if (!response.ok) {
      throw new Error(`OpenSky API error: ${response.status}`);
    }

    const data = await response.json();
    const states: any[][] = data.states || [];

    if (!states || states.length === 0) {
      console.warn('[Flights] No states returned from OpenSky');
      return [];
    }

    const flights: Flight[] = [];

    // OpenSky returns arrays: [icao24, callsign, origin_country, time_position, 
    // last_contact, longitude, latitude, baro_altitude, on_ground, velocity, true_track, ...]
    for (const state of states.slice(0, MAX_FLIGHTS)) {
      const longitude = state[5];
      const latitude = state[6];

      // Skip if missing coordinates
      if (longitude === null || latitude === null) {
        continue;
      }

      const onGround = state[8];

      // Skip if on ground
      if (onGround) {
        continue;
      }

      flights.push({
        icao24: state[0] || '',
        callsign: String(state[1] || '').replace(/^\s+|\s+$/g, ''),
        lat: latitude,
        lng: longitude,
        altitude: state[7] || 0,
        velocity: state[9] || 0,
        heading: state[10] || 0,
        country: state[2] || 'Unknown',
        on_ground: onGround,
      });
    }

    // Cache the results
    cache.set(CACHE_KEYS.FLIGHTS, flights, CACHE_TTL);
    console.log(`[Flights] ✅ Fetched ${flights.length} live flights from OpenSky`);
    return flights;

  } catch (error) {
    console.error('[Flights] ❌ Fetch error:', error);

    // Return cached data if available
    const cachedFlights = cache.get<Flight[]>(CACHE_KEYS.FLIGHTS);
    if (cachedFlights && cachedFlights.length > 0) {
      console.log(`[Flights] Using cached data: ${cachedFlights.length} flights`);
      return cachedFlights;
    }

    // Return empty array - no mock data
    return [];
  }
}
