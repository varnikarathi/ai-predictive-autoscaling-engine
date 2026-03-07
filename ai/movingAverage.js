class MovingAverage {
    constructor(window = 5) {
        this.window = window;
        this.data = [];
    }

    train(data) {
        this.data = data.slice();
    }

    predict(stepsAhead = 1) {
        if (this.data.length === 0) return 0;
        const w = Math.min(this.window, this.data.length);
        const recent = this.data.slice(-w);
        const avg = recent.reduce((s, v) => s + v, 0) / w;
        return Math.round(avg);
    }

    confidence(data) {
        if (data.length < this.window + 1) return 0;
        let error = 0;
        let count = 0;
        for (let i = this.window; i < data.length; i++) {
            const windowSlice = data.slice(i - this.window, i);
            const avg = windowSlice.reduce((s, v) => s + v, 0) / this.window;
            error += Math.abs(data[i] - avg);
            count++;
        }
        if (count === 0) return 0;
        const mae = error / count;
        return Math.max(0, 1 - mae / 100);
    }
}

module.exports = MovingAverage;
