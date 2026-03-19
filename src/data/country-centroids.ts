/**
 * Country centroids for positioning data on the globe.
 * ISO 3166-1 alpha-2 country codes mapped to approximate geographic centers.
 */
export const COUNTRY_CENTROIDS: Record<string, { lat: number; lng: number; name: string }> = {
  // Major economies and markets
  'US': { lat: 39.8283, lng: -98.5795, name: 'United States' },
  'CN': { lat: 35.8617, lng: 104.1954, name: 'China' },
  'JP': { lat: 36.2048, lng: 138.2529, name: 'Japan' },
  'DE': { lat: 51.1657, lng: 10.4515, name: 'Germany' },
  'GB': { lat: 55.3781, lng: -3.4360, name: 'United Kingdom' },
  'FR': { lat: 46.2276, lng: 2.2137, name: 'France' },
  'IN': { lat: 20.5937, lng: 78.9629, name: 'India' },
  'IT': { lat: 41.8719, lng: 12.5674, name: 'Italy' },
  'BR': { lat: -14.2350, lng: -51.9253, name: 'Brazil' },
  'CA': { lat: 56.1304, lng: -106.3468, name: 'Canada' },
  'AU': { lat: -25.2744, lng: 133.7751, name: 'Australia' },
  'KR': { lat: 35.9078, lng: 127.7669, name: 'South Korea' },
  'RU': { lat: 61.5240, lng: 105.3188, name: 'Russia' },
  'ES': { lat: 40.4637, lng: -3.7492, name: 'Spain' },
  'MX': { lat: 23.6345, lng: -102.5528, name: 'Mexico' },
  'ID': { lat: -0.7893, lng: 113.9213, name: 'Indonesia' },
  'NL': { lat: 52.1326, lng: 5.2913, name: 'Netherlands' },
  'SA': { lat: 23.8859, lng: 45.0792, name: 'Saudi Arabia' },
  'TR': { lat: 38.9637, lng: 35.2433, name: 'Turkey' },
  'CH': { lat: 46.8182, lng: 8.2275, name: 'Switzerland' },
  
  // Additional markets
  'TW': { lat: 23.6978, lng: 120.9605, name: 'Taiwan' },
  'SG': { lat: 1.3521, lng: 103.8198, name: 'Singapore' },
  'HK': { lat: 22.3193, lng: 114.1694, name: 'Hong Kong' },
  'SE': { lat: 60.1282, lng: 18.6435, name: 'Sweden' },
  'PL': { lat: 51.9194, lng: 19.1451, name: 'Poland' },
  'BE': { lat: 50.5039, lng: 4.4699, name: 'Belgium' },
  'AR': { lat: -38.4161, lng: -63.6167, name: 'Argentina' },
  'TH': { lat: 15.8700, lng: 100.9925, name: 'Thailand' },
  'ZA': { lat: -30.5595, lng: 22.9375, name: 'South Africa' },
  'AE': { lat: 23.4241, lng: 53.8474, name: 'UAE' },
  'NG': { lat: 9.0820, lng: 8.6753, name: 'Nigeria' },
  'EG': { lat: 26.8206, lng: 30.8025, name: 'Egypt' },
  'MY': { lat: 4.2105, lng: 101.9758, name: 'Malaysia' },
  'PH': { lat: 12.8797, lng: 121.7740, name: 'Philippines' },
  'VN': { lat: 14.0583, lng: 108.2772, name: 'Vietnam' },
  'PK': { lat: 30.3753, lng: 69.3451, name: 'Pakistan' },
  'BD': { lat: 23.6850, lng: 90.3563, name: 'Bangladesh' },
  
  // European countries
  'AT': { lat: 47.5162, lng: 14.5501, name: 'Austria' },
  'NO': { lat: 60.4720, lng: 8.4689, name: 'Norway' },
  'DK': { lat: 56.2639, lng: 9.5018, name: 'Denmark' },
  'FI': { lat: 61.9241, lng: 25.7482, name: 'Finland' },
  'IE': { lat: 53.1424, lng: -7.6921, name: 'Ireland' },
  'PT': { lat: 39.3999, lng: -8.2245, name: 'Portugal' },
  'GR': { lat: 39.0742, lng: 21.8243, name: 'Greece' },
  'CZ': { lat: 49.8175, lng: 15.4730, name: 'Czech Republic' },
  'RO': { lat: 45.9432, lng: 24.9668, name: 'Romania' },
  'HU': { lat: 47.1625, lng: 19.5033, name: 'Hungary' },
  'UA': { lat: 48.3794, lng: 31.1656, name: 'Ukraine' },
  
  // Middle East
  'IL': { lat: 31.0461, lng: 34.8516, name: 'Israel' },
  'IR': { lat: 32.4279, lng: 53.6880, name: 'Iran' },
  'IQ': { lat: 33.2232, lng: 43.6793, name: 'Iraq' },
  'KW': { lat: 29.3117, lng: 47.4818, name: 'Kuwait' },
  'QA': { lat: 25.3548, lng: 51.1839, name: 'Qatar' },
  
  // Americas
  'CL': { lat: -35.6751, lng: -71.5430, name: 'Chile' },
  'CO': { lat: 4.5709, lng: -74.2973, name: 'Colombia' },
  'PE': { lat: -9.1900, lng: -75.0152, name: 'Peru' },
  'VE': { lat: 6.4238, lng: -66.5897, name: 'Venezuela' },
  
  // Oceania
  'NZ': { lat: -40.9006, lng: 174.8860, name: 'New Zealand' },
  
  // Africa
  'KE': { lat: -0.0236, lng: 37.9062, name: 'Kenya' },
  'GH': { lat: 7.9465, lng: -1.0232, name: 'Ghana' },
  'MA': { lat: 31.7917, lng: -7.0926, name: 'Morocco' },
  
  // Small financial centers
  'LU': { lat: 49.8153, lng: 6.1296, name: 'Luxembourg' },
  'MC': { lat: 43.7384, lng: 7.4246, name: 'Monaco' },
  'LI': { lat: 47.1660, lng: 9.5554, name: 'Liechtenstein' },
  'SC': { lat: -4.6796, lng: 55.4920, name: 'Seychelles' },
  'CY': { lat: 35.1264, lng: 33.4299, name: 'Cyprus' },
  'MT': { lat: 35.9375, lng: 14.3754, name: 'Malta' },
  'SI': { lat: 46.1512, lng: 14.9955, name: 'Slovenia' },
};

