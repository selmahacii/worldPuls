/**
 * Live Sports Data Collector
 * 
 * Uses ESPN public API for NBA, NFL, and other sports (no key needed).
 * Only shows REAL live games currently in progress.
 */

import { LiveMatch } from './types';
import { STADIUMS } from '@/data/stadiums';
import { cache, CACHE_KEYS } from './cache';

// Configuration
const CACHE_TTL = 30; // 30 seconds
const ESPN_APIS = {
  nba: 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard',
  nfl: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard',
  ncaab: 'https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard',
  ncaaf: 'https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard',
};

interface ESPNEvent {
  id: string;
  name: string;
  status: {
    type: {
      state: string; // 'in', 'pre', 'post'
    };
    displayClock: string;
    period: {
      number: number;
    };
  };
  competitions: Array<{
    venue: {
      fullName: string;
    };
    competitors: Array<{
      homeAway: 'home' | 'away';
      team: {
        displayName: string;
      };
      score: string;
    }>;
  }>;
  league?: {
    name: string;
  };
}

/**
 * Fetch live games from a specific ESPN endpoint.
 */
async function fetchLiveGames(
  apiUrl: string,
  sport: 'basketball' | 'football',
  league: string
): Promise<LiveMatch[]> {
  try {
    const response = await fetch(apiUrl, {
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      console.warn(`[Sports] ${league} API error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    const events: ESPNEvent[] = data.events || [];
    
    const matches: LiveMatch[] = [];

    for (const event of events) {
      // Only in-progress games
      if (event.status.type.state !== 'in') {
        continue;
      }

      const competition = event.competitions[0];
      const venueName = competition.venue?.fullName;
      
      // Look up stadium coordinates
      const stadium = STADIUMS[venueName];
      if (!stadium) {
        // Skip if we don't have stadium coordinates
        continue;
      }

      const homeTeam = competition.competitors.find(c => c.homeAway === 'home');
      const awayTeam = competition.competitors.find(c => c.homeAway === 'away');

      if (!homeTeam || !awayTeam) {
        continue;
      }

      matches.push({
        stadium_name: venueName,
        lat: stadium.lat,
        lng: stadium.lng,
        home_team: homeTeam.team.displayName,
        away_team: awayTeam.team.displayName,
        home_score: parseInt(homeTeam.score) || 0,
        away_score: parseInt(awayTeam.score) || 0,
        minute: event.status.period?.number * (sport === 'basketball' ? 12 : 15),
        league: league,
        sport: sport,
      });
    }

    return matches;
    
  } catch (error) {
    console.warn(`[Sports] ${league} fetch error:`, error);
    return [];
  }
}

/**
 * Fetch all live sports matches.
 * Only returns games that are ACTUALLY in progress.
 */
export async function fetchLiveSports(): Promise<LiveMatch[]> {
  // Check cache first
  const cached = cache.get<LiveMatch[]>(CACHE_KEYS.SPORTS);
  if (cached) {
    return cached;
  }

  console.log('[Sports] Fetching live games from ESPN...');
  
  // Fetch from all sports APIs in parallel
  const [nbaGames, nflGames, ncaabGames, ncaafGames] = await Promise.all([
    fetchLiveGames(ESPN_APIS.nba, 'basketball', 'NBA'),
    fetchLiveGames(ESPN_APIS.nfl, 'football', 'NFL'),
    fetchLiveGames(ESPN_APIS.ncaab, 'basketball', 'NCAAB'),
    fetchLiveGames(ESPN_APIS.ncaaf, 'football', 'NCAAF'),
  ]);

  const allMatches = [...nbaGames, ...nflGames, ...ncaabGames, ...ncaafGames];
  
  // Cache the results
  cache.set(CACHE_KEYS.SPORTS, allMatches, CACHE_TTL);
  
  console.log(`[Sports] ✅ Found ${allMatches.length} live games (NBA: ${nbaGames.length}, NFL: ${nflGames.length}, NCAAB: ${ncaabGames.length}, NCAAF: ${ncaafGames.length})`);
  
  return allMatches;
}
