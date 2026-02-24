require('dotenv').config();
const app = require("./app");
const { startAutoScaler } = require("./autoscaler/autoscaler.js");
const { WebSocketServer } = require("ws");

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
