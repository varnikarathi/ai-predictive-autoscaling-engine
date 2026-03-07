export default function ScalingPanel({ scalingDecision, predictedCPU, confidence, scalingEvents }) {
    const { action, currentInstances } = scalingDecision;

    const actionColor = {
        SCALE_UP: 'var(--accent-primary)',
        SCALE_DOWN: 'var(--accent-primary)',
        COOLDOWN: 'var(--accent-yellow)',
        NO_ACTION: 'var(--text-secondary)',
    }[action] || 'var(--text-secondary)';

    const actionIcon = {
        SCALE_UP: '↑',
        SCALE_DOWN: '↓',
        COOLDOWN: '⏸',
        NO_ACTION: '─',
    }[action] || '─';

    return (
        <div className="grid-2 mb-xl">
            {/* Scaling Engine Panel */}
            <div className="glass card">
                <p className="section-label mb-lg">Scaling Engine</p>
                <div className="flex-row gap-xl" style={{ alignItems: 'flex-start' }}>
                    <div>
                        <p className="scaling-panel-label">INSTANCES</p>
                        <div className="big-number">{currentInstances}</div>
                    </div>
                    <div style={{ flex: 1 }}>
                        <p className="scaling-panel-label">LAST ACTION</p>
                        <div className="action-badge" style={{
                            background: `${actionColor}15`,
                            border: `1px solid ${actionColor}40`,
                        }}>
                            <span className="action-badge-icon" style={{ color: actionColor }}>{actionIcon}</span>
                            <span className="action-badge-text" style={{ color: actionColor }}>{action}</span>
                        </div>
                    </div>
                </div>

                {scalingEvents.length > 0 && (
                    <div className="scaling-events-divider">
                        <p className="scaling-panel-label mb-md" style={{ letterSpacing: '0.06em' }}>RECENT EVENTS</p>
                        <div className="flex-col gap-sm" style={{ maxHeight: '100px', overflowY: 'auto' }}>
                            {[...scalingEvents].reverse().slice(0, 4).map((ev, i) => (
                                <div key={i} className="event-row">
                                    <span className="event-time">{ev.time}</span>
                                    <span className="event-action" style={{
                                        color: ev.action === 'SCALE_UP' || ev.action === 'SCALE_DOWN'
                                            ? 'var(--accent-primary)' : 'var(--text-secondary)'
                                    }}>
                                        {ev.action} → {ev.instances} inst.
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* AI Prediction Panel */}
            <div className="glass card">
                <p className="section-label mb-lg">AI Prediction</p>
                <div className="flex-row gap-xl" style={{ alignItems: 'flex-start' }}>
                    <div>
                        <p className="scaling-panel-label">PREDICTED CPU</p>
                        <div className="big-number">
                            {predictedCPU || '--'}
                            <span className="big-number-unit">%</span>
                        </div>
                    </div>
                    <div style={{ flex: 1 }}>
                        <p className="scaling-panel-label mb-md">CONFIDENCE</p>
                        <div className="confidence-value confidence--high mb-md">{confidence || 0}%</div>
                        <div className="progress-bar-container">
                            <div className="progress-bar-fill" style={{ width: `${confidence || 0}%` }} />
                        </div>
                    </div>
                </div>
                <p className="hint-text mt-xl">
                    Model: Linear Regression (OLS) · Window: 10 samples
                </p>
            </div>
        </div>
    );
}