// Country codes list for weighted random selection (legacy)
export const CRYPTO_ADOPTION_COUNTRIES: [string, number][] = [
  ['US', 0.25], ['CN', 0.18], ['GB', 0.08], ['DE', 0.07],
  ['JP', 0.06], ['KR', 0.05], ['IN', 0.05], ['RU', 0.04],
  ['BR', 0.03], ['NG', 0.03], ['TR', 0.03], ['CA', 0.03],
  ['AU', 0.02], ['FR', 0.02], ['NL', 0.02], ['SG', 0.02],
];

// Crypto exchange locations with trading volume weights
// Based on real exchange headquarters and trading activity
export const CRYPTO_EXCHANGE_LOCATIONS: Array<{ code: string; weight: number; exchanges: string[] }> = [
  { code: 'US', weight: 0.28, exchanges: ['Coinbase', 'Kraken', 'Gemini', 'Binance.US'] },
  { code: 'SG', weight: 0.15, exchanges: ['Crypto.com', 'Independent Reserve'] },
  { code: 'HK', weight: 0.12, exchanges: ['Bitfinex', 'Bit-Z'] },
  { code: 'JP', weight: 0.10, exchanges: ['bitFlyer', 'Coincheck', 'Liquid'] },
  { code: 'GB', weight: 0.08, exchanges: ['Bitstamp UK', 'CEX.io'] },
  { code: 'DE', weight: 0.06, exchanges: ['Bitstamp', 'Kraken EU'] },
  { code: 'KR', weight: 0.06, exchanges: ['Upbit', 'Bithumb', 'Korbit'] },
  { code: 'AE', weight: 0.04, exchanges: ['Binance Dubai', 'Bybit'] },
  { code: 'CH', weight: 0.03, exchanges: ['SEBA Bank', 'Sygnum'] },
  { code: 'AU', weight: 0.03, exchanges: ['Independent Reserve AU', 'BTC Markets'] },
  { code: 'CA', weight: 0.02, exchanges: ['Bitbuy', 'Coinsquare'] },
  { code: 'BR', weight: 0.02, exchanges: ['Mercado Bitcoin', 'Foxbit'] },
];

// Stock indices mapped to countries
export const STOCK_INDICES: [string, string, string][] = [
  // [ticker, country code, index name]
  ['^GSPC', 'US', 'S&P 500'],
  ['^GDAXI', 'DE', 'DAX'],
  ['^FTSE', 'GB', 'FTSE 100'],
  ['^N225', 'JP', 'Nikkei 225'],
  ['^FCHI', 'FR', 'CAC 40'],
  ['^HSI', 'HK', 'Hang Seng'],
  ['^AXJO', 'AU', 'ASX 200'],
  ['^BVSP', 'BR', 'Bovespa'],
  ['^GSPTSE', 'CA', 'TSX'],
  ['^BSESN', 'IN', 'Sensex'],
  ['^KS11', 'KR', 'KOSPI'],
  ['000001.SS', 'CN', 'Shanghai'],
  ['^STOXX50E', 'DE', 'Euro Stoxx 50'],
];
