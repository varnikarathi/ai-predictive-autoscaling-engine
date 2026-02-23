require('dotenv').config();
const { generateMetrics } = require("../services/metrics.service");
const LinearRegression = require("../../../ai/predictor");
const { evaluateScaling } = require("../services/scaling.service");

const model = new LinearRegression();
const cpuHistory = [];

const POLL_INTERVAL = parseInt(process.env.POLL_INTERVAL_MS) || 5000;
const CPU_WINDOW = parseInt(process.env.CPU_HISTORY_WINDOW) || 10;
const MIN_TRAIN = parseInt(process.env.MIN_TRAIN_SAMPLES) || 6;

function broadcast(wss, data) {
    if (!wss) return;
    const msg = JSON.stringify(data);
    wss.clients.forEach((client) => {
        if (client.readyState === 1) client.send(msg);
    });
}

function startAutoScaler(wss) {
    setInterval(async () => {
        const metrics = await generateMetrics();
        cpuHistory.push(metrics.cpu);
        if (cpuHistory.length > CPU_WINDOW) cpuHistory.shift();

        let predictedCPU = metrics.cpu;
        let confidence = 0;

        if (cpuHistory.length >= MIN_TRAIN) {
            model.train(cpuHistory);
            predictedCPU = model.predict(cpuHistory.length + 1);
            confidence = model.confidence(cpuHistory);
        }

        const scalingDecision = evaluateScaling(predictedCPU, confidence);

        const logData = {
            currentCPU: metrics.cpu,
            predictedCPU: Math.round(predictedCPU),
            confidence: Math.round(confidence * 100) + "%",
            action: scalingDecision.action,
            instances: scalingDecision.currentInstances,
        };

        console.log("==== AUTOSCALER ====", logData);

        // Broadcast to all connected dashboard clients
        broadcast(wss, { type: "METRICS_UPDATE", payload: { ...metrics, predictedCPU: Math.round(predictedCPU), confidence: Math.round(confidence * 100) } });
        broadcast(wss, { type: "SCALING_DECISION", payload: scalingDecision });

    }, POLL_INTERVAL);
}

module.exports = { startAutoScaler };
