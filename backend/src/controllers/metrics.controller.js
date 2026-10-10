const { generateMetrics, getHistory } = require("../services/metrics.service");

async function getCurrentMetrics(req, res) {
    const metrics = await generateMetrics();
    res.json(metrics);
}

function getMetricsHistory(req, res) {
    const requestedLimit = req.query.limit === undefined ? 60 : Number(req.query.limit);
    const limit = Number.isInteger(requestedLimit) ? Math.max(1, Math.min(requestedLimit, 100)) : 60;
    res.json(getHistory().slice(-limit));
}

module.exports = { getCurrentMetrics, getMetricsHistory };
