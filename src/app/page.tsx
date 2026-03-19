'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useWorldPulse } from '@/hooks/useWorldPulse';
import { LayerVisibility } from '@/lib/world-pulse/types';
import LayerControls from '@/components/world-pulse/LayerControls';
import Sidebar from '@/components/world-pulse/Sidebar';
import ConnectionStatus from '@/components/world-pulse/ConnectionStatus';
import LoadingScreen from '@/components/world-pulse/LoadingScreen';
import Legend from '@/components/world-pulse/Legend';

// Dynamically import Globe to avoid SSR issues with react-globe.gl
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

      {/* Connection status - top left */}
      <ConnectionStatus connected={isConnected} />

      {/* Layer toggle buttons - top center */}
      <LayerControls
        layers={layers}
        onToggle={toggleLayer}
        data={data}
      />

      {/* Stats sidebar - right side */}
      <Sidebar
        data={data}
        connected={isConnected}
        lastUpdate={lastUpdate}
      />

      {/* Legend - bottom right */}
      <Legend />

      {/* Title overlay - bottom left */}
      <div
        style={{
          position: 'absolute',
          bottom: '28px',
          left: '28px',
          zIndex: 100,
        }}
      >
        <h1
          style={{
            fontFamily: 'monospace',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.25em',
            color: 'rgba(255,255,255,0.2)',
            margin: 0,
            textShadow: '0 0 20px rgba(255,255,255,0.1)',
          }}
        >
          WORLD PULSE
        </h1>
        <p
          style={{
            fontFamily: 'monospace',
            fontSize: '8px',
            letterSpacing: '0.15em',
            color: 'rgba(255,255,255,0.12)',
            margin: '6px 0 0 0',
            textTransform: 'uppercase',
          }}
        >
          Real-Time Global Intelligence
        </p>
        <div
          style={{
            display: 'flex',
            gap: '16px',
            marginTop: '12px',
          }}
        >
          {[
            { label: 'Flights', source: 'OpenSky' },
            { label: 'Crypto', source: 'Blockchain' },
            { label: 'Markets', source: 'Yahoo' },
            { label: 'Sports', source: 'ESPN' },
          ].map((item) => (
            <span
              key={item.label}
              style={{
                fontSize: '7px',
                letterSpacing: '0.08em',
                color: 'rgba(255,255,255,0.15)',
                textTransform: 'uppercase',
              }}
            >
              {item.label}: {item.source}
            </span>
          ))}
        </div>
      </div>

      {/* Instructions overlay - bottom center */}
      <div
        style={{
          position: 'absolute',
          bottom: '28px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'monospace',
          fontSize: '9px',
          letterSpacing: '0.1em',
          color: 'rgba(255,255,255,0.15)',
          zIndex: 100,
          display: 'flex',
          gap: '20px',
        }}
      >
        <span>Scroll to zoom</span>
        <span style={{ opacity: 0.3 }}>•</span>
        <span>Drag to rotate</span>
        <span style={{ opacity: 0.3 }}>•</span>
        <span>Hover for details</span>
      </div>

      {/* Real data badge */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '280px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 14px',
          background: 'rgba(34, 197, 94, 0.1)',
          border: '1px solid rgba(34, 197, 94, 0.2)',
          borderRadius: '20px',
          fontFamily: 'monospace',
          fontSize: '9px',
          letterSpacing: '0.08em',
          color: '#22c55e',
          zIndex: 100,
        }}
      >
        <div
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#22c55e',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
        LIVE DATA
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
