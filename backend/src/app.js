const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const sequelize = require("./config/database");

const scalingRoutes = require("./routes/scaling.routes");
const metricsRoutes = require("./routes/metrics.routes");
const adminRoutes = require("./routes/admin.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

// CORS — restrict to allowed origins
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',');
app.use(cors({
        origin: function (origin, callback) {
                // Allow requests with no origin (e.g., server-to-server, curl)
                if (!origin || allowedOrigins.includes(origin)) {
                        callback(null, true);
                } else {
                        callback(new Error('Not allowed by CORS'));
                }
        },
        credentials: true,
}));

app.use(express.json());

// Sync Database
sequelize.sync().then(() => {
        console.log('SQLite Database synchronized');
}).catch(console.error);

app.get("/health", async (req, res) => {
        try {
                await sequelize.authenticate();
                res.json({ status: "UP", db: "connected" });
        } catch {
                res.status(503).json({ status: "DOWN", db: "disconnected" });
        }
});

const path = require("path");

// Rate limiting on auth routes — 10 requests per 15 minutes
const authLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 10,
        message: { error: 'Too many login attempts. Please try again later.' },
        standardHeaders: true,
        legacyHeaders: false,
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/scaling", scalingRoutes);
app.use("/api/metrics", metricsRoutes);
app.use("/api/admin", adminRoutes);

// In production, serve frontend static files
if (process.env.NODE_ENV === 'production') {
        const frontendDist = path.join(__dirname, '../../frontend/dist');
        app.use(express.static(frontendDist));

        app.get('/*splat', (req, res) => {
                res.sendFile(path.join(frontendDist, 'index.html'));
        });
}

// Global error handler — prevents stack traces from leaking to clients
app.use((err, req, res, next) => {
        console.error('[ERROR]', err.message);
        res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

module.exports = app;



