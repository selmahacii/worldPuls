/**
 * Global Stock Markets (via Yahoo Finance)
 * 
 * We track major global indices—from the S&P 500 to the Nikkei—to see 
 * the world's economic health at a glance. We fetch these directly from 
 * Yahoo Finance and map them to their home countries on our 3D globe.
 */

import { MarketCountry } from './types';
import { COUNTRY_CENTROIDS, STOCK_INDICES } from '@/data/country-centroids';
import { cache, CACHE_KEYS } from './cache';

// Configuration
const CACHE_TTL = 60; // 60 seconds (market data changes slowly)

// Yahoo Finance API endpoints
const YAHOO_FINANCE_BASE = 'https://query1.finance.yahoo.com/v8/finance/chart';

interface YahooChartResponse {
  chart: {
    result: Array<{
      meta: {
        regularMarketPrice: number;
        previousClose: number;
      };
      indicators: {
        quote: Array<{
          close: number[];
          volume: number[];
        }>;
      };
    }>;
  };
}

/**
 * Fetch quote data for a single ticker from Yahoo Finance.
 */
async function fetchQuote(ticker: string): Promise<{ price: number; changePct: number; volume: number } | null> {
  try {
    // Use the chart endpoint to get current and previous close
    const response = await fetch(
      `${YAHOO_FINANCE_BASE}/${encodeURIComponent(ticker)}?interval=1d&range=2d`,
      {
        headers: {
          'User-Agent': 'WorldPulse/1.0 (Real-Time Global Data Visualization)',
        },
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!response.ok) {
      return null;
    }

    const data: YahooChartResponse = await response.json();
    const result = data.chart?.result?.[0];

    if (!result?.meta) {
      return null;
    }

    const { regularMarketPrice, previousClose } = result.meta;
    const changePct = previousClose > 0
      ? ((regularMarketPrice - previousClose) / previousClose) * 100
      : 0;

    const volume = result.indicators?.quote?.[0]?.volume?.slice(-1)[0] || 0;

    return {
      price: regularMarketPrice,
      changePct,
      volume,
    };

  } catch (error) {
    console.warn(`[Markets] Error fetching ${ticker}:`, error);
    return null;
  }
}

/**
 * Fetch market data for all tracked indices.
 * Only returns REAL data from Yahoo Finance.
 */
export async function fetchMarkets(): Promise<MarketCountry[]> {
  // Check cache first
  const cached = cache.get<MarketCountry[]>(CACHE_KEYS.MARKETS);
  if (cached) {
    return cached;
  }

  console.log('[Markets] Fetching real data from Yahoo Finance...');

  const results: MarketCountry[] = [];

  // Fetch quotes in parallel
  const fetchPromises = STOCK_INDICES.map(async ([ticker, country, name]) => {
    const quote = await fetchQuote(ticker);

    if (!quote) {
      return null;
    }

    const pos = COUNTRY_CENTROIDS[country];
    if (!pos) {
      return null;
    }

    return {
      country,
      lat: pos.lat,
      lng: pos.lng,
      index_name: name,
      change_pct: Math.round(quote.changePct * 100) / 100,
      price: Math.round(quote.price * 100) / 100,
      volume: quote.volume,
    } as MarketCountry;
  });

  const marketResults = await Promise.all(fetchPromises);

  for (const result of marketResults) {
    if (result) {
      results.push(result);
    }
  }

  // Cache the results
  cache.set(CACHE_KEYS.MARKETS, results, CACHE_TTL);

  console.log(`[Markets] ✅ Fetched ${results.length} real market indices`);
  return results;
}
