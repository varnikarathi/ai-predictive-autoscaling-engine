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
const scalingEvents = []; // shared log

// Pre-populate with a startup event so logs aren't totally empty initially
scalingEvents.push({
    action: "SYSTEM_STARTUP",
    instances: config.minInstances,
    ts: new Date().toISOString()
});

function getConfig() { return { ...config }; }

function updateConfig(patch) {
    config = { ...config, ...patch };
    return { ...config };
}

function recordEvent(event) {
    scalingEvents.push({ ...event, ts: new Date().toISOString() });
    if (scalingEvents.length > 200) scalingEvents.shift();
}

function getStats(metricsHistory) {
    const uptimeMs = Date.now() - startTime;
    const totalEvents = scalingEvents.filter(e => e.action !== 'NO_ACTION' && e.action !== 'COOLDOWN').length;
    const recent = metricsHistory.slice(-20);
    const avgCPU = recent.length ? Math.round(recent.reduce((s, m) => s + m.cpu, 0) / recent.length) : 0;
    const peakInstances = scalingEvents.reduce((max, e) => Math.max(max, e.instances || 1), 1);
    return { uptimeMs, totalEvents, avgCPU, peakInstances, events: scalingEvents.slice(-50) };
}

module.exports = { getConfig, updateConfig, recordEvent, getStats };
