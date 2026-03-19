'use client';

import type { WorldPulsePayload } from '@/lib/world-pulse/types';

interface SidebarProps {
  data: WorldPulsePayload | null;
  connected: boolean;
  lastUpdate: Date | null;
}

// Section component with glassmorphism styling
function DataSection({
  icon,
  title,
  subtitle,
  accentColor,
  children,
}: {
  icon: string;
  title: string;
  subtitle: string;
  accentColor: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        marginBottom: '16px',
        padding: '16px',
        background: `linear-gradient(135deg, ${accentColor}08 0%, transparent 100%)`,
        borderRadius: '16px',
        border: `1px solid ${accentColor}15`,
        backdropFilter: 'blur(10px)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '14px',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '10px',
            background: `${accentColor}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
          }}
        >
          {icon}
        </div>
        <div>
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.12em',
              color: accentColor,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: '9px',
              letterSpacing: '0.08em',
              color: 'rgba(255,255,255,0.35)',
              marginTop: '2px',
            }}
          >
            {subtitle}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

// Stat display component
function StatDisplay({
  label,
  value,
  unit,
  color,
  size = 'medium',
}: {
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
  size?: 'small' | 'medium' | 'large';
}) {
  const fontSize = size === 'large' ? '26px' : size === 'medium' ? '18px' : '14px';
  
  return (
    <div>
      <div
        style={{
          fontFamily: 'monospace',
          fontSize: '9px',
          letterSpacing: '0.1em',
          color: 'rgba(255,255,255,0.35)',
          marginBottom: '4px',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: 'monospace',
          fontSize,
          fontWeight: 600,
          letterSpacing: '0.02em',
          color: color || 'rgba(255,255,255,0.9)',
        }}
      >
        {value}
        {unit && (
          <span
            style={{
              fontSize: '11px',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.4)',
              marginLeft: '4px',
            }}
          >
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

// Progress ring component
function ProgressRing({
  value,
  max,
  color,
  size = 60,
}: {
  value: number;
  max: number;
  color: string;
  size?: number;
}) {
  const pct = Math.min((value / max) * 100, 100);
  const strokeDasharray = 2 * Math.PI * 24;
  const strokeDashoffset = strokeDasharray * (1 - pct / 100);

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={24}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="3"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={24}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          style={{
            filter: `drop-shadow(0 0 6px ${color}60)`,
            transition: 'stroke-dashoffset 0.5s ease',
          }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'monospace',
          fontSize: '12px',
          fontWeight: 600,
          color: 'rgba(255,255,255,0.8)',
        }}
      >
        {Math.round(pct)}%
      </div>
    </div>
  );
}

// Live indicator
function LiveIndicator({ active }: { active: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}
    >
      <div
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: active ? '#22c55e' : '#ef4444',
          boxShadow: active
            ? '0 0 8px rgba(34, 197, 94, 0.8)'
            : '0 0 8px rgba(239, 68, 68, 0.8)',
          animation: active ? 'pulse 2s ease-in-out infinite' : 'none',
        }}
      />
      <span
        style={{
          fontFamily: 'monospace',
          fontSize: '9px',
          letterSpacing: '0.1em',
          color: active ? '#22c55e' : '#ef4444',
          fontWeight: 500,
        }}
      >
        {active ? 'LIVE' : 'OFFLINE'}
      </span>
    </div>
  );
}

export default function Sidebar({ data, connected, lastUpdate }: SidebarProps) {
  // Format time
  const formatTime = (date: Date | null): string => {
    if (!date) return '--:--:--';
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // Calculate stats
  const flights = data?.flights?.length || 0;
  const cryptoArcs = data?.crypto_arcs || [];
  const cryptoValue = cryptoArcs.reduce((sum, a) => sum + (a.value_usd || 0), 0);
  const markets = data?.markets || [];
  const upMarkets = markets.filter(m => m.change_pct > 0).length;
  const downMarkets = markets.filter(m => m.change_pct < 0).length;
  const matches = data?.live_matches || [];

  return (
    <div
      style={{
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: '260px',
        background: `linear-gradient(180deg, 
          rgba(8, 12, 21, 0.97) 0%, 
          rgba(5, 8, 16, 0.98) 50%,
          rgba(3, 5, 12, 0.99) 100%
        )`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderLeft: '1px solid rgba(255,255,255,0.04)',
        fontFamily: 'monospace',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 20px',
        zIndex: 100,
        overflowY: 'auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: '28px',
          paddingBottom: '20px',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: '13px',
            letterSpacing: '0.25em',
            color: 'rgba(255,255,255,0.8)',
            fontWeight: 600,
            marginBottom: '4px',
          }}
        >
          WORLD PULSE
        </div>
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: '9px',
            letterSpacing: '0.12em',
            color: 'rgba(255,255,255,0.3)',
          }}
        >
          REAL-TIME INTELLIGENCE
        </div>
      </div>

      {/* FLIGHTS Section */}
      <DataSection
        icon="✈️"
        title="FLIGHTS"
        subtitle="OpenSky Network"
        accentColor="#60a5fa"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <ProgressRing value={flights} max={6000} color="#60a5fa" size={56} />
          <div style={{ flex: 1 }}>
            <StatDisplay label="AIRCRAFT AIRBORNE" value={flights.toLocaleString()} size="large" color="#60a5fa" />
            <div
              style={{
                marginTop: '8px',
                fontFamily: 'monospace',
                fontSize: '9px',
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              Global real-time tracking
            </div>
          </div>
        </div>
      </DataSection>

      {/* CRYPTO Section */}
      <DataSection
        icon="⚡"
        title="BLOCKCHAIN"
        subtitle="Live Transactions"
        accentColor="#fbbf24"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <StatDisplay label="ACTIVE TRANSFERS" value={cryptoArcs.length.toString()} size="medium" color="#fbbf24" />
          <StatDisplay label="VOLUME" value={`$${(cryptoValue / 1000000).toFixed(2)}M`} size="medium" color="#fcd34d" />
        </div>
        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginTop: '12px',
            paddingTop: '12px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#fbbf24', fontSize: '12px' }}>₿</span>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>
              {cryptoArcs.filter(a => a.currency === 'BTC').length}
            </span>
          </div>
        </div>
      </DataSection>

      {/* MARKETS Section */}
      <DataSection
        icon="📈"
        title="MARKETS"
        subtitle="Yahoo Finance"
        accentColor="#22c55e"
      >
        <StatDisplay label="GLOBAL INDICES" value={markets.length.toString()} size="medium" />
        <div
          style={{
            display: 'flex',
            gap: '24px',
            marginTop: '14px',
          }}
        >
          <div>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', marginBottom: '4px' }}>
              RISING
            </div>
            <div style={{ fontSize: '22px', fontWeight: 600, color: '#22c55e' }}>
              {upMarkets}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', marginBottom: '4px' }}>
              FALLING
            </div>
            <div style={{ fontSize: '22px', fontWeight: 600, color: '#ef4444' }}>
              {downMarkets}
            </div>
          </div>
        </div>
      </DataSection>

      {/* SPORTS Section */}
      <DataSection
        icon="⚽"
        title="LIVE SPORTS"
        subtitle="ESPN API"
        accentColor="#f97316"
      >
        <StatDisplay label="GAMES IN PROGRESS" value={matches.length.toString()} size="medium" color="#f97316" />
        {matches.length > 0 && (
          <div style={{ marginTop: '12px' }}>
            {matches.slice(0, 2).map((m, i) => (
              <div
                key={i}
                style={{
                  padding: '10px 0',
                  borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                }}
              >
                <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' }}>
                  {m.league}
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{m.home_team}</span>
                  <span style={{ color: '#f97316', fontWeight: 600 }}>{m.home_score}</span>
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{m.away_team}</span>
                  <span style={{ color: '#f97316', fontWeight: 600 }}>{m.away_score}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </DataSection>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Footer */}
      <div
        style={{
          paddingTop: '20px',
          borderTop: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        {/* Connection status */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
          }}
        >
          <LiveIndicator active={connected} />
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '10px',
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            {formatTime(lastUpdate)}
          </span>
        </div>

        {/* Data sources */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            opacity: 0.4,
          }}
        >
          {['OpenSky', 'Blockchain', 'Yahoo', 'ESPN'].map((source) => (
            <span
              key={source}
              style={{
                fontFamily: 'monospace',
                fontSize: '8px',
                letterSpacing: '0.08em',
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              {source}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
