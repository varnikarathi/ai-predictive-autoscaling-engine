const MODEL_LABELS = {
    linearRegression: 'Linear Regression',
    exponentialSmoothing: 'Exponential Smoothing',
    movingAverage: 'Moving Average',
};

const MODEL_ABBREVS = {
    linearRegression: 'LR',
    exponentialSmoothing: 'ES',
    movingAverage: 'MA',
};

function getConfidenceClass(confidence) {
    if (confidence >= 70) return 'confidence--high';
    if (confidence >= 40) return 'confidence--mid';
    return 'confidence--low';
}

export default function ModelComparisonPanel({ modelPredictions, activeModel }) {
    return (
        <div className="glass card">
            <p className="section-label mb-lg">Model Comparison</p>

            <div className="grid-3">
                {Object.entries(modelPredictions).map(([key, data]) => {
                    const isActive = key === activeModel;
                    const confClass = getConfidenceClass(data.confidence);
                    return (
                        <div key={key} className={`model-card ${isActive ? 'model-card--active' : 'model-card--inactive'}`}>
                            {isActive && <div className="model-active-badge">Active</div>}

                            <div className="flex-row gap-sm mb-md">
                                <span className="model-icon">{MODEL_ABBREVS[key]}</span>
                                <span className="model-name" style={{
                                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)'
                                }}>
                                    {MODEL_LABELS[key]}
                                </span>
                            </div>

                            <div className="mb-md">
                                <p className="scaling-panel-label">PREDICTED CPU</p>
                                <div className="model-number" style={{
                                    color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)'
                                }}>
                                    {data.predicted || '--'}
                                    <span className="model-number-unit">%</span>
                                </div>
                            </div>

                            <div>
                                <p className="scaling-panel-label mb-sm">CONFIDENCE</p>
                                <div className={`confidence-value ${confClass} mb-sm`}>
                                    {data.confidence || 0}%
                                </div>
                                <div className="progress-bar-container progress-bar-container--sm">
                                    <div className="progress-bar-fill" style={{
                                        width: `${data.confidence || 0}%`,
                                        backgroundColor: data.confidence >= 70 ? 'var(--accent-green)'
                                            : data.confidence >= 40 ? 'var(--accent-yellow)' : 'var(--accent-red)',
                                    }} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <p className="hint-text" style={{ marginTop: '16px' }}>
                The model with the highest confidence score is automatically selected to drive scaling decisions.
            </p>
        </div>
    );
}
