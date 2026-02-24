
<div align="center">

# ⚡ AI Predictive Autoscaling Engine

**An intelligent, real-time infrastructure autoscaling system powered by a custom Linear Regression ML model**

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue?style=flat-square)](LICENSE)

</div>

---

## 📖 Overview

The **AI Predictive Autoscaling Engine** combines a custom-built ML model with a real-time full-stack dashboard to make **proactive** infrastructure scaling decisions — acting on *forecasted* load rather than reacting to load spikes after they occur.

Instead of waiting for CPU to spike above a threshold and then scrambling to spin up instances, this engine:

1. **Collects** live system metrics every 5 seconds (real CPU, memory via `systeminformation`)
2. **Trains** a Linear Regression model on a rolling 10-sample CPU history window
3. **Predicts** the next CPU value using Ordinary Least Squares (y = mx + b)
4. **Decides** to scale up, scale down, or hold based on the *predicted* value + a confidence score
5. **Broadcasts** all data in real-time to a React dashboard over a WebSocket connection

---

## ✨ Features

| Category | Features |
|----------|---------|
| 🤖 **AI/ML** | Custom Linear Regression (no ML library), OLS fitting, MAE-based confidence scoring, rolling prediction window |
| 📡 **Real-time** | WebSocket push from server to dashboard (~5s refresh), auto-reconnect, live connection badge |
| ⚙️ **Scaling Logic** | Configurable thresholds, cooldown guard, confidence gate, min/max instance bounds |
| 📊 **Dashboard** | CPU & Memory line/area charts with threshold reference lines, metric cards with health status, scaling event log |
| 🔒 **Security** | Authentication required for Live Dashboard and Admin configurations via `ProtectedRoute` flow |
| 🎨 **Design** | Glassmorphism UI, Inter + JetBrains Mono fonts, animated gradient background, hover lift cards, color-coded health states |
| 🔧 **Dev Experience** | Single `npm run dev` starts both servers, Vite proxy, `.env` config for all parameters |
| 🏭 **Production** | Health check endpoint, graceful configuration via env vars, MVC architecture, modular services |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      BROWSER  (port 3000)                           │
│                                                                     │
│   Zustand Store ◄── useWebSocket hook ◄── WebSocket (port 5001)     │
│        │                                                            │
│        ▼                                                            │
│   useMetrics hook                                                   │
│        │                                                            │
│        ▼                                                            │
│   App.jsx                                                           │
│   ├── Header         (live/disconnected badge)                      │
│   ├── MetricCard ×3  (CPU · Memory · RPS with health colors)        │
│   ├── ScalingPanel   (instances · last action · AI prediction)      │
│   └── CPUChart + MemoryChart  (Recharts with threshold lines)       │
└───────────────────────────────┬─────────────────────────────────────┘
                                │ WebSocket push every 5s
                                │ HTTP /api/metrics/history (initial load)
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│              BACKEND  (Express :5000 + WebSocket :5001)             │
│                                                                     │
│  REST API                      WebSocket Server                     │
│  ├── GET  /health              └── Broadcasts:                      │
│  ├── GET  /api/metrics/current      { type: "METRICS_UPDATE" }      │
│  ├── GET  /api/metrics/history      { type: "SCALING_DECISION" }    │
│  └── POST /api/scaling                                              │
│                                                                     │
│  Autoscaler Loop (every 5s via .env POLL_INTERVAL_MS)               │
│  generateMetrics → cpuHistory → model.train → model.predict         │
│  → model.confidence → evaluateScaling → wss.broadcast               │
└───────────────────────────────┬─────────────────────────────────────┘
                                │ require
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      AI ENGINE                                      │
│  ai/predictor.js — LinearRegression class                           │
│  • train(data[])    — Ordinary Least Squares, O(n)                  │
│  • predict(x)       — y = mx + b                                    │
│  • confidence(data) — 1 − (MAE / 100), range [0, 1]                 │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🤖 The ML Engine

The predictor (`ai/predictor.js`) implements **Ordinary Least Squares** linear regression from scratch — no external ML libraries.

```js
// train: compute slope m and intercept b from time-indexed CPU history
train(data) {
  // sumX = Σ time indices, sumY = Σ CPU values, sumXY = Σ (i × cpu), sumXX = Σ (i²)
  this.m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  this.b = (sumY - this.m * sumX) / n;
}

// predict: y = mx + b
predict(x) { return this.m * x + this.b; }

// confidence: inverse of Mean Absolute Error, clamped to [0, 1]
confidence(data) {
  const mae = Σ|actual − predicted| / n;
  return Math.max(0, 1 − mae / 100);
}
```

The engine requires at least **6 samples** before it starts predicting. Until then, the current CPU value is used directly for scaling decisions.

---

## 📁 Project Structure

