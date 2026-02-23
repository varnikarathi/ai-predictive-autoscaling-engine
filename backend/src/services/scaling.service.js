const adminService = require('./admin.service');

let currentInstances = 1;
let lastScale = 0;

function evaluateScaling(cpuUsage, confidence) {
    const config = adminService.getConfig();
    const now = Date.now();

    if (now - lastScale < config.cooldownMs) {
        return { action: "COOLDOWN", currentInstances };
    }

    let action = "NO_ACTION";

    if (cpuUsage > config.scaleUpThreshold && currentInstances < config.maxInstances && confidence > config.confidenceThreshold) {
        currentInstances++;
        action = "SCALE_UP";
        lastScale = now;
    } else if (cpuUsage < config.scaleDownThreshold && currentInstances > config.minInstances && confidence > config.confidenceThreshold) {
        currentInstances--;
        action = "SCALE_DOWN";
        lastScale = now;
    }

    if (action !== "NO_ACTION" && action !== "COOLDOWN") {
        adminService.recordEvent({ action, instances: currentInstances, cpu: cpuUsage, confidence });
    }

    return { action, currentInstances };
}

// For manual scaling overrides from dashboard
function setInstances(count) {
    const config = adminService.getConfig();
    currentInstances = Math.max(config.minInstances, Math.min(count, config.maxInstances));
    lastScale = Date.now(); // MUST set this so evaluateScaling hits the COOLDOWN block and preserves this state!
    adminService.recordEvent({ action: "MANUAL_SCALE", instances: currentInstances, cpu: null, confidence: 1 });
    return { action: "MANUAL_SCALE", currentInstances };
}


module.exports = { evaluateScaling, setInstances };
