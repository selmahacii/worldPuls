/**
 * World Pulse WebSocket Server (Root runner)
 */

import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { WorldPulsePayload } from './src/lib/world-pulse/types';
import { buildPayload, initCollectors, startCryptoTransactionFetcher } from './src/lib/world-pulse/aggregator';

const httpServer = createServer();
const io = new Server(httpServer, {
    path: '/',
    cors: { origin: '*', methods: ['GET', 'POST'] },
});

const connectedClients = new Set<Socket>();
let isBroadcasting = false;
let broadcastInterval: NodeJS.Timeout | null = null;

async function broadcast(): Promise<void> {
    if (connectedClients.size === 0) return;
    try {
        const payload = await buildPayload();
        io.emit('world-pulse-update', payload);
        console.log(`[WS] Broadcasted to ${connectedClients.size} clients`);
    } catch (error) {
        console.error('[WS] Broadcast error:', error);
    }
}

function startBroadcasting(): void {
    if (isBroadcasting) return;
    isBroadcasting = true;
    broadcast();
    broadcastInterval = setInterval(broadcast, 5000);
    console.log('[WS] Started broadcasting');
}

function stopBroadcasting(): void {
    if (broadcastInterval) {
        clearInterval(broadcastInterval);
        broadcastInterval = null;
    }
    isBroadcasting = false;
    console.log('[WS] Stopped broadcasting');
}

io.on('connection', (socket: Socket) => {
    connectedClients.add(socket);
    console.log(`[WS] Client connected: ${socket.id}`);
    if (connectedClients.size === 1) startBroadcasting();
    buildPayload().then(payload => socket.emit('world-pulse-update', payload));
    socket.on('disconnect', () => {
        connectedClients.delete(socket);
        if (connectedClients.size === 0) stopBroadcasting();
    });
});

const PORT = 3003;
async function start() {
    await initCollectors();
    startCryptoTransactionFetcher();
    httpServer.listen(PORT, () => {
        console.log(`[WS] World Pulse WebSocket server running on port ${PORT}`);
    });
}

start().catch(err => {
    console.error('[WS] Startup error:', err);
    process.exit(1);
});
