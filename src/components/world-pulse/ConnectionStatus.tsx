'use client';

interface ConnectionStatusProps {
  connected: boolean;
}

export default function ConnectionStatus({ connected }: ConnectionStatusProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 14px',
        background: connected
          ? 'rgba(34, 197, 94, 0.08)'
          : 'rgba(239, 68, 68, 0.08)',
        border: connected
          ? '1px solid rgba(34, 197, 94, 0.2)'
          : '1px solid rgba(239, 68, 68, 0.2)',
        borderRadius: '20px',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        fontFamily: 'monospace',
        fontSize: '10px',
        letterSpacing: '0.1em',
        zIndex: 100,
      }}
    >
      {/* Animated pulse dot */}
      <div
        style={{
          position: 'relative',
          width: '8px',
          height: '8px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: connected ? '#22c55e' : '#ef4444',
            boxShadow: connected
              ? '0 0 12px rgba(34, 197, 94, 0.6)'
              : '0 0 12px rgba(239, 68, 68, 0.6)',
          }}
        />
        {connected && (
          <div
            style={{
              position: 'absolute',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#22c55e',
              animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
            }}
          />
        )}
      </div>
      
      {/* Status text */}
      <span
        style={{
          color: connected ? '#22c55e' : '#ef4444',
          fontWeight: 500,
        }}
      >
        {connected ? 'LIVE' : 'CONNECTING'}
      </span>

      {/* CSS for ping animation */}
      <style jsx>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
