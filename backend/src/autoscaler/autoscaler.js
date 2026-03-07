require('dotenv').config();
const { generateMetrics } = require("../services/metrics.service");
const LinearRegression = require("../../../ai/predictor");
const ExponentialSmoothing = require("../../../ai/exponentialSmoothing");
const MovingAverage = require("../../../ai/movingAverage");
const { evaluateScaling } = require("../services/scaling.service");

// Instantiate all three models
const models = {
    linearRegression: new LinearRegression(),
    exponentialSmoothing: new ExponentialSmoothing(0.3),
    movingAverage: new MovingAverage(5),
};

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

        // Default to current CPU when not enough data
        let bestPrediction = metrics.cpu;
        let bestConfidence = 0;
        let bestModel = 'linearRegression';

        // Per-model results
        const modelResults = {};

        if (cpuHistory.length >= MIN_TRAIN) {
            for (const [name, model] of Object.entries(models)) {
                model.train(cpuHistory);
                const predicted = name === 'linearRegression'
                    ? model.predict(cpuHistory.length + 1)
                    : model.predict(1);
                const conf = model.confidence(cpuHistory);

                modelResults[name] = {
                    predicted: Math.round(predicted),
                    confidence: Math.round(conf * 100),
                };

                if (conf > bestConfidence) {
                    bestConfidence = conf;
                    bestPrediction = predicted;
                    bestModel = name;
                }
            }
        } else {
            // Not enough data yet — report zeros
            for (const name of Object.keys(models)) {
                modelResults[name] = { predicted: 0, confidence: 0 };
            }
        }

        const scalingDecision = evaluateScaling(bestPrediction, bestConfidence);

        const logData = {
            currentCPU: metrics.cpu,
            predictedCPU: Math.round(bestPrediction),
            confidence: Math.round(bestConfidence * 100) + "%",
            activeModel: bestModel,
            action: scalingDecision.action,
            instances: scalingDecision.currentInstances,
        };

        console.log("==== AUTOSCALER ====", logData);

        // Broadcast metrics + multi-model predictions
        broadcast(wss, {
            type: "METRICS_UPDATE",
            payload: {
                ...metrics,
                predictedCPU: Math.round(bestPrediction),
                confidence: Math.round(bestConfidence * 100),
                activeModel: bestModel,
                models: modelResults,
            },
        });

        // Broadcast predicted-vs-actual data point
        broadcast(wss, {
            type: "PREDICTION_HISTORY",
            payload: {
                actual: metrics.cpu,
                predicted: Math.round(bestPrediction),
            },
        });

        broadcast(wss, { type: "SCALING_DECISION", payload: scalingDecision });

    }, POLL_INTERVAL);
}

module.exports = { startAutoScaler };
