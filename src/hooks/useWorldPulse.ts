/**
 * WebSocket Hook for World Pulse
 * 
 * Connects to the WebSocket server and provides real-time data updates.
 * Includes automatic reconnection with exponential backoff.
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { WorldPulsePayload, ConnectionStatus } from '@/lib/world-pulse/types';

interface UseWorldPulseOptions {
  url?: string;
  autoConnect?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

interface UseWorldPulseReturn {
  data: WorldPulsePayload | null;
  status: ConnectionStatus;
  lastUpdate: Date | null;
  requestUpdate: () => void;
  reconnect: () => void;
}

// WebSocket server port
const WS_PORT = 3003;

export function useWorldPulse(options: UseWorldPulseOptions = {}): UseWorldPulseReturn {
  const {
    autoConnect = true,
    onConnect,
    onDisconnect,
    onError,
  } = options;

  const [data, setData] = useState<WorldPulsePayload | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>('connecting');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  const socketRef = useRef<Socket | null>(null);
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(false);

  // Create socket connection
  useEffect(() => {
    mountedRef.current = true;

    const connect = () => {
      // Clear any existing retry timer
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }

      if (!mountedRef.current) return;

      setStatus('connecting');

      try {
        // Connect to WebSocket server
        const socket = io(`/?XTransformPort=${WS_PORT}`, {
          transports: ['websocket', 'polling'],
          forceNew: true,
          reconnection: false,
          timeout: 10000,
        });

        socketRef.current = socket;

        socket.on('connect', () => {
          if (!mountedRef.current) return;
          setStatus('connected');
          retryCountRef.current = 0;
          console.log('[WorldPulse] WebSocket connected');
          onConnect?.();
        });

        socket.on('disconnect', () => {
          if (!mountedRef.current) return;
          setStatus('disconnected');
          console.log('[WorldPulse] WebSocket disconnected');
          onDisconnect?.();
          scheduleReconnect();
        });

        socket.on('connect_error', (error) => {
          if (!mountedRef.current) return;
          console.error('[WorldPulse] Connection error:', error);
          setStatus('error');
          onError?.(error);
          socket.disconnect();
          scheduleReconnect();
        });

        // Handle world pulse data updates
        socket.on('world-pulse-update', (payload: WorldPulsePayload) => {
          if (!mountedRef.current) return;
          setData(payload);
          setLastUpdate(new Date());
        });

      } catch (error) {
        console.error('[WorldPulse] Socket creation error:', error);
        if (mountedRef.current) {
          setStatus('error');
          scheduleReconnect();
        }
      }
    };

    const scheduleReconnect = () => {
      const delay = Math.min(30000, 1000 * Math.pow(2, retryCountRef.current));
      retryCountRef.current++;
      console.log(`[WorldPulse] Reconnecting in ${delay}ms...`);
      
      retryTimerRef.current = setTimeout(() => {
        if (mountedRef.current) {
          connect();
        }
      }, delay);
    };

    const disconnect = () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };

    if (autoConnect) {
      connect();
    }

    return () => {
      mountedRef.current = false;
      disconnect();
    };
  }, [autoConnect, onConnect, onDisconnect, onError]);

  const requestUpdate = () => {
    if (socketRef.current && status === 'connected') {
      socketRef.current.emit('request-update');
    }
  };

  const reconnect = () => {
    // Reset retry count and trigger reconnect via effect
    retryCountRef.current = 0;
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setStatus('connecting');
  };

  return {
    data,
    status,
    lastUpdate,
    requestUpdate,
    reconnect,
  };
}
