const express = require("express");
const router = express.Router();
const { getCurrentMetrics, getMetricsHistory } = require("../controllers/metrics.controller");

router.get("/current", getCurrentMetrics);
router.get("/history", getMetricsHistory);

module.exports = router;
