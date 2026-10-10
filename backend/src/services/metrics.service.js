const history = [];
let tick = 0;

async function generateMetrics() {
    // The public demo deliberately uses generated metrics, never host telemetry.
    tick += 1;
    const cpu = Math.max(18, Math.min(92, Math.round(52 + 22 * Math.sin(tick / 8) + (Math.random() * 8 - 4))));
    const memory = Math.max(24, Math.min(88, Math.round(48 + 13 * Math.sin(tick / 13 + 1) + (Math.random() * 6 - 3))));
    const requestsPerSecond = Math.floor(80 + 220 * (0.5 + 0.5 * Math.sin(tick / 6)) + Math.random() * 25);
    const metric = {
        cpu,
        memory,
        requestsPerSecond,
        timestamp: new Date(),
        simulated: true,
    };
    history.push(metric);
    if (history.length > 100) history.shift();
    return metric;

}
function getHistory() {
    return history;
}

function clearHistory() {
    history.length = 0;
}

module.exports = { generateMetrics, getHistory, clearHistory };
