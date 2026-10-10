const { evaluateScaling, setInstances } = require("../services/scaling.service");

function scaleSystem(req, res) {
    const { action, instances, cpu } = req.body || {};

    if (action === "set" && instances !== undefined) {
        if (!Number.isInteger(instances) || instances < 1) {
            return res.status(400).json({ error: "Instances must be a positive integer" });
        }
        return res.json(setInstances(instances));
    }

    if (typeof cpu !== 'number' || !Number.isFinite(cpu) || cpu < 0 || cpu > 100) {
        return res.status(400).json({ error: "CPU usage must be a number between 0 and 100" });
    }

    const decision = evaluateScaling(cpu, 1);
    res.json(decision);
}

module.exports = { scaleSystem };
