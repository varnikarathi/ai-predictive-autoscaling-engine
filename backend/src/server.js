require('dotenv').config();

// ── Startup Guards ──────────────────────────────────────────────
try {
    require('./config/security').validateSecurityEnvironment();
} catch (error) {
    console.error(`[FATAL] ${error.message}`);
    process.exit(1);
}

const app = require("./app");
const { startAutoScaler } = require("./autoscaler/autoscaler.js");
const { WebSocketServer } = require("ws");
const { getAllowedOrigins } = require('./config/security');
const sequelize = require("./config/database");

const http = require("http");

const PORT = process.env.PORT || 5000;

// Create a single HTTP server from the Express app
const server = http.createServer(app);

// Attach WebSocket Server to the same HTTP server
const allowedOrigins = getAllowedOrigins();
const wss = new WebSocketServer({
    server,
    verifyClient: ({ origin }, callback) => {
        if (!origin || allowedOrigins.has(origin)) return callback(true);
        return callback(false, 403, 'Forbidden');
    },
});
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
