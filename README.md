# World Pulse

Real-Time Global Intelligence Dashboard. visualizes global data: flights, blockchain transitions, market indices, and sports.

##  Architecture

The system follows a **Modular Distributed** architecture, separating data ingestion from the presentation layer. Below is the detailed architectural breakdown using the **C4 Model**.

### 1. System Context
High-level view of how users and external systems interact with World Pulse.

```mermaid
C4Context
    title System Context Diagram for World Pulse
    
    Person(user, "World Observer", "A user viewing real-time global telemetry dashboard.")
    System(world_pulse, "World Pulse System", "Visualizes real-time global data across flights, crypto, markets, and sports.")
    
    System_Ext(flight_api, "OpenSky Network", "Real-time flight state vectors.")
    System_Ext(blockchain_api, "Blockchain.com", "Real-time crypto transaction data.")
    System_Ext(market_api, "Financial APIs", "Global market indices and currency rates.")
    System_Ext(sports_api, "Sports APIs", "Live scores and match data.")
    
    Rel(user, world_pulse, "Views dashboard", "HTTPS/WSS")
    Rel(world_pulse, flight_api, "Fetches flights", "HTTPS")
    Rel(world_pulse, blockchain_api, "Fetches txs", "HTTPS")
    Rel(world_pulse, market_api, "Fetches markets", "HTTPS")
    Rel(world_pulse, sports_api, "Fetches matches", "HTTPS")

    UpdateElementStyle(user, $fontColor="white", $bgColor="#2d3436")
    UpdateElementStyle(world_pulse, $fontColor="white", $bgColor="#0984e3")
```

### 2. Containers
The technical building blocks of the system.

```mermaid
C4Container
    title Container Diagram for World Pulse
    
    Person(user, "User", "Web browser user.")
    
    System_Boundary(world_pulse_boundary, "World Pulse System") {
        Container(spa, "Frontend Dashboard", "Next.js / React", "Provides the 3D globe visualization and real-time UI.")
        Container(ws_server, "Streaming Service", "Node.js (Bun)", "Aggregates external data and broadcasts it via WebSockets.")
    }
    
    System_Ext(external_data, "Data Sources", "Multiple APIs", "External providers for global telemetry.")
    
    Rel(user, spa, "Interacts with", "HTTPS")
    Rel(spa, ws_server, "Subscribes to updates", "Socket.IO / WSS")
    Rel(ws_server, external_data, "Polls every 5s", "HTTPS")

    UpdateElementStyle(spa, $bgColor="#00b894")
    UpdateElementStyle(ws_server, $bgColor="#6c5ce7")
```

### 3. Components
Internal structure of the Streaming Service (WebSocket Server).

```mermaid
C4Component
    title Component Diagram for Streaming Service
    
    Container(spa, "Frontend Dashboard", "React", "Visualizes the telemetry.")
    
    Container_Boundary(ws_server_boundary, "WebSocket Server") {
        Component(socket_io, "Socket.IO Handler", "TS", "Manages client connections and broadcasts.")
        Component(aggregator, "Data Aggregator", "TS", "Centralizes data from multiple collectors into a single payload.")
        Component(collectors, "Collectors Layer", "TS Modules", "Individual modules for Flight, Crypto, Sports, and Market data.")
        Component(cache, "State Cache", "In-Memory", "Stores the latest broadcast-ready payload.")
    }
    
    System_Ext(apis, "External APIs", "REST", "OpenSky, Blockchain.com, etc.")
    
    Rel(spa, socket_io, "Real-time connection", "WSS")
    Rel(socket_io, aggregator, "Requests telemetry")
    Rel(aggregator, collectors, "Delegates fetching")
    Rel(collectors, apis, "Queries", "HTTPS")
    Rel(aggregator, cache, "Persists state")
    Rel(socket_io, cache, "Reads for broadcast")

    UpdateElementStyle(aggregator, $bgColor="#fdcb6e")
```

##  Original Architecture (Simplified)

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
