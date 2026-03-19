/**
 * The World Pulse 3D Globe
 * 
 * This is the visual anchor of our app. We use react-globe.gl to render
 * a high-performance WebGL globe that displays all our live data layers:
 * flights (points), crypto (arcs), markets (hexagons), and sports (rings/labels).
 */

'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import type { WorldPulsePayload } from '@/lib/world-pulse/types';

// We load the Globe component dynamically to avoid SSR issues with Three.js
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

interface GlobeProps {
  data: WorldPulsePayload | null;
  layers: {
    flights: boolean;
    crypto: boolean;
    markets: boolean;
    sports: boolean;
  };
}

// Premium globe textures
const EARTH_NIGHT_TEXTURE = '//unpkg.com/three-globe/example/img/earth-night.jpg';
const EARTH_TOPOGRAPHY = '//unpkg.com/three-globe/example/img/earth-topology.png';

// Premium color palette - sophisticated, non-blue focused
const COLORS = {
  flights: {
    base: 'rgba(255, 255, 255, 0.85)',
    fast: 'rgba(250, 204, 21, 1)',
  },
  crypto: {
    btc: '#fbbf24', // Gold for Bitcoin
    eth: '#c084fc', // Purple for Ethereum
  },
  markets: {
    up: '#22c55e',
    down: '#ef4444',
    neutral: '#64748b',
  },
  sports: {
    football: '#22c55e',
    basketball: '#f97316',
  },
};

