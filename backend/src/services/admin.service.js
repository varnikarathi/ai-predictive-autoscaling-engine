const ScalingEvent = require('../models/ScalingEvent');

// Mutable config — can be patched at runtime via POST /api/admin/config
let config = {
    scaleUpThreshold: parseInt(process.env.SCALE_UP_THRESHOLD) || 70,
    scaleDownThreshold: parseInt(process.env.SCALE_DOWN_THRESHOLD) || 30,
    maxInstances: parseInt(process.env.MAX_INSTANCES) || 10,
    minInstances: parseInt(process.env.MIN_INSTANCES) || 1,
    cooldownMs: parseInt(process.env.COOLDOWN_MS) || 20000,
    confidenceThreshold: parseFloat(process.env.CONFIDENCE_THRESHOLD) || 0.6,
};

const startTime = Date.now();

// Pre-populate with a startup event directly into DB in background
ScalingEvent.create({
    action: "SYSTEM_STARTUP",
    instances: config.minInstances
}).catch(console.error);

function getConfig() { return { ...config }; }

function updateConfig(patch) {
    const next = { ...config, ...patch };
    const validPercent = (value) => Number.isFinite(value) && value >= 0 && value <= 100;
    const validInteger = (value, min = 1) => Number.isInteger(value) && value >= min;
    if (!validPercent(next.scaleUpThreshold) || !validPercent(next.scaleDownThreshold) ||
        next.scaleDownThreshold >= next.scaleUpThreshold ||
        !validInteger(next.minInstances) || !validInteger(next.maxInstances) ||
        next.minInstances > next.maxInstances || !validInteger(next.cooldownMs, 0) ||
        !Number.isFinite(next.confidenceThreshold) || next.confidenceThreshold < 0 || next.confidenceThreshold > 1) {
        const error = new Error('Configuration values are outside the allowed ranges');
        error.status = 400;
        throw error;
    }
    config = next;
    return { ...config };
}

function recordEvent(event) {
    // Fire and forget to the database
    ScalingEvent.create(event).catch(console.error);
}

async function getStats(metricsHistory) {
    const uptimeMs = Date.now() - startTime;

    // Aggregate from DB
    const totalEvents = await ScalingEvent.count({
        where: {
            action: { [require('sequelize').Op.notIn]: ['NO_ACTION', 'COOLDOWN'] }
        }
    });

    const maxEvt = await ScalingEvent.max('instances');
    const peakInstances = maxEvt || 1;

    const recentEvents = await ScalingEvent.findAll({
        order: [['ts', 'DESC']],
        limit: 50
    });

    const recent = metricsHistory.slice(-20);
    const avgCPU = recent.length ? Math.round(recent.reduce((s, m) => s + m.cpu, 0) / recent.length) : 0;

    return { uptimeMs, totalEvents, avgCPU, peakInstances, events: recentEvents.reverse() };
}

async function clearEvents() {
    await ScalingEvent.destroy({ where: {} });
    // optionally put a startup event back
    ScalingEvent.create({
        action: "SYSTEM_STARTUP",
        instances: config.minInstances,
        ts: new Date()
    }).catch(console.error);
}

module.exports = { getConfig, updateConfig, recordEvent, getStats, clearEvents };

