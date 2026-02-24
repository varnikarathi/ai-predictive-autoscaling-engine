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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>

            {/* Scaling Engine Panel */}
            <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
                <p style={{ fontSize: '12px', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Scaling Engine
                </p>
                <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                    <div>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>INSTANCES</p>
                        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '56px', fontWeight: 300, color: 'var(--accent-primary)', lineHeight: 1 }}>
                            {currentInstances}
                        </div>
                    </div>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>LAST ACTION</p>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            background: `${actionColor}15`, border: `1px solid ${actionColor}40`,
                            borderRadius: '8px', padding: '6px 12px',
                        }}>
                            <span style={{ color: actionColor, fontSize: '16px' }}>{actionIcon}</span>
                            <span style={{ color: actionColor, fontSize: '13px', fontWeight: 600, letterSpacing: '0.04em' }}>{action}</span>
                        </div>
                    </div>
                </div>

                {/* Recent events */}
                {scalingEvents.length > 0 && (
                    <div style={{ marginTop: '24px', borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px', letterSpacing: '0.06em' }}>RECENT EVENTS</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '100px', overflowY: 'auto' }}>
                            {[...scalingEvents].reverse().slice(0, 4).map((ev, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>{ev.time}</span>
                                    <span style={{ color: ev.action === 'SCALE_UP' || ev.action === 'SCALE_DOWN' ? 'var(--accent-primary)' : 'var(--text-secondary)', fontWeight: 600 }}>
                                        {ev.action} → {ev.instances} inst.
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* AI Prediction Panel */}
            <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
                <p style={{ fontSize: '12px', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    AI Prediction
                </p>
                <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                    <div>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>PREDICTED CPU</p>
                        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '56px', fontWeight: 300, color: 'var(--accent-primary)', lineHeight: 1 }}>
                            {predictedCPU || '--'}
                            <span style={{ fontSize: '24px', fontWeight: 400, color: 'var(--text-secondary)', marginLeft: '4px' }}>%</span>
                        </div>
                    </div>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>CONFIDENCE</p>
                        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '28px', fontWeight: 600, color: 'var(--accent-green)', marginBottom: '12px', lineHeight: 1 }}>
                            {confidence || 0}%
                        </div>
                        <div className="progress-bar-container">
                            <div className="progress-bar-fill" style={{ width: `${confidence || 0}%`, backgroundColor: 'var(--accent-primary)' }} />
                        </div>
                    </div>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '24px' }}>
                    Model: Linear Regression (OLS) · Window: 10 samples
                </p>
            </div>
        </div>
    );
}
