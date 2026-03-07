const MODEL_LABELS = {
    linearRegression: 'Linear Regression',
    exponentialSmoothing: 'Exponential Smoothing',
    movingAverage: 'Moving Average',
};

const MODEL_ICONS = {
    linearRegression: 'LR',
    exponentialSmoothing: 'ES',
    movingAverage: 'MA',
};

export default function ModelComparisonPanel({ modelPredictions, activeModel }) {
    return (
        <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
            <p style={{
                fontSize: '12px', letterSpacing: '0.05em', color: 'var(--text-secondary)',
                fontWeight: 600, textTransform: 'uppercase', marginBottom: '20px',
                display: 'flex', alignItems: 'center', gap: '6px'
            }}>
                Model Comparison
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {Object.entries(modelPredictions).map(([key, data]) => {
                    const isActive = key === activeModel;
                    return (
                        <div key={key} style={{
                            background: isActive ? 'rgba(94, 180, 212, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                            border: `1px solid ${isActive ? 'var(--accent-primary)' : 'var(--glass-border)'}`,
                            borderRadius: '12px',
                            padding: '16px',
                            transition: 'all 0.3s ease',
                            position: 'relative',
                        }}>
                            {isActive && (
                                <div style={{
                                    position: 'absolute', top: '8px', right: '10px',
                                    fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em',
                                    color: 'var(--accent-primary)', textTransform: 'uppercase',
                                    background: 'rgba(94, 180, 212, 0.15)',
                                    padding: '2px 8px', borderRadius: '4px',
                                }}>
                                    Active
                                </div>
                            )}

                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                                <span style={{ fontSize: '16px' }}>{MODEL_ICONS[key]}</span>
                                <span style={{
                                    fontSize: '11px', fontWeight: 600,
                                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                                    letterSpacing: '0.03em',
                                }}>
                                    {MODEL_LABELS[key]}
                                </span>
                            </div>

                            <div style={{ marginBottom: '12px' }}>
                                <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px' }}>PREDICTED CPU</p>
                                <div style={{
                                    fontFamily: 'var(--font-sans)', fontSize: '32px', fontWeight: 300,
                                    color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                    lineHeight: 1,
                                }}>
                                    {data.predicted || '--'}
                                    <span style={{ fontSize: '16px', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '2px' }}>%</span>
                                </div>
                            </div>

                            <div>
                                <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>CONFIDENCE</p>
                                <div style={{
                                    fontSize: '18px', fontWeight: 600,
                                    color: data.confidence >= 70 ? 'var(--accent-green)' : data.confidence >= 40 ? 'var(--accent-yellow)' : 'var(--accent-red)',
                                    marginBottom: '8px',
                                }}>
                                    {data.confidence || 0}%
                                </div>
                                <div className="progress-bar-container" style={{ height: '4px' }}>
                                    <div className="progress-bar-fill" style={{
                                        width: `${data.confidence || 0}%`,
                                        backgroundColor: data.confidence >= 70 ? 'var(--accent-green)' : data.confidence >= 40 ? 'var(--accent-yellow)' : 'var(--accent-red)',
                                    }} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '16px' }}>
                The model with the highest confidence score is automatically selected to drive scaling decisions.
            </p>
        </div>
    );
}
