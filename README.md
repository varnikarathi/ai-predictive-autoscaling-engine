
<div align="center">

# AI Predictive Autoscaling Engine

**An intelligent, real-time infrastructure autoscaling system powered by multi-model ML predictions**

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)

### [Live Demo](https://ai-predictive-autoscaling-engine.onrender.com)

> **Test Credentials for Live Dashboard & Admin Panel:**
> - Username: `admin`
> - Password: `admin`

</div>

---

## Overview

The **AI Predictive Autoscaling Engine** combines multiple custom-built ML models with a real-time full-stack dashboard to make **proactive** infrastructure scaling decisions — acting on *forecasted* load rather than reacting to load spikes after they occur.

Instead of waiting for CPU to spike above a threshold and then scrambling to spin up instances, this engine:

1. **Collects** live system metrics every 5 seconds (real CPU, memory via `systeminformation`)
2. **Trains** three ML models on a rolling 10-sample CPU history window
3. **Compares** model predictions and selects the highest-confidence model automatically
4. **Predicts** the next CPU value and **decides** to scale up, scale down, or hold
5. **Broadcasts** all data in real-time to a React dashboard over a WebSocket connection

---

## Features

| Category | Features |
|----------|----------|
| **AI/ML** | Multi-model prediction engine — Linear Regression (OLS), Exponential Smoothing, Moving Average. Auto-selects best model by confidence. Predicted vs Actual comparison chart. |
| **Real-time** | WebSocket push every ~5s, auto-reconnect with status badge, live model comparison panel |
| **Scaling Logic** | Configurable thresholds, cooldown guard, confidence gate, min/max instance bounds, manual override |
| **Dashboard** | CPU & Memory charts, metric cards with health status, scaling event log, model comparison panel, predicted vs actual chart |
| **Security** | JWT authentication, protected routes, admin-only configuration panel |
| **Design** | BEM-structured CSS with design tokens, dark theme, Inter + JetBrains Mono fonts |
| **Dev Experience** | Single `npm run dev` starts both servers, Vite proxy, `.env` config for all parameters |
| **Production** | Health check endpoint, SQLite event persistence, Render deployment config |

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                      BROWSER  (port 3000)                            │
│                                                                      │
│   Zustand Store ◄── useWebSocket hook ◄── WebSocket (port 5000)      │
│        │                                                             │
│        ▼                                                             │
│   useMetrics hook                                                    │
│        │                                                             │
│        ▼                                                             │
│   App.jsx                                                            │
│   ├── Sidebar               (nav, auth, connection status)           │
│   ├── MetricCard ×3         (CPU · Memory · RPS with health colors)  │
│   ├── ScalingPanel          (instances · last action · AI prediction)│
│   ├── ModelComparisonPanel  (3 models side-by-side + active badge)   │
│   ├── CPUChart + MemoryChart (Recharts with threshold lines)         │
│   └── PredictionChart       (Predicted vs Actual CPU overlay)        │
└──────────────────────────────┬───────────────────────────────────────┘
                               │ WebSocket push every 5s
                               ▼
┌──────────────────────────────────────────────────────────────────────┐
│              BACKEND  (Express + WebSocket on :5000)                 │
│                                                                      │
│  REST API                        WebSocket Server                    │
│  ├── POST /api/auth/login        └── Broadcasts:                     │
│  ├── GET  /api/auth/verify            METRICS_UPDATE                 │
│  ├── GET  /api/metrics/current        SCALING_DECISION               │
│  ├── GET  /api/metrics/history        PREDICTION_HISTORY             │
│  ├── POST /api/scaling                                               │
│  ├── GET  /api/admin/config                                          │
│  ├── POST /api/admin/config                                          │
│  └── GET  /api/admin/stats                                           │
│                                                                      │
│  Autoscaler Loop (every 5s)                                          │
│  generateMetrics → cpuHistory → train all 3 models → pick best       │
│  → evaluateScaling → broadcast to all connected dashboards           │
└──────────────────────────────┬───────────────────────────────────────┘
                               │ require
                               ▼
