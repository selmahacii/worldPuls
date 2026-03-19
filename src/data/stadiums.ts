/**
 * Major stadiums worldwide with coordinates for live sports visualization.
 * Used to position pulsing rings for active matches.
 */
export const STADIUMS: Record<string, { lat: number; lng: number; country: string; capacity: number }> = {
  // === EUROPE - Football ===
  // Spain
  'Camp Nou': { lat: 41.3809, lng: 2.1229, country: 'ES', capacity: 99354 },
  'Santiago Bernabéu': { lat: 40.4531, lng: -3.6883, country: 'ES', capacity: 83186 },
  'Wanda Metropolitano': { lat: 40.4363, lng: -3.5993, country: 'ES', capacity: 70460 },
  
  // England
  'Old Trafford': { lat: 53.4631, lng: -2.2913, country: 'GB', capacity: 74310 },
  'Anfield': { lat: 53.4308, lng: -2.9608, country: 'GB', capacity: 54074 },
  'Emirates Stadium': { lat: 51.5556, lng: -0.1086, country: 'GB', capacity: 60704 },
  'Stamford Bridge': { lat: 51.4817, lng: -0.1911, country: 'GB', capacity: 41837 },
  'Etihad Stadium': { lat: 53.4831, lng: -2.2003, country: 'GB', capacity: 55097 },
  'Tottenham Hotspur Stadium': { lat: 51.6043, lng: -0.0664, country: 'GB', capacity: 62850 },
  'Wembley Stadium': { lat: 51.5556, lng: -0.2796, country: 'GB', capacity: 90000 },
  
  // Germany
  'Signal Iduna Park': { lat: 51.4927, lng: 7.4518, country: 'DE', capacity: 81365 },
  'Allianz Arena': { lat: 48.2188, lng: 11.6248, country: 'DE', capacity: 75024 },
  'Olympiastadion Berlin': { lat: 52.5147, lng: 13.2401, country: 'DE', capacity: 74475 },
  
  // Italy
  'San Siro': { lat: 45.4781, lng: 9.1240, country: 'IT', capacity: 80018 },
  'Juventus Stadium': { lat: 45.1096, lng: 7.6417, country: 'IT', capacity: 41507 },
  'Stadio Olimpico': { lat: 41.9342, lng: 12.4547, country: 'IT', capacity: 70634 },
  
  // France
  'Parc des Princes': { lat: 48.8414, lng: 2.2530, country: 'FR', capacity: 47929 },
  'Stade de France': { lat: 48.9244, lng: 2.3601, country: 'FR', capacity: 81338 },
  'Orange Vélodrome': { lat: 43.2698, lng: 5.3958, country: 'FR', capacity: 67347 },
  
  // Netherlands
  'Johan Cruijff ArenA': { lat: 52.3146, lng: 4.9420, country: 'NL', capacity: 55500 },
  'De Kuip': { lat: 51.8939, lng: 4.5230, country: 'NL', capacity: 51117 },
  
  // Portugal
  'Estádio da Luz': { lat: 38.7527, lng: -9.1849, country: 'PT', capacity: 65000 },
  'Estádio José Alvalade': { lat: 38.7614, lng: -9.1607, country: 'PT', capacity: 50049 },
  
  // === SOUTH AMERICA ===
  // Brazil
  'Maracanã': { lat: -22.9119, lng: -43.2303, country: 'BR', capacity: 78838 },
  'Arena Corinthians': { lat: -23.5456, lng: -46.4747, country: 'BR', capacity: 49205 },
  
  // Argentina
  'Bombonera': { lat: -34.6355, lng: -58.3647, country: 'AR', capacity: 54000 },
  'Monumental de Núñez': { lat: -34.5453, lng: -58.4491, country: 'AR', capacity: 83567 },
  
  // === NORTH AMERICA ===
  // USA - Basketball/NBA
  'Madison Square Garden': { lat: 40.7505, lng: -73.9934, country: 'US', capacity: 19812 },
  'Crypto.com Arena': { lat: 34.0431, lng: -118.2672, country: 'US', capacity: 19068 },
  'United Center': { lat: 41.8807, lng: -87.6742, country: 'US', capacity: 20917 },
  'TD Garden': { lat: 42.3662, lng: -71.0622, country: 'US', capacity: 19580 },
  'Chase Center': { lat: 37.7680, lng: -122.3877, country: 'US', capacity: 18064 },
  'Fiserv Forum': { lat: 43.0450, lng: -87.9175, country: 'US', capacity: 17341 },
  'Scotiabank Arena': { lat: 43.6435, lng: -79.3791, country: 'CA', capacity: 19800 },
  
  // USA - Football/Soccer
  'SoFi Stadium': { lat: 33.9535, lng: -118.3392, country: 'US', capacity: 70240 },
  'AT&T Stadium': { lat: 32.7478, lng: -97.0928, country: 'US', capacity: 80000 },
  'Mercedes-Benz Stadium': { lat: 33.7553, lng: -84.4001, country: 'US', capacity: 70000 },
  'Lumen Field': { lat: 47.5952, lng: -122.3316, country: 'US', capacity: 68740 },
  
  // Mexico
  'Estadio Azteca': { lat: 19.3029, lng: -99.1507, country: 'MX', capacity: 87000 },
  
  // === ASIA ===
  // Japan
  'Japan National Stadium': { lat: 35.6773, lng: 139.7144, country: 'JP', capacity: 68000 },
  'Saitama Stadium 2002': { lat: 35.9308, lng: 139.6176, country: 'JP', capacity: 63700 },
  
  // South Korea
  'Seoul World Cup Stadium': { lat: 37.5154, lng: 126.8978, country: 'KR', capacity: 66704 },
  
  // China
  'Beijing National Stadium': { lat: 39.9929, lng: 116.3966, country: 'CN', capacity: 80000 },
  'Shanghai Stadium': { lat: 31.1825, lng: 121.4492, country: 'CN', capacity: 56000 },
  
  // Saudi Arabia
  'King Fahd International Stadium': { lat: 24.6503, lng: 46.7169, country: 'SA', capacity: 68000 },
  
  // === AFRICA ===
  'Cairo International Stadium': { lat: 30.0744, lng: 31.3103, country: 'EG', capacity: 75000 },
  'Soccer City': { lat: -26.2348, lng: 27.9780, country: 'ZA', capacity: 94736 },
  
  // === OCEANIA ===
  'Stadium Australia': { lat: -33.8474, lng: 151.0634, country: 'AU', capacity: 83500 },
  'Melbourne Cricket Ground': { lat: -37.8200, lng: 144.9834, country: 'AU', capacity: 100024 },
};

// Default stadiums for mock data when API is unavailable
export const DEFAULT_STADIUMS = [
  'Camp Nou',
  'Old Trafford',
  'San Siro',
  'Signal Iduna Park',
  'Parc des Princes',
  'Wembley Stadium',
  'Maracanã',
  'Bombonera',
];
