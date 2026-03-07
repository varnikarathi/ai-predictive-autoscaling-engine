class ExponentialSmoothing {
    constructor(alpha = 0.3) {
        this.alpha = alpha;
        this.smoothed = [];
    }

    train(data) {
        if (data.length === 0) return;
        this.smoothed = [data[0]];
        for (let i = 1; i < data.length; i++) {
            const prev = this.smoothed[i - 1];
            this.smoothed.push(this.alpha * data[i] + (1 - this.alpha) * prev);
        }
    }

    predict(stepsAhead = 1) {
        if (this.smoothed.length === 0) return 0;
        // Exponential smoothing forecast is the last smoothed value
        return Math.round(this.smoothed[this.smoothed.length - 1]);
    }

    confidence(data) {
        if (data.length < 2) return 0;
        let error = 0;
        // One-step-ahead in-sample errors
        let s = data[0];
        for (let i = 1; i < data.length; i++) {
            const forecast = s;
            error += Math.abs(data[i] - forecast);
            s = this.alpha * data[i] + (1 - this.alpha) * s;
        }
        const mae = error / (data.length - 1);
        return Math.max(0, 1 - mae / 100);
    }
}

module.exports = ExponentialSmoothing;
