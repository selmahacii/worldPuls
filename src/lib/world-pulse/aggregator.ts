/**
 * Data Aggregator
 * 
 * Combines all data sources into a single WorldPulsePayload.
 * All data is REAL - no mock data fallbacks.
 * Handles partial failures gracefully.
 */

import { WorldPulsePayload, WorldStats, Flight, CryptoArc, MarketCountry, LiveMatch } from './types';
import { fetchFlights } from './collectors';
import { getRecentArcs, updateCryptoPrices, initCryptoCollector, fetchRealCryptoTransactions } from './crypto-collector';
import { fetchMarkets } from './markets-collector';
import { fetchLiveSports } from './sports-collector';

/**
 * Build a complete payload from all data sources.
 * Fetches concurrently and handles partial failures.
 * NO MOCK DATA - only real live data.
 */
export async function buildPayload(): Promise<WorldPulsePayload> {
  // Fetch all data sources concurrently
  const [flightsResult, marketsResult, sportsResult] = await Promise.allSettled([
    fetchFlights(),
    fetchMarkets(),
    fetchLiveSports(),
  ]);

  // Extract results - empty arrays on failure (no mock data)
  const flights: Flight[] = flightsResult.status === 'fulfilled' 
    ? flightsResult.value 
    : [];

  const markets: MarketCountry[] = marketsResult.status === 'fulfilled' 
    ? marketsResult.value 
    : [];

  const matches: LiveMatch[] = sportsResult.status === 'fulfilled' 
    ? sportsResult.value 
    : [];

  // Get recent real crypto arcs
  const cryptoArcs: CryptoArc[] = getRecentArcs();

  // Calculate global stats
  const stats: WorldStats = {
    total_flights: flights.length,
    crypto_arcs_24h: cryptoArcs.length * 72, // Estimate 5-second intervals
    live_matches: matches.length,
    markets_tracked: markets.length,
    green_markets: markets.filter(m => m.change_pct > 0).length,
    red_markets: markets.filter(m => m.change_pct < 0).length,
  };

  return {
    timestamp: Date.now(),
    flights,
    crypto_arcs: cryptoArcs,
    markets,
    live_matches: matches,
    stats,
  };
}

/**
 * Initialize all collectors.
 * Call this once when the server starts.
 */
export async function initCollectors(): Promise<void> {
  console.log('[Aggregator] Initializing real data collectors...');
  
  await Promise.all([
    initCryptoCollector(),
    updateCryptoPrices(),
  ]);
  
  console.log('[Aggregator] ✅ Real data collectors initialized');
}

/**
 * Update crypto prices periodically.
 */
export function startCryptoPriceUpdater(): NodeJS.Timeout {
  return setInterval(async () => {
    await updateCryptoPrices();
  }, 60000);
}

/**
 * Periodically fetch new crypto transactions.
 */
export function startCryptoTransactionFetcher(): NodeJS.Timeout {
  return setInterval(async () => {
    await fetchRealCryptoTransactions();
  }, 5000);
}
