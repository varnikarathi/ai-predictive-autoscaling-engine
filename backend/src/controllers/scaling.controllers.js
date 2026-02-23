const { evaluateScaling, setInstances } = require("../services/scaling.service");

function scaleSystem(req, res) {
    const { action, instances, cpu } = req.body;

    if (action === "set" && instances !== undefined) {
        return res.json(setInstances(instances));
    }

    if (cpu === undefined) {
        return res.status(400).json({ error: "CPU usage is required" });
    }

    const decision = evaluateScaling(cpu);
    res.json(decision);
}

module.exports = { scaleSystem };
