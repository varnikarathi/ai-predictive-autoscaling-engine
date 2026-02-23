require('dotenv').config();
const app = require("./app");
const { startAutoScaler } = require("./autoscaler/autoscaler.js");
const { WebSocketServer } = require("ws");

const PORT = process.env.PORT || 5000;
const WS_PORT = process.env.WS_PORT || 5001;

// HTTP Server
app.listen(PORT, () => {
    console.log(`HTTP server running on http://localhost:${PORT}`);
});

// WebSocket Server
const wss = new WebSocketServer({ port: WS_PORT });
wss.on("connection", (ws) => {
    console.log("[WS] Dashboard connected");
    ws.on("close", () => console.log("[WS] Dashboard disconnected"));
});
console.log(`WebSocket server running on ws://localhost:${WS_PORT}`);

// Start autoscaler loop — passes wss so it can broadcast
startAutoScaler(wss);
