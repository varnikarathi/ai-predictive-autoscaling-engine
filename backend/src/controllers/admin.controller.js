const adminService = require('../services/admin.service');
const { getHistory } = require('../services/metrics.service');

function getConfig(req, res) {
    res.json(adminService.getConfig());
}

function updateConfig(req, res) {
    const patch = {};
    const allowed = ['scaleUpThreshold', 'scaleDownThreshold', 'maxInstances', 'minInstances', 'cooldownMs', 'confidenceThreshold'];
    allowed.forEach(key => {
        if (req.body[key] !== undefined) patch[key] = Number(req.body[key]);
    });
    if (Object.keys(patch).length === 0) {
        return res.status(400).json({ error: 'No valid config keys provided' });
    }
    res.json(adminService.updateConfig(patch));
}

async function getStats(req, res) {
    try {
        const history = getHistory();
        const stats = await adminService.getStats(history);
        res.json(stats);
    } catch (err) {
        console.error("Failed to get stats:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = { getConfig, updateConfig, getStats };

