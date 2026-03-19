'use client';

import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [dots, setDots] = useState('');

  const phases = [
    { label: 'Connecting to OpenSky Network', icon: '✈️' },
    { label: 'Fetching Blockchain Data', icon: '⚡' },
    { label: 'Loading Market Indices', icon: '📈' },
    { label: 'Syncing Live Sports', icon: '⚽' },
  ];

  useEffect(() => {
    // Animate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + Math.random() * 3 + 1;
      });
    }, 150);

    // Animate phase changes
    const phaseInterval = setInterval(() => {
      setCurrentPhase(prev => (prev + 1) % phases.length);
    }, 800);

    // Animate dots
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 400);

    return () => {
      clearInterval(progressInterval);
      clearInterval(phaseInterval);
      clearInterval(dotsInterval);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: `
          radial-gradient(ellipse at 30% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 80%, rgba(168, 85, 247, 0.06) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 50%, #0a0a14 0%, #030308 100%)
        `,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        fontFamily: 'monospace',
        overflow: 'hidden',
      }}
    >
      {/* Animated background grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          animation: 'gridMove 20s linear infinite',
        }}
      />

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            background: `rgba(${100 + Math.random() * 100}, ${150 + Math.random() * 100}, 255, ${0.2 + Math.random() * 0.3})`,
            borderRadius: '50%',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}

      {/* Main globe visualization */}
      <div
        style={{
          position: 'relative',
          marginBottom: '60px',
        }}
      >
        {/* Outer glow rings */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: `${140 + i * 30}px`,
              height: `${140 + i * 30}px`,
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              border: `1px solid rgba(59, 130, 246, ${0.1 - i * 0.03})`,
              animation: `pulse ${2 + i * 0.5}s ease-in-out infinite`,
            }}
          />
        ))}

        {/* Main globe */}
        <div
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: `
              radial-gradient(circle at 35% 35%, rgba(96, 165, 250, 0.25) 0%, transparent 45%),
              radial-gradient(circle at 65% 65%, rgba(168, 85, 247, 0.15) 0%, transparent 40%),
              linear-gradient(135deg, 
                #1a365d 0%, 
                #0c1929 25%,
                #0a1628 50%, 
                #0c1929 75%,
                #1a365d 100%
              )
            `,
            boxShadow: `
              0 0 80px rgba(59, 130, 246, 0.15),
              0 0 120px rgba(59, 130, 246, 0.1),
              inset 0 0 60px rgba(0, 50, 100, 0.4),
              inset -10px -10px 40px rgba(0, 30, 60, 0.5)
            `,
            position: 'relative',
            animation: 'globeRotate 20s linear infinite, globeGlow 3s ease-in-out infinite',
          }}
        >
          {/* Latitude lines */}
          {[-35, 0, 35].map((offset, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: '50%',
                left: '15%',
                right: '15%',
                height: '1px',
                background: `rgba(96, 165, 250, ${0.15 - Math.abs(offset) * 0.001})`,
                transform: `translateY(${offset}px)`,
                borderRadius: '50%',
              }}
            />
          ))}
          
          {/* Longitude lines */}
          {[0].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: '15%',
                bottom: '15%',
                left: '50%',
                width: '1px',
                background: 'rgba(96, 165, 250, 0.12)',
                borderRadius: '50%',
              }}
            />
          ))}

          {/* Data point dots */}
          {[...Array(8)].map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const radius = 35 + Math.random() * 15;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '3px',
                  height: '3px',
                  background: i % 2 === 0 ? '#60a5fa' : '#a855f7',
                  borderRadius: '50%',
                  transform: `translate(-50%, -50%) translate(${Math.cos(angle) * radius}px, ${Math.sin(angle) * radius}px)`,
                  boxShadow: `0 0 6px ${i % 2 === 0 ? 'rgba(96, 165, 250, 0.8)' : 'rgba(168, 85, 247, 0.8)'}`,
                  animation: `dataPulse ${1.5 + i * 0.2}s ease-in-out infinite`,
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1
          style={{
            fontSize: '32px',
            fontWeight: 300,
            letterSpacing: '0.4em',
            color: 'rgba(255, 255, 255, 0.95)',
            margin: 0,
            textShadow: '0 0 40px rgba(59, 130, 246, 0.3)',
          }}
        >
          WORLD PULSE
        </h1>
        <p
          style={{
            fontSize: '10px',
            letterSpacing: '0.25em',
            color: 'rgba(255, 255, 255, 0.3)',
            margin: '12px 0 0 0',
            textTransform: 'uppercase',
          }}
        >
          Real-Time Global Intelligence
        </p>
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: '280px',
          marginBottom: '30px',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '2px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '1px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${Math.min(progress, 100)}%`,
              height: '100%',
              background: `linear-gradient(90deg, #60a5fa, #a855f7)`,
              borderRadius: '1px',
              transition: 'width 0.2s ease-out',
              boxShadow: '0 0 10px rgba(96, 165, 250, 0.5)',
            }}
          />
        </div>
      </div>

      {/* Phase indicator */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '50px',
        }}
      >
        <span style={{ fontSize: '14px' }}>{phases[currentPhase].icon}</span>
        <span
          style={{
            fontSize: '11px',
            letterSpacing: '0.08em',
            color: 'rgba(255, 255, 255, 0.5)',
          }}
        >
          {phases[currentPhase].label}
          {dots}
        </span>
      </div>

      {/* Data source indicators */}
      <div
        style={{
          display: 'flex',
          gap: '40px',
        }}
      >
        {[
          { icon: '✈️', label: 'OPENSKY', color: '#60a5fa' },
          { icon: '⚡', label: 'BLOCKCHAIN', color: '#fbbf24' },
          { icon: '📈', label: 'YAHOO', color: '#22c55e' },
          { icon: '⚽', label: 'ESPN', color: '#f97316' },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: `${item.color}10`,
                border: `1px solid ${item.color}25`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
              }}
            >
              {item.icon}
            </div>
            <span
              style={{
                fontSize: '8px',
                letterSpacing: '0.12em',
                color: 'rgba(255, 255, 255, 0.35)',
              }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.6; }
        }
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
          50% { transform: translate(-50%, -50%) scale(1.05); opacity: 0.3; }
        }
        @keyframes globeRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes globeGlow {
          0%, 100% { box-shadow: 0 0 80px rgba(59, 130, 246, 0.15), 0 0 120px rgba(59, 130, 246, 0.1), inset 0 0 60px rgba(0, 50, 100, 0.4); }
          50% { box-shadow: 0 0 100px rgba(59, 130, 246, 0.2), 0 0 150px rgba(59, 130, 246, 0.15), inset 0 0 70px rgba(0, 50, 100, 0.5); }
        }
        @keyframes dataPulse {
          0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.5); }
        }
      `}</style>
    </div>
  );
}
