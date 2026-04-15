/**
 * The World Pulse Dashboard Page
 * 
 * This is our main command center. It orchestrates all the components:
 * the 3D globe, the real-time stats sidebar, and the connection status indicators.
 * We've designed this to feel like a high-tech monitoring station for the entire planet.
 */

'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useWorldPulse } from '@/hooks/useWorldPulse';
import { LayerVisibility } from '@/lib/world-pulse/types';
import Sidebar from '@/components/world-pulse/Sidebar';
import LoadingScreen from '@/components/world-pulse/LoadingScreen';
import Legend from '@/components/world-pulse/Legend';
import Navbar from '@/components/world-pulse/Navbar';

// We load our Globe dynamically because Three.js/WebGL logic only works in the browser.
// This keeps our initial bundle light and avoids server-side errors.
const Globe = dynamic(() => import('@/components/world-pulse/Globe'), {
  ssr: false,
  loading: () => null,
});

export default function WorldPulsePage() {
  // WebSocket connection for real-time data
  const { data, status, lastUpdate } = useWorldPulse({
    autoConnect: true,
  });

  // Layer visibility state
  const [layers, setLayers] = useState<LayerVisibility>({
    flights: true,
    crypto: true,
    markets: true,
    sports: true,
  });

  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Toggle a specific layer
  const toggleLayer = (key: keyof LayerVisibility) => {
    setLayers((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Connection status
  const isConnected = status === 'connected';

  // Hide loading screen after first data arrives
  useEffect(() => {
    if (data && data.flights && data.flights.length > 0) {
      const timer = setTimeout(() => setIsLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [data]);

  // Fetch initial data via REST API as fallback
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch('/api/world-pulse');
        if (response.ok) {
          console.log('[WorldPulse] Initial data loaded via REST');
        }
      } catch (error) {
        console.warn('[WorldPulse] Initial REST fetch failed:', error);
      }
    };

    fetchInitialData();
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        background: '#030308',
        overflow: 'hidden',
      }}
    >
      {/* Loading screen */}
      {isLoading && <LoadingScreen />}

      {/* 3D Globe - fullscreen background */}
      <Globe data={data} layers={layers} />

      {/* Unified Navigation Dock */}
      <Navbar
        layers={layers}
        onToggle={toggleLayer}
        data={data}
        connected={isConnected}
      />

      {/* Stats sidebar - right side */}
      <Sidebar
        data={data}
        connected={isConnected}
        lastUpdate={lastUpdate}
      />

      {/* Legend - bottom right */}
      <Legend />

      {/* Title overlay - bottom left (Minimal version) */}
      <div
        className="fixed bottom-7 left-7 z-[100] pointer-events-none"
      >
        <div className="flex flex-col gap-4 opacity-40">
          <div className="flex gap-4">
            {[
              { label: 'Flights', source: 'OpenSky' },
              { label: 'Blockchain', source: 'Real-Time' },
              { label: 'Markets', source: 'Finance' },
              { label: 'Sports', source: 'Live' },
            ].map((item) => (
              <span
                key={item.label}
                className="text-[8px] font-mono tracking-widest text-white/50 uppercase"
              >
                {item.label}: {item.source}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Instructions overlay - bottom center */}
      <div
        className="fixed bottom-7 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-widest text-white/20 z-[100] flex gap-5 pointer-events-none"
      >
        <span>SCROLL TO ZOOM</span>
        <span className="opacity-30">•</span>
        <span>DRAG TO ROTATE</span>
        <span className="opacity-30">•</span>
        <span>HOVER FOR DETAILS</span>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