```
ai-predictive-autoscaling-engine/
│
├── ai/
│   └── predictor.js              # LinearRegression class (train, predict, confidence)
│
├── backend/
│   ├── .env                      # All config (ports, thresholds, intervals)
│   ├── package.json
│   └── src/
│       ├── server.js             # HTTP (5000) + WebSocket (5001) servers
│       ├── app.js                # Express setup, CORS, routes
│       ├── autoscaler/
│       │   └── autoscaler.js     # ML loop + WebSocket broadcast
│       ├── controllers/
│       │   ├── metrics.controller.js
│       │   └── scaling.controllers.js
│       ├── routes/
│       │   ├── metrics.routes.js  # GET /current, GET /history
│       │   └── scaling.routes.js  # POST /scaling
│       └── services/
│           ├── metrics.service.js # systeminformation + RPS simulation
│           └── scaling.service.js # Threshold/cooldown/instance logic
│
├── frontend/
│   ├── vite.config.js            # Dev server + /api proxy
│   └── src/
│       ├── App.jsx               # Root component composition
│       ├── index.css             # Design system (tokens, glassmorphism, animations)
│       ├── components/
│       │   ├── ProtectedRoute.jsx # Route guard checking auth state
│       │   ├── Header.jsx        # Title + live connection badge
│       │   ├── MetricCard.jsx    # Glass card with progress bar + health color
│       │   ├── ScalingPanel.jsx  # Instances · action · AI prediction panels
│       │   ├── CPUChart.jsx      # Line chart with scale-up/down reference lines
│       │   └── MemoryChart.jsx   # Area chart with gradient fill
│       ├── hooks/
│       │   ├── useWebSocket.js   # WS connection, message routing, auto-reconnect
│       │   └── useMetrics.js     # Derived health status labels from store
│       └── store/
│           └── useAutoscalerStore.js  # Zustand: 60-pt rolling history, events
│
└── package.json                  # Root: `npm run dev` starts both servers
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) v18 or later
- npm v9 or later

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/your-username/ai-predictive-autoscaling-engine.git
cd ai-predictive-autoscaling-engine

# 2. Install all dependencies (root + backend + frontend)
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
npm install   # installs concurrently at root
```

### Running in Development

```bash
# Start both backend and frontend with one command
npm run dev
```

| Server | URL |
|--------|-----|
| Dashboard | http://localhost:3000 |
| API | http://localhost:5000 |
| WebSocket | ws://localhost:5001 |

> The dashboard will initially show `DISCONNECTED` until the backend is up. It auto-reconnects every 3 seconds.

---

## ⚙️ Configuration

All backend parameters are controlled via `backend/.env`:

```env
# Server
PORT=5000
WS_PORT=5001

# Autoscaler thresholds
SCALE_UP_THRESHOLD=70       # Scale up when predicted CPU > 70%
SCALE_DOWN_THRESHOLD=30     # Scale down when predicted CPU < 30%
MAX_INSTANCES=10
MIN_INSTANCES=1

# Timing
COOLDOWN_MS=20000           # Wait 20s between scale actions
POLL_INTERVAL_MS=5000       # Autoscaler runs every 5s

# ML Engine
MIN_TRAIN_SAMPLES=6         # Minimum history points before predicting
CPU_HISTORY_WINDOW=10       # Rolling window size for training
CONFIDENCE_THRESHOLD=0.6    # Minimum ML confidence required to act
```

---

## 🌐 REST API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Service health check → `{ "Status": "UP" }` |
| `GET` | `/api/metrics/current` | Latest CPU, memory, RPS snapshot |
| `GET` | `/api/metrics/history?limit=60` | Historical metrics array |
| `POST` | `/api/scaling` | Manual scale trigger: body `{ "cpu": 75 }` |

### WebSocket Events

Connect to `ws://localhost:5001`. Messages are JSON with a `type` field:

```json
// Received every POLL_INTERVAL_MS
{ "type": "METRICS_UPDATE", "payload": { "cpu": 42, "memory": 67, "requestsPerSecond": 183, "predictedCPU": 48, "confidence": 87 } }

// Received after each autoscaler evaluation
{ "type": "SCALING_DECISION", "payload": { "action": "NO_ACTION", "currentInstances": 1 } }
```

**Action values:** `SCALE_UP` · `SCALE_DOWN` · `NO_ACTION` · `COOLDOWN`

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **ML Engine** | Vanilla JavaScript (custom OLS Linear Regression) |
| **Backend** | Node.js, Express 5, `ws` (WebSocket), `systeminformation`, `dotenv` |
| **Frontend** | React 19, Vite 7, Zustand, Recharts |
| **Styling** | Vanilla CSS with custom properties (glassmorphism, Inter + JetBrains Mono) |
| **Dev Tooling** | Nodemon, ESLint, concurrently |

---


<div align="center">
  
**Built by Varnika Rathi**

*Bridging the gap between reactive and predictive infrastructure management*

</div>

