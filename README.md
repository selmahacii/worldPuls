# World Pulse

Real-Time Global Intelligence Dashboard. visualizes global data: flights, blockchain transitions, market indices, and sports.

##  Architecture

```mermaid
graph TD
    subgraph "Clients Layer"
        C1[Client Browser]
        C2[Client Browser]
    end

    subgraph "Application Layer (Next.js)"
        Next[Next.js App]
        Globe[Globe 3D Rendering]
        State[State Manager]
        Hook[useWorldPulse Hook]
        
        Next --- Globe
        Next --- Hook
        Hook --- State
    end

    subgraph "Streaming Service (WS Server)"
        WS[WebSocket Node.js]
        Agg[Data Aggregator]
        Cache[In-Memory Cache]
        
        WS --- Agg
        Agg --- Cache
    end

    subgraph "External Data Layer"
        OS[OpenSky Network]
        BC[Blockchain.com]
        YF[Yahoo Finance]
        ES[ESPN API]
    end

    C1 <-->|Socket.IO| WS
    C2 <-->|Socket.IO| WS
    WS <-->|HTTP| OS
    WS <-->|HTTP| BC
    WS <-->|HTTP| YF
    WS <-->|HTTP| ES
```

##  Data Flow

```mermaid
sequenceDiagram
    participant Clients as Client Browsers
    participant WS as WS Server
    participant Agg as Aggregator
    participant APIs as External APIs (Flight/Crypto/Market)

    WS ->> Agg: trigger update every 5s
    Agg ->> APIs: GET /states, /transactions, /chart...
    APIs -->> Agg: RAW JSON payloads
    Agg ->> Agg: Process & Map Coordinates
    Agg ->> WS: Built WorldPulsePayload
    WS ->> Clients: BROADCAST world-pulse-update
    Clients ->> Clients: React Render (Globe/Stats)
```

##  Project Structure

```mermaid
graph LR
    Root[world-pulse/]
    Root --- Src[src/]
    Root --- MS[mini-services/]
    
    Src --- App[app/]
    Src --- Lib[lib/]
    Src --- Comp[components/]
    
    MS --- WS[world-pulse-ws/]
    
    WS --- WS_IDX[index.ts]
    
    Lib --- WP[world-pulse/]
    WP --- AGG[aggregator.ts]
    WP --- COL[collectors.ts]
```

##  Execution

```bash
# Main app environment
bun install
bun run dev

# WebSocket service environment
cd mini-services/world-pulse-ws
bun install
bun run dev
```

---
© 2026 Selma Haci - World Pulse - MIT License
