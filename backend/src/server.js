require('dotenv').config();

// ── Startup Guards ──────────────────────────────────────────────
const requiredEnvVars = ['JWT_SECRET', 'ADMIN_PASS_HASH'];
for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
        console.error(`[FATAL] Missing required environment variable: ${varName}`);
        console.error('Create a backend/.env file — see backend/.env.example for reference.');
        process.exit(1);
    }
}

const app = require("./app");
const { startAutoScaler } = require("./autoscaler/autoscaler.js");
const { WebSocketServer } = require("ws");
const sequelize = require("./config/database");

const http = require("http");

const PORT = process.env.PORT || 5000;

// Create a single HTTP server from the Express app
const server = http.createServer(app);

// Attach WebSocket Server to the same HTTP server
const wss = new WebSocketServer({ server });
wss.on("connection", (ws) => {
    console.log("[WS] Dashboard connected");
    ws.on("close", () => console.log("[WS] Dashboard disconnected"));
});

// Start listening on the single port
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} and ws://localhost:${PORT}`);
});

// Start autoscaler loop — passes wss so it can broadcast
startAutoScaler(wss);

// ── Graceful Shutdown ───────────────────────────────────────────
function gracefulShutdown(signal) {
    console.log(`[${signal}] Shutting down gracefully...`);
    wss.close(() => console.log('[WS] WebSocket server closed'));
    server.close(async () => {
        await sequelize.close();
        console.log('[DB] Database connection closed');
        process.exit(0);
    });
    // Force shutdown after 10s if graceful fails
    setTimeout(() => process.exit(1), 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
