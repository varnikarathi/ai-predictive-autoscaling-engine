const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const sequelize = require("./config/database");

const scalingRoutes = require("./routes/scaling.routes");
const metricsRoutes = require("./routes/metrics.routes");
const adminRoutes = require("./routes/admin.routes");
const authRoutes = require("./routes/auth.routes");
const { getAllowedOrigins } = require('./config/security');

const app = express();

// CORS — allow all origins for public demo
app.use(cors());

app.use(express.json({ limit: '10kb' }));
app.set('trust proxy', 1);

// Sync Database
if (typeof sequelize.sync === 'function') {
        sequelize.sync().then(() => {
                console.log('SQLite Database synchronized');
        }).catch(err => console.warn('[WARN] DB sync notice:', err.message));
}

app.get("/health", async (req, res) => {
        try {
                if (typeof sequelize.authenticate === 'function') {
                        await sequelize.authenticate();
                }
                res.json({ status: "UP", db: sequelize.isFallback ? "in-memory" : "connected" });
        } catch {
                res.json({ status: "UP", db: "fallback" });
        }
});

const path = require("path");
const fs = require("fs");

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
        if (fs.existsSync(frontendDist)) {
                app.use(express.static(frontendDist));

                app.get('/*splat', (req, res) => {
                        res.sendFile(path.join(frontendDist, 'index.html'));
                });
        }
}

// Global error handler — prevents stack traces from leaking to clients
app.use((err, req, res, next) => {
        if (res.headersSent) return next(err);
        const status = err.status === 403 ? 403 : (err.status || 500);
        if (status >= 500) console.error('[ERROR] Request failed');
        res.status(status).json({ error: status === 403 ? 'Origin not allowed' : 'Request failed' });
});

module.exports = app;



