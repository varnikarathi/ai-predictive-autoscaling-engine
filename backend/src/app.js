const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");

const scalingRoutes = require("./routes/scaling.routes");
const metricsRoutes = require("./routes/metrics.routes");
const adminRoutes = require("./routes/admin.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();
app.use(cors());
app.use(express.json());

// Sync Database
sequelize.sync().then(() => {
        console.log('SQLite Database synchronized');
}).catch(console.error);

app.get("/health", (req, res) => {
        res.json({ Status: "UP" });
});

const path = require("path");

app.use("/api/auth", authRoutes);
app.use("/api/scaling", scalingRoutes);
app.use("/api/metrics", metricsRoutes);
app.use("/api/admin", adminRoutes);

// In production, serve frontend static files
if (process.env.NODE_ENV === 'production') {
        const frontendDist = path.join(__dirname, '../../frontend/dist');
        app.use(express.static(frontendDist));

        app.get('*', (req, res) => {
                res.sendFile(path.join(frontendDist, 'index.html'));
        });
}

module.exports = app;



