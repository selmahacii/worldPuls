/**
 * World Pulse Data Models
 * All TypeScript types for the real-time globe visualization
 */

// Flight data from OpenSky Network
export interface Flight {
  icao24: string;           // unique aircraft identifier
  callsign: string;         // flight callsign (e.g., "UAL123")
  lat: number;              // latitude
  lng: number;              // longitude
  altitude: number;         // altitude in meters
  velocity: number;         // velocity in m/s
  heading: number;          // heading in degrees (0-360)
  country: string;          // origin country
  on_ground: boolean;       // whether aircraft is on ground
}

// Crypto transaction arc between countries
export interface CryptoArc {
  from_country: string;     // ISO country code
  to_country: string;       // ISO country code
  from_lat: number;         // source latitude
  from_lng: number;         // source longitude
  to_lat: number;           // destination latitude
  to_lng: number;           // destination longitude
  value_usd: number;        // transaction value in USD
  currency: 'BTC' | 'ETH';  // cryptocurrency type
  tx_hash: string;          // transaction hash (truncated)
  timestamp: number;        // when the arc was created
}

// Market data for a country
export interface MarketCountry {
  country: string;          // ISO country code
  lat: number;              // country centroid latitude
  lng: number;              // country centroid longitude
  index_name: string;       // stock index name (e.g., "S&P 500")
  change_pct: number;       // percentage change (-5 to +5)
  price: number;            // current index price
  volume: number;           // trading volume
}

// Live sports match
export interface LiveMatch {
  stadium_name: string;     // stadium/venue name
  lat: number;              // stadium latitude
  lng: number;              // stadium longitude
  home_team: string;        // home team name
  away_team: string;        // away team name
  home_score: number;       // home team score
  away_score: number;       // away team score
  minute: number;           // match minute
  league: string;           // league name
  sport: 'football' | 'basketball' | 'formula1';  // sport type
}

// Global statistics for sidebar
export interface WorldStats {
  total_flights: number;    // number of airborne flights
  crypto_arcs_24h: number;  // crypto arcs in last 24h
  live_matches: number;     // number of live matches
  markets_tracked: number;  // number of markets tracked
  green_markets: number;    // markets with positive change
  red_markets: number;      // markets with negative change
}

// Complete payload pushed to frontend via WebSocket
export interface WorldPulsePayload {
  timestamp: number;        // Unix timestamp
  flights: Flight[];        // all live flights
  crypto_arcs: CryptoArc[]; // recent crypto arcs
  markets: MarketCountry[]; // market data by country
  live_matches: LiveMatch[]; // live sports matches
  stats: WorldStats;        // global statistics
}

// Layer visibility state
export interface LayerVisibility {
  flights: boolean;
  crypto: boolean;
  markets: boolean;
  sports: boolean;
}

// Country centroid data
export interface CountryCentroid {
  lat: number;
  lng: number;
  name: string;
}

// Stadium data
export interface Stadium {
  name: string;
  lat: number;
  lng: number;
  country: string;
  capacity: number;
}

// WebSocket connection status
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';
