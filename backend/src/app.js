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

// CORS — restrict to allowed origins
const allowedOrigins = getAllowedOrigins();
app.use(cors({
        origin: function (origin, callback) {
                // Allow requests with no origin (e.g., server-to-server, curl)
                if (!origin || allowedOrigins.has(origin)) {
                        callback(null, true);
                } else {
                        const error = new Error('Origin not allowed');
                        error.status = 403;
                        callback(error);
                }
        },
        credentials: false,
        methods: ['GET', 'POST', 'OPTIONS'],
        maxAge: 600,
}));

app.use(express.json({ limit: '10kb' }));
app.set('trust proxy', 1);

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
        if (res.headersSent) return next(err);
        const status = err.status === 403 ? 403 : (err.status || 500);
        if (status >= 500) console.error('[ERROR] Request failed');
        res.status(status).json({ error: status === 403 ? 'Origin not allowed' : 'Request failed' });
});

module.exports = app;



