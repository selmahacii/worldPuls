'use client';

import type { WorldPulsePayload } from '@/lib/world-pulse/types';

interface LayerControlsProps {
  layers: { flights: boolean; crypto: boolean; markets: boolean; sports: boolean };
  onToggle: (key: keyof LayerControlsProps['layers']) => void;
  data: WorldPulsePayload | null;
}

const LAYER_CONFIG = [
  { 
    key: 'flights' as const, 
    label: 'Flights', 
    icon: '✈️', 
    color: '#60a5fa',
    bgActive: 'rgba(96, 165, 250, 0.15)',
  },
  { 
    key: 'crypto' as const, 
    label: 'Blockchain', 
    icon: '⚡', 
    color: '#fbbf24',
    bgActive: 'rgba(251, 191, 36, 0.15)',
  },
  { 
    key: 'markets' as const, 
    label: 'Markets', 
    icon: '📈', 
    color: '#22c55e',
    bgActive: 'rgba(34, 197, 94, 0.15)',
  },
  { 
    key: 'sports' as const, 
    label: 'Sports', 
    icon: '⚽', 
    color: '#f97316',
    bgActive: 'rgba(249, 115, 22, 0.15)',
  },
];

export default function LayerControls({ layers, onToggle, data }: LayerControlsProps) {
  const getCount = (key: string): number | null => {
    if (!data) return null;
    switch (key) {
      case 'flights':
        return data.flights?.length || null;
      case 'crypto':
        return data.crypto_arcs?.length || null;
      case 'markets':
        return data.markets?.length || null;
      case 'sports':
        return data.live_matches?.length || null;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '8px',
        fontFamily: 'monospace',
        zIndex: 100,
      }}
    >
      {LAYER_CONFIG.map(({ key, label, icon, color, bgActive }) => {
        const isActive = layers[key];
        const count = getCount(key);

        return (
          <button
            key={key}
            onClick={() => onToggle(key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              border: isActive 
                ? `1px solid ${color}` 
                : '1px solid rgba(255,255,255,0.08)',
              borderRadius: '24px',
              background: isActive
                ? bgActive
                : 'rgba(15, 23, 42, 0.6)',
              color: isActive ? color : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontSize: '10px',
              letterSpacing: '0.08em',
              fontWeight: isActive ? 600 : 400,
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              outline: 'none',
              boxShadow: isActive 
                ? `0 0 20px ${color}20, inset 0 0 20px ${color}10`
                : 'none',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'rgba(30, 41, 59, 0.8)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'rgba(15, 23, 42, 0.6)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
              }
            }}
          >
            <span style={{ fontSize: '12px' }}>{icon}</span>
            <span>{label.toUpperCase()}</span>
            {count !== null && (
              <span
                style={{
                  opacity: isActive ? 0.8 : 0.5,
                  fontSize: '9px',
                  padding: '2px 6px',
                  background: isActive ? `${color}20` : 'rgba(255,255,255,0.05)',
                  borderRadius: '10px',
                }}
              >
                {count.toLocaleString()}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