┌──────────────────────────────────────────────────────────────────────┐
│                      AI ENGINE (ai/)                                 │
│                                                                      │
│  predictor.js            — Linear Regression (OLS), y = mx + b       │
│  exponentialSmoothing.js — Exponential Smoothing, alpha = 0.3        │
│  movingAverage.js        — Simple Moving Average, window = 5         │
│                                                                      │
│  Each model implements: train(data), predict(x), confidence(data)    │
│  Confidence = 1 − (MAE / 100), clamped to [0, 1]                     │
└──────────────────────────────────────────────────────────────────────┘
```

---

## The ML Engine

The autoscaler runs **three independent prediction models** on every tick. Each model implements the same interface — `train()`, `predict()`, `confidence()` — and the model with the highest confidence score is automatically selected to drive scaling decisions.

### Linear Regression (`ai/predictor.js`)

Ordinary Least Squares regression from scratch. Finds the best-fit line through time-indexed CPU data points.

```js
train(data)      // compute slope m and intercept b using OLS
predict(x)       // y = mx + b
confidence(data) // 1 − (MAE / 100)
```

### Exponential Smoothing (`ai/exponentialSmoothing.js`)

Applies exponential weighting with smoothing factor `alpha = 0.3`. Gives more weight to recent observations, making it responsive to trend changes.

### Moving Average (`ai/movingAverage.js`)

Computes a simple moving average over the last 5 data points. Provides a stable, noise-filtered prediction.

The engine requires at least **6 samples** before models start predicting. Until then, the current CPU value is used for scaling decisions.

---

## Project Structure

```
ai-predictive-autoscaling-engine/
│
├── ai/
│   ├── predictor.js               # Linear Regression (OLS)
│   ├── exponentialSmoothing.js     # Exponential Smoothing (alpha=0.3)
│   └── movingAverage.js           # Simple Moving Average (window=5)
│
├── backend/
│   ├── .env                       # All config (ports, thresholds, intervals)
│   ├── package.json
│   └── src/
│       ├── server.js              # HTTP + WebSocket on single port
│       ├── app.js                 # Express setup, CORS, routes
│       ├── autoscaler/
│       │   └── autoscaler.js      # Multi-model ML loop + WS broadcast
│       ├── config/
│       │   └── database.js        # SQLite (Sequelize) config
│       ├── models/
│       │   └── ScalingEvent.js    # Scaling event persistence model
│       ├── middleware/
│       │   └── auth.middleware.js  # JWT verification middleware
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   ├── admin.controller.js
│       │   ├── metrics.controller.js
│       │   └── scaling.controllers.js
│       ├── routes/
│       │   ├── auth.routes.js
│       │   ├── admin.routes.js
│       │   ├── metrics.routes.js
│       │   └── scaling.routes.js
│       └── services/
│           ├── admin.service.js    # Config management + event recording
│           ├── metrics.service.js  # systeminformation + RPS simulation
│           └── scaling.service.js  # Threshold / cooldown / instance logic
│
├── frontend/
│   ├── vite.config.js             # Dev server + /api proxy
│   └── src/
│       ├── App.jsx                # Routes + ProtectedRoute wrapper
│       ├── index.css              # Design system (BEM, tokens, utilities)
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── LiveDashboard.jsx
│       │   └── AdminDashboard.jsx
│       ├── components/
│       │   ├── Layout.jsx             # Sidebar + main content layout
│       │   ├── Sidebar.jsx            # Nav, auth controls, status badge
│       │   ├── ProtectedRoute.jsx     # Route guard checking auth state
│       │   ├── MetricCard.jsx         # Glass card + progress bar + health
│       │   ├── ScalingPanel.jsx       # Instances · action · AI prediction
│       │   ├── ModelComparisonPanel.jsx # 3-model side-by-side comparison
│       │   ├── PredictionChart.jsx    # Predicted vs Actual CPU chart
│       │   ├── CPUChart.jsx           # Line chart with threshold references
│       │   ├── MemoryChart.jsx        # Area chart with gradient fill
│       │   ├── AdminSection.jsx       # Admin panel container
│       │   └── admin/
│       │       ├── StatsBar.jsx       # Uptime, events, avg CPU, peak
│       │       ├── ManualScaling.jsx  # 1/5/10 + custom instance override
│       │       ├── ThresholdConfig.jsx # Scale up/down threshold sliders
│       │       ├── AlertsPanel.jsx    # Auto-generated system alerts
│       │       └── ScalingEventLog.jsx # Persistent event history table
│       ├── hooks/
│       │   ├── useWebSocket.js    # WS connection, message routing, reconnect
│       │   └── useMetrics.js      # Derived health status from store
│       └── store/
│           ├── useAutoscalerStore.js  # Zustand: metrics, predictions, events
│           └── useAuthStore.js        # Zustand: JWT token, login/logout
│
├── render.yaml                    # Render deployment config
└── package.json                   # Root: npm run dev starts both servers
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) v18 or later
- npm v9 or later

