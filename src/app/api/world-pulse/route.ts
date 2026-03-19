/**
 * World Pulse REST API Route
 * 
 * Provides a REST endpoint for one-time data fetch.
 * Useful for clients that can't use WebSocket or for initial load.
 */

import { NextResponse } from 'next/server';
import { buildPayload } from '@/lib/world-pulse/aggregator';

export async function GET() {
  try {
    const payload = await buildPayload();
    return NextResponse.json(payload);
  } catch (error) {
    console.error('[API] Error building payload:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

// Revalidate every 5 seconds for caching
export const revalidate = 5;
