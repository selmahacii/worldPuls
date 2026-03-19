/**
 * OpenSky Network Flight Data Collector
 * 
 * Free API - no authentication required for anonymous access.
 * Rate limit: 10 seconds between calls for anonymous users.
 * 
 * Endpoint: https://opensky-network.org/api/states/all
 * Returns all aircraft currently airborne worldwide.
 * 
 * Response format: states is an array of arrays:
 * [icao24, callsign, origin_country, time_position, last_contact,
 *  longitude, latitude, baro_altitude, on_ground, velocity, true_track,
 *  vertical_rate, sensors, geo_altitude, squawk, spi, position_source]
 */

import { Flight } from './types';
import { cache, CACHE_KEYS } from './cache';

// Configuration
const OPENSKY_API_URL = 'https://opensky-network.org/api/states/all';
const MAX_FLIGHTS = 5000; // Cap for frontend performance
const CACHE_TTL = 15; // 15 seconds cache

/**
 * Fetch all live aircraft states from OpenSky Network.
 * Filters: only airborne, valid coordinates, max 5000 aircraft.
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
        callsign: (state[1] || '').trim(),
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
