const { generateMetrics, getHistory } = require("../services/metrics.service");

async function getCurrentMetrics(req, res) {
    const metrics = await generateMetrics();
    res.json(metrics);
}

function getMetricsHistory(req, res) {
    const limit = parseInt(req.query.limit) || 60;
    res.json(getHistory().slice(-limit));
}

module.exports = { getCurrentMetrics, getMetricsHistory };