// Color helpers
const getFlightColor = (velocity: number): string => {
  const normalized = Math.min(velocity / 280, 1);
  // Bright white to gold gradient for visibility
  const r = 255;
  const g = Math.round(255 - normalized * 50);
  const b = Math.round(255 - normalized * 200);
  const alpha = 0.7 + normalized * 0.3;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const getCryptoArcColor = (currency: 'BTC' | 'ETH'): string[] => {
  // Return gradient colors
  if (currency === 'BTC') {
    return ['rgba(251, 191, 36, 0.9)', 'rgba(251, 191, 36, 0.2)'];
  }
  return ['rgba(192, 132, 252, 0.9)', 'rgba(192, 132, 252, 0.2)'];
};

const getSportsRingColor = (sport: 'football' | 'basketball' | 'formula1'): string => {
  switch (sport) {
    case 'football': return COLORS.sports.football;
    case 'basketball': return COLORS.sports.basketball;
    default: return '#ffffff';
  }
};

const getMarketColor = (changePct: number): string => {
  if (changePct > 0.15) return COLORS.markets.up;
  if (changePct < -0.15) return COLORS.markets.down;
  return COLORS.markets.neutral;
};

export default function WorldGlobe({ data, layers }: GlobeProps) {
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Tooltip formatters with premium styling
  const flightTooltip = useCallback((d: any) => {
    const speedKmh = Math.round(d.velocity * 3.6);
    const altitudeKm = (d.altitude / 1000).toFixed(1);
    return `
      <div style="
        background: linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.95));
        padding: 14px 18px;
        border-radius: 14px;
        font-family: 'SF Mono', 'Fira Code', monospace;
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
        min-width: 220px;
      ">
        <div style="
          font-weight: 600;
          color: #f8fafc;
          margin-bottom: 6px;
          font-size: 14px;
          letter-spacing: 0.05em;
        ">${d.callsign || d.icao24}</div>
        <div style="color: #94a3b8; font-size: 11px; margin-bottom: 12px;">
          ${d.country || 'Unknown Origin'}
        </div>
        <div style="display: flex; gap: 20px; font-size: 12px;">
          <div>
            <div style="color: #64748b; font-size: 9px; text-transform: uppercase; margin-bottom: 2px;">Altitude</div>
            <div style="color: #e2e8f0; font-weight: 600;">${altitudeKm} km</div>
          </div>
          <div>
            <div style="color: #64748b; font-size: 9px; text-transform: uppercase; margin-bottom: 2px;">Speed</div>
            <div style="color: #e2e8f0; font-weight: 600;">${speedKmh} km/h</div>
          </div>
          <div>
            <div style="color: #64748b; font-size: 9px; text-transform: uppercase; margin-bottom: 2px;">Heading</div>
            <div style="color: #e2e8f0; font-weight: 600;">${Math.round(d.heading)}°</div>
          </div>
        </div>
        <div style="
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid rgba(255,255,255,0.08);
          font-size: 9px;
          color: #64748b;
        ">
          Live data from OpenSky Network
        </div>
      </div>
    `;
  }, []);

  const cryptoTooltip = useCallback((d: any) => {
    const color = d.currency === 'BTC' ? '#fbbf24' : '#c084fc';
    const symbol = d.currency === 'BTC' ? '₿' : 'Ξ';
    return `
      <div style="
        background: linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.95));
        padding: 14px 18px;
        border-radius: 14px;
        font-family: 'SF Mono', 'Fira Code', monospace;
        border: 1px solid rgba(${d.currency === 'BTC' ? '251, 191, 36' : '192, 132, 252'}, 0.2);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
        min-width: 240px;
      ">
        <div style="
          font-weight: 600;
          color: ${color};
          margin-bottom: 10px;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        ">
          <span style="font-size: 18px;">${symbol}</span>
          ${d.currency} Transfer
        </div>
        <div style="
          font-size: 22px;
          font-weight: 700;
          color: #f8fafc;
          margin-bottom: 10px;
        ">$${d.value_usd.toLocaleString()}</div>
        <div style="
          display: 'flex';
          align-items: center;
          gap: 8px;
          font-size: 11px;
          color: #94a3b8;
        ">
          <span>${d.from_country}</span>
          <span style="color: #64748b;">→</span>
          <span>${d.to_country}</span>
        </div>
        <div style="
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid rgba(255,255,255,0.08);
          font-size: 8px;
          color: #64748b;
          font-family: monospace;
        ">
          TX: ${d.tx_hash?.slice(0, 16)}...
        </div>
      </div>
    `;
  }, []);

  const marketTooltip = useCallback((d: any) => {
    const point = d.points?.[0];
    if (!point) return '';
    const color = point.change_pct > 0 ? '#22c55e' : point.change_pct < 0 ? '#ef4444' : '#64748b';
    const sign = point.change_pct >= 0 ? '+' : '';
    const arrow = point.change_pct > 0 ? '↑' : point.change_pct < 0 ? '↓' : '•';
    return `
      <div style="
        background: linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.95));
        padding: 14px 18px;
        border-radius: 14px;
        font-family: 'SF Mono', 'Fira Code', monospace;
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
        min-width: 180px;
      ">
        <div style="
          font-weight: 600;
          color: #f8fafc;
          margin-bottom: 10px;
          font-size: 13px;
        ">${point.index_name}</div>
        <div style="
          display: flex;
          align-items: baseline;
          gap: 8px;
        ">
          <span style="
            font-size: 24px;
            font-weight: 700;
            color: ${color};
          ">${sign}${point.change_pct.toFixed(2)}%</span>
          <span style="color: ${color}; font-size: 16px;">${arrow}</span>
        </div>
        <div style="
          font-size: 13px;
          color: #94a3b8;
          margin-top: 8px;
        ">
          ${point.price.toLocaleString()} pts
        </div>
        <div style="
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid rgba(255,255,255,0.08);
          font-size: 9px;
          color: #64748b;
        ">
          Yahoo Finance • Real-time
        </div>
      </div>
    `;
  }, []);

  const sportsTooltip = useCallback((d: any) => {
    const emoji = d.sport === 'football' ? '⚽' : d.sport === 'basketball' ? '🏀' : '🏎️';
    const color = d.sport === 'football' ? '#22c55e' : '#f97316';
    return `
      <div style="
        background: linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.95));
        padding: 14px 18px;
        border-radius: 14px;
        font-family: 'SF Mono', 'Fira Code', monospace;
        border: 1px solid rgba(${d.sport === 'football' ? '34, 197, 94' : '249, 115, 22'}, 0.2);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
        min-width: 260px;
      ">
        <div style="
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        ">
          <span style="font-size: 20px;">${emoji}</span>
          <span style="font-weight: 600; color: #f8fafc; font-size: 12px;">${d.league}</span>
        </div>
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        ">
          <span style="color: #e2e8f0; font-size: 13px; font-weight: 500;">${d.home_team}</span>
          <span style="color: ${color}; font-size: 22px; font-weight: 700;">${d.home_score}</span>
        </div>
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <span style="color: #e2e8f0; font-size: 13px; font-weight: 500;">${d.away_team}</span>
          <span style="color: ${color}; font-size: 22px; font-weight: 700;">${d.away_score}</span>
        </div>
        <div style="
          font-size: 9px;
          color: #64748b;
          margin-top: 12px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        ">${d.stadium_name}</div>
        <div style="
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid rgba(255,255,255,0.08);
          font-size: 9px;
          color: #64748b;
        ">
          ESPN • Live Game
        </div>
      </div>
    `;
  }, []);

  // Globe ready callback
  const onGlobeReady = useCallback(() => {
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 0);
      try {
        const controls = globeRef.current.controls();
        if (controls) {
          controls.autoRotate = true;
          controls.autoRotateSpeed = 0.3;
          controls.enableZoom = true;
          controls.enablePan = false;
        }
      } catch (err) {
        console.warn('Could not set globe controls', err);
      }
    }
  }, []);

  // Process flight data - enhanced for visibility
  const flightPoints = data?.flights && layers.flights
    ? data.flights
      .filter((f) => f.lat && f.lng && !f.on_ground)
      .map((flight) => ({
        ...flight,
        pointLat: flight.lat,
        pointLng: flight.lng,
        pointAltitude: flight.altitude / 15000000,
        pointColor: getFlightColor(flight.velocity),
        pointRadius: 0.15,
      }))
    : [];

  // Process crypto arcs with altitude variation
  const cryptoArcs = data?.crypto_arcs && layers.crypto
    ? data.crypto_arcs.map((arc, i) => ({
      ...arc,
      startLat: arc.from_lat,
      startLng: arc.from_lng,
      endLat: arc.to_lat,
      endLng: arc.to_lng,
      arcColor: getCryptoArcColor(arc.currency),
      arcStroke: Math.max(0.5, Math.log10(arc.value_usd + 1) * 0.3),
      arcAltitude: 0.12 + (i % 5) * 0.04,
    }))
    : [];

  // Process sports rings with variation
  const sportsRings = data?.live_matches && layers.sports
    ? data.live_matches.map((match, index) => ({
      ...match,
      ringLat: match.lat,
      ringLng: match.lng,
      ringMaxRadius: 3 + (index % 3) * 0.8,
      ringColor: getSportsRingColor(match.sport),
    }))
    : [];

  // Market hex data
  const marketHexData = layers.markets ? (data?.markets || []) : [];

  return (
    <div
      ref={containerRef}
      style={{
        width: '100vw',
        height: '100vh',
        cursor: 'grab',
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at center, #0a0a14 0%, #030308 100%)',
      }}
    >
      {/* Ambient glow effects */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '20%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.04) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '30%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.03) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {dimensions.width > 0 && (
        <Globe
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          globeImageUrl={EARTH_NIGHT_TEXTURE}
          bumpImageUrl={EARTH_TOPOGRAPHY}
          atmosphereColor="rgba(100, 150, 255, 0.3)"
          atmosphereAltitude={0.25}
          backgroundColor="rgba(0,0,0,0)"
          // Flight points layer - enhanced visibility
          pointsData={flightPoints}
          pointLat="pointLat"
          pointLng="pointLng"
          pointAltitude="pointAltitude"
          pointColor="pointColor"
          pointRadius="pointRadius"
          pointLabel={flightTooltip}
          pointsMerge={true}
          // Crypto arcs layer - premium styling
          arcsData={cryptoArcs}
          arcStartLat="startLat"
          arcStartLng="startLng"
          arcEndLat="endLat"
          arcEndLng="endLng"
          arcColor="arcColor"
          arcStroke="arcStroke"
          arcDashLength={0.4}
          arcDashGap={0.2}
          arcDashAnimateTime={1800}
          arcAltitude={0.15}
          arcLabel={cryptoTooltip}
          // Markets hex layer - 3D bars
          hexBinPointsData={marketHexData}
          hexBinPointLat="lat"
          hexBinPointLng="lng"
          hexBinPointWeight={0.08}
          hexAltitude={(d: any) => {
            const point = d.points?.[0];
            return point ? Math.abs(point.change_pct) * 0.05 + 0.03 : 0.03;
          }}
          hexTopColor={(d: any) => {
            const point = d.points?.[0];
            return point ? getMarketColor(point.change_pct) : '#334155';
          }}
          hexSideColor="#0f172a"
          hexMargin={0.2}
          hexBinResolution={3}
          hexLabel={marketTooltip}
          // Sports rings layer - pulsing effects
          ringsData={sportsRings}
          ringLat="ringLat"
          ringLng="ringLng"
          ringMaxRadius="ringMaxRadius"
          ringColor="ringColor"
          ringPropagationSpeed={3}
          ringRepeatPeriod={800}
          // Labels layer for sports tooltips (since rings are not interactable)
          labelsData={sportsRings}
          labelLat="ringLat"
          labelLng="ringLng"
          labelText={() => ''}
          labelDotRadius={0.5}
          labelColor={() => 'rgba(255,255,255,0)'}
          labelLabel={sportsTooltip}
          onGlobeReady={onGlobeReady}
        />
      )}
    </div>
  );
}
