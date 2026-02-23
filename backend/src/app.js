const express = require("express");
const cors = require("cors");
const scalingRoutes = require("./routes/scaling.routes");
const metricsRoutes = require("./routes/metrics.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
        res.json({ Status: "UP" });
});

app.use("/api/scaling", scalingRoutes);
app.use("/api/metrics", metricsRoutes);
app.use("/api/admin", adminRoutes);

module.exports = app;


