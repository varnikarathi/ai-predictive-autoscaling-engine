const express = require("express");
const router = express.Router();
const { getCurrentMetrics, getMetricsHistory } = require("../controllers/metrics.controller");

// Public, read-only endpoints expose simulated demo telemetry only.
router.get("/current", getCurrentMetrics);
router.get("/history", getMetricsHistory);

module.exports = router;