### Installation

```bash
# Clone the repo
git clone https://github.com/varnikarathi/ai-predictive-autoscaling-engine.git
cd ai-predictive-autoscaling-engine

# Install all dependencies (root + backend + frontend)
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
| API + WebSocket | http://localhost:5000 |

> The dashboard will initially show `DISCONNECTED` until the backend is up. It auto-reconnects every 3 seconds.

---

## Configuration

All backend parameters are controlled via `backend/.env`:

```env
# Server
PORT=5000

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

# Auth
JWT_SECRET=your_secret_key
ADMIN_USER=admin
ADMIN_PASS=admin
```

---

## REST API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/health` | No | Service health check |
| `POST` | `/api/auth/login` | No | Authenticate, returns JWT |
| `GET` | `/api/auth/verify` | Yes | Validate token |
| `GET` | `/api/metrics/current` | Yes | Latest CPU, memory, RPS |
| `GET` | `/api/metrics/history` | Yes | Historical metrics array |
| `POST` | `/api/scaling` | Yes | Manual scale: `{ action: "set", instances: 5 }` |
| `GET` | `/api/admin/config` | Yes | Current scaling thresholds |
| `POST` | `/api/admin/config` | Yes | Update thresholds at runtime |
| `GET` | `/api/admin/stats` | Yes | Uptime, events, avg CPU, peak |

### WebSocket Events

Connect to `ws://localhost:5000`. Messages are JSON with a `type` field:

```json
{ "type": "METRICS_UPDATE", "payload": {
    "cpu": 42, "memory": 67, "requestsPerSecond": 183,
    "predictedCPU": 48, "confidence": 87, "activeModel": "movingAverage",
    "models": {
      "linearRegression": { "predicted": 46, "confidence": 85 },
      "exponentialSmoothing": { "predicted": 47, "confidence": 86 },
      "movingAverage": { "predicted": 48, "confidence": 87 }
    }
}}

{ "type": "PREDICTION_HISTORY", "payload": { "actual": 42, "predicted": 48 }}

{ "type": "SCALING_DECISION", "payload": { "action": "NO_ACTION", "currentInstances": 1 }}
```

**Action values:** `SCALE_UP` · `SCALE_DOWN` · `NO_ACTION` · `COOLDOWN` · `MANUAL_SCALE`

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **ML Engine** | Vanilla JavaScript — Linear Regression (OLS), Exponential Smoothing, Moving Average |
| **Backend** | Node.js, Express 5, `ws` (WebSocket), `systeminformation`, `dotenv`, Sequelize + SQLite |
| **Frontend** | React 19, Vite 7, Zustand, Recharts |
| **Styling** | Vanilla CSS with BEM naming, design tokens, Inter + JetBrains Mono |
| **Auth** | JWT (jsonwebtoken) |
| **Dev Tooling** | Nodemon, concurrently |
| **Deployment** | Render (render.yaml) |

---

<div align="center">
  
**Built by Varnika Rathi**

*Bridging the gap between reactive and predictive infrastructure management*

</div>
