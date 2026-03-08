const express = require("express");
const router = express.Router();
const { getCurrentMetrics, getMetricsHistory } = require("../controllers/metrics.controller");
const requireAuth = require("../middleware/auth.middleware");

router.get("/current", requireAuth, getCurrentMetrics);
router.get("/history", requireAuth, getMetricsHistory);

module.exports = router;
