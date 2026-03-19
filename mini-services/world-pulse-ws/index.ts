/**
 * World Pulse WebSocket Server
 * 
 * Mini-service that broadcasts real-time data to all connected clients.
 * Pushes complete WorldPulsePayload every 5 seconds.
 */

import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { WorldPulsePayload } from '../../src/lib/world-pulse/types';
import { buildPayload, initCollectors, startCryptoTransactionFetcher } from '../../src/lib/world-pulse/aggregator';

// Create HTTP server
const httpServer = createServer();

// Create Socket.IO server
const io = new Server(httpServer, {
  path: '/',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Track connected clients
const connectedClients = new Set<Socket>();

// Broadcasting state
let isBroadcasting = false;
let broadcastInterval: NodeJS.Timeout | null = null;

/**
 * Broadcast data to all connected clients.
 */
async function broadcast(): Promise<void> {
  if (connectedClients.size === 0) {
    return;
  }

  try {
    const payload = await buildPayload();
    
    // Emit to all clients
    io.emit('world-pulse-update', payload);
    
    console.log(`[WS] Broadcasted to ${connectedClients.size} clients: ${payload.flights.length} flights, ${payload.crypto_arcs.length} crypto arcs`);
    
  } catch (error) {
    console.error('[WS] Broadcast error:', error);
  }
}

/**
 * Start the broadcast loop.
 */
function startBroadcasting(): void {
  if (isBroadcasting) {
    return;
  }
  
  isBroadcasting = true;
  
  // Broadcast immediately on first connection
  broadcast();
  
  // Then every 5 seconds
  broadcastInterval = setInterval(broadcast, 5000);
  
  console.log('[WS] Started broadcasting');
}

/**
 * Stop the broadcast loop.
 */
function stopBroadcasting(): void {
  if (broadcastInterval) {
    clearInterval(broadcastInterval);
    broadcastInterval = null;
  }
  isBroadcasting = false;
  console.log('[WS] Stopped broadcasting');
}

// Handle connections
io.on('connection', (socket: Socket) => {
  connectedClients.add(socket);
  console.log(`[WS] Client connected: ${socket.id} (total: ${connectedClients.size})`);

  // Start broadcasting if this is the first client
  if (connectedClients.size === 1) {
    startBroadcasting();
  }

  // Send initial data immediately
  buildPayload().then(payload => {
    socket.emit('world-pulse-update', payload);
  }).catch(err => {
    console.error('[WS] Initial data error:', err);
  });

  // Handle client requesting immediate update
  socket.on('request-update', async () => {
    try {
      const payload = await buildPayload();
      socket.emit('world-pulse-update', payload);
    } catch (error) {
      console.error('[WS] Update request error:', error);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    connectedClients.delete(socket);
    console.log(`[WS] Client disconnected: ${socket.id} (total: ${connectedClients.size})`);

    // Stop broadcasting if no clients
    if (connectedClients.size === 0) {
      stopBroadcasting();
    }
  });

  // Handle errors
  socket.on('error', (error) => {
    console.error(`[WS] Socket error (${socket.id}):`, error);
    connectedClients.delete(socket);
  });
});

// Start server
const PORT = 3003;

async function start() {
  // Initialize data collectors
  await initCollectors();
  
  // Start periodic crypto transaction fetching
  startCryptoTransactionFetcher();
  
  httpServer.listen(PORT, () => {
    console.log(`[WS] World Pulse WebSocket server running on port ${PORT}`);
  });
}

start().catch(err => {
  console.error('[WS] Startup error:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[WS] Received SIGTERM, shutting down...');
  stopBroadcasting();
  io.close(() => {
    console.log('[WS] Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('[WS] Received SIGINT, shutting down...');
  stopBroadcasting();
  io.close(() => {
    console.log('[WS] Server closed');
    process.exit(0);
  });
});
