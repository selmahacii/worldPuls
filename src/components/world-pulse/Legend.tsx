'use client';

import { useState } from 'react';

export default function Legend() {
  const [isOpen, setIsOpen] = useState(false);

  const layers = [
    {
      icon: '✈️',
      name: 'Flights',
      description: 'Live aircraft positions',
      color: '#60a5fa',
      source: 'OpenSky Network',
      updateFreq: '15s',
    },
    {
      icon: '⚡',
      name: 'Blockchain',
      description: 'Real BTC transactions',
      color: '#fbbf24',
      source: 'Blockchain.com',
      updateFreq: '5s',
    },
    {
      icon: '📈',
      name: 'Markets',
      description: 'Stock market indices',
      color: '#22c55e',
      source: 'Yahoo Finance',
      updateFreq: '60s',
    },
    {
      icon: '⚽',
      name: 'Sports',
      description: 'Live games & matches',
      color: '#f97316',
      source: 'ESPN API',
      updateFreq: '30s',
    },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '20px',
        right: '260px',
        zIndex: 100,
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '6px 12px',
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          color: 'rgba(255,255,255,0.5)',
          fontFamily: 'monospace',
          fontSize: '9px',
          letterSpacing: '0.1em',
          cursor: 'pointer',
          backdropFilter: 'blur(12px)',
          transition: 'all 0.2s ease',
        }}
      >
        {isOpen ? '✕ CLOSE' : '? INFO'}
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: '44px',
            right: 0,
            width: '240px',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(8, 12, 21, 0.98))',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '16px',
            padding: '16px',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}
        >
          {/* Header */}
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: '9px',
              letterSpacing: '0.2em',
              color: 'rgba(255,255,255,0.4)',
              marginBottom: '16px',
              paddingBottom: '12px',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            DATA SOURCES
          </div>

          {/* Layers */}
          {layers.map((layer) => (
            <div
              key={layer.name}
              style={{
                marginBottom: '14px',
                paddingBottom: '14px',
                borderBottom: '1px solid rgba(255,255,255,0.03)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '6px',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    background: `${layer.color}15`,
                    border: `1px solid ${layer.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '13px',
                  }}
                >
                  {layer.icon}
                </div>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    color: layer.color,
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                  }}
                >
                  {layer.name}
                </span>
              </div>
              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: '9px',
                  color: 'rgba(255,255,255,0.4)',
                  marginLeft: '38px',
                }}
              >
                {layer.description}
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: 'monospace',
                  fontSize: '8px',
                  color: 'rgba(255,255,255,0.25)',
                  marginLeft: '38px',
                  marginTop: '4px',
                }}
              >
                <span>{layer.source}</span>
                <span>↻ {layer.updateFreq}</span>
              </div>
            </div>
          ))}

          {/* Tips */}
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: '9px',
              color: 'rgba(255,255,255,0.3)',
              lineHeight: '1.6',
              background: 'rgba(0,0,0,0.2)',
              padding: '10px',
              borderRadius: '8px',
            }}
          >
            💡 Hover over data points for detailed information
            <br />
            🔄 Data refreshes automatically every few seconds
            <br />
            🎛️ Toggle layers using the top buttons
          </div>
        </div>
      )}
    </div>
  );
}
