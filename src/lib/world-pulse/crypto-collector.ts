/**
 * Real Crypto Transaction Collector
 * 
 * Uses Blockchain.com API for real-time Bitcoin transactions.
 * Maps transactions to geographic locations based on known exchange
 * jurisdictions and mining pool locations.
 * 
 * APIs used:
 * - Blockchain.com: Real-time unconfirmed BTC transactions (no key required)
 * - CoinGecko: BTC/ETH price data
 */

import { CryptoArc } from './types';
import { COUNTRY_CENTROIDS, CRYPTO_EXCHANGE_LOCATIONS } from '@/data/country-centroids';
import { cache, CACHE_KEYS } from './cache';

// Configuration
const MIN_CRYPTO_VALUE_USD = 100000; // Only show transactions > $100k
const MAX_ARCS = 100; // Rolling buffer size
const BLOCKCHAIN_API = 'https://blockchain.info/unconfirmed-transactions?format=json';
const COINGECKO_API = 'https://api.coingecko.com/api/v3/simple/price';

// In-memory state
let recentArcs: CryptoArc[] = [];
let btcPriceUsd = 95000;
let ethPriceUsd = 3500;

/**
 * Fetch current BTC and ETH prices from CoinGecko.
 */
export async function updateCryptoPrices(): Promise<void> {
  const cached = cache.get<{ btc: number; eth: number }>(CACHE_KEYS.CRYPTO_PRICE);
  if (cached) {
    btcPriceUsd = cached.btc;
    ethPriceUsd = cached.eth;
    return;
  }

  try {
    const response = await fetch(
      `${COINGECKO_API}?ids=bitcoin,ethereum&vs_currencies=usd`,
      { signal: AbortSignal.timeout(10000) }
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    btcPriceUsd = data.bitcoin?.usd || btcPriceUsd;
    ethPriceUsd = data.ethereum?.usd || ethPriceUsd;

    cache.set(CACHE_KEYS.CRYPTO_PRICE, { btc: btcPriceUsd, eth: ethPriceUsd }, 60);
    console.log(`[Crypto] Prices updated: BTC $${btcPriceUsd.toLocaleString()}, ETH $${ethPriceUsd.toLocaleString()}`);
    
  } catch (error) {
    console.warn('[Crypto] Price update error:', error);
  }
}

/**
 * Fetch real unconfirmed Bitcoin transactions from Blockchain.com
 */
async function fetchUnconfirmedTransactions(): Promise<any[]> {
  try {
    const response = await fetch(BLOCKCHAIN_API, {
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      throw new Error(`Blockchain.com API error: ${response.status}`);
    }

    const data = await response.json();
    return data.txs || [];
    
  } catch (error) {
    console.warn('[Crypto] Failed to fetch unconfirmed transactions:', error);
    return [];
  }
}

/**
 * Get weighted random country based on crypto exchange activity.
 */
function getExchangeCountry(): { code: string; weight: number } {
  const random = Math.random();
  let cumulative = 0;
  
  for (const entry of CRYPTO_EXCHANGE_LOCATIONS) {
    cumulative += entry.weight;
    if (random <= cumulative) {
      return entry;
    }
  }
  
  return CRYPTO_EXCHANGE_LOCATIONS[0];
}

/**
 * Get country centroid coordinates.
 */
function getCountryCoords(countryCode: string): { lat: number; lng: number } {
  return COUNTRY_CENTROIDS[countryCode] || { lat: 0, lng: 0 };
}

/**
 * Process a real Bitcoin transaction into a crypto arc.
 */
function processTransaction(tx: any): CryptoArc | null {
  try {
    // Calculate total output value in satoshis
    const outputValue = (tx.out || []).reduce((sum: number, out: any) => {
      return sum + (out.value || 0);
    }, 0);

    // Convert to BTC then USD
    const valueBtc = outputValue / 100000000;
    const valueUsd = valueBtc * btcPriceUsd;

    // Skip small transactions
    if (valueUsd < MIN_CRYPTO_VALUE_USD) {
      return null;
    }

    // Assign geographic locations based on exchange patterns
    // Real blockchain transactions don't have geographic data,
    // so we assign likely source/destination based on exchange jurisdictions
    const fromExchange = getExchangeCountry();
    let toExchange = getExchangeCountry();
    
    // Ensure different countries for visual interest
    let attempts = 0;
    while (toExchange.code === fromExchange.code && attempts < 5) {
      toExchange = getExchangeCountry();
      attempts++;
    }

    const fromPos = getCountryCoords(fromExchange.code);
    const toPos = getCountryCoords(toExchange.code);

    return {
      from_country: fromExchange.code,
      to_country: toExchange.code,
      from_lat: fromPos.lat,
      from_lng: fromPos.lng,
      to_lat: toPos.lat,
      to_lng: toPos.lng,
      value_usd: Math.round(valueUsd),
      currency: 'BTC',
      tx_hash: tx.hash || '',
      timestamp: Date.now(),
    };
    
  } catch (error) {
    return null;
  }
}

/**
 * Add a new crypto arc to the recent buffer.
 */
export function addCryptoArc(arc: CryptoArc): void {
  recentArcs.push(arc);
  if (recentArcs.length > MAX_ARCS) {
    recentArcs.shift();
  }
}

/**
 * Get recent crypto arcs for visualization.
 */
export function getRecentArcs(): CryptoArc[] {
  // Return arcs from last 5 minutes
  const cutoff = Date.now() - 5 * 60 * 1000;
  return recentArcs.filter(arc => arc.timestamp > cutoff);
}

/**
 * Fetch and process real Bitcoin transactions.
 * Returns newly added arcs.
 */
export async function fetchRealCryptoTransactions(): Promise<CryptoArc[]> {
  const txs = await fetchUnconfirmedTransactions();
  const newArcs: CryptoArc[] = [];
  
  // Process up to 10 transactions per batch
  const batchSize = Math.min(txs.length, 10);
  
  for (let i = 0; i < batchSize; i++) {
    const arc = processTransaction(txs[i]);
    if (arc) {
      addCryptoArc(arc);
      newArcs.push(arc);
    }
  }
  
  if (newArcs.length > 0) {
    console.log(`[Crypto] Processed ${newArcs.length} real BTC transactions (values > $${MIN_CRYPTO_USD.toLocaleString()})`);
  }
  
  return newArcs;
}

/**
 * Get current crypto prices.
 */
export function getCryptoPrices(): { btc: number; eth: number } {
  return { btc: btcPriceUsd, eth: ethPriceUsd };
}

// Minimum for display (for log message)
const MIN_CRYPTO_USD = MIN_CRYPTO_VALUE_USD;

/**
 * Initialize crypto collector and fetch initial data.
 */
export async function initCryptoCollector(): Promise<void> {
  console.log('[Crypto] Initializing with real Blockchain.com data...');
  
  await updateCryptoPrices();
  
  // Fetch initial batch of transactions
  const arcs = await fetchRealCryptoTransactions();
  console.log(`[Crypto] Initial load: ${arcs.length} real transactions`);
}
