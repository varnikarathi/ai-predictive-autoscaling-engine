export default function ScalingPanel({ scalingDecision, predictedCPU, confidence, scalingEvents }) {
    const { action, currentInstances } = scalingDecision;

    const actionColor = {
        SCALE_UP: 'var(--color-accent-blue)',
        SCALE_DOWN: 'var(--color-accent-cyan)',
        COOLDOWN: 'var(--color-accent-yellow)',
        NO_ACTION: 'var(--color-text-secondary)',
    }[action] || 'var(--color-text-secondary)';

    const actionIcon = {
        SCALE_UP: '↑',
        SCALE_DOWN: '↓',
        COOLDOWN: '⏸',
        NO_ACTION: '─',
    }[action] || '─';

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>

            {/* Scaling Engine Panel */}
            <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
                <p style={{ fontSize: '12px', letterSpacing: '0.08em', color: 'var(--color-text-secondary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '16px' }}>
                    🔧 Scaling Engine
                </p>
                <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                    <div>
                        <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>INSTANCES</p>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '42px', fontWeight: 700, color: 'var(--color-accent-blue)', lineHeight: 1 }}>
                            {currentInstances}
                        </div>
                    </div>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>LAST ACTION</p>
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
                    <div style={{ marginTop: '16px', borderTop: '1px solid var(--color-border)', paddingTop: '12px' }}>
                        <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '8px', letterSpacing: '0.06em' }}>RECENT EVENTS</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '80px', overflowY: 'auto' }}>
                            {[...scalingEvents].reverse().slice(0, 4).map((ev, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                                    <span style={{ color: 'var(--color-text-muted)' }}>{ev.time}</span>
                                    <span style={{ color: ev.action === 'SCALE_UP' ? 'var(--color-accent-blue)' : 'var(--color-accent-cyan)', fontWeight: 600 }}>
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
                <p style={{ fontSize: '12px', letterSpacing: '0.08em', color: 'var(--color-text-secondary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '16px' }}>
                    🤖 AI Prediction
                </p>
                <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                    <div>
                        <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>PREDICTED CPU</p>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '42px', fontWeight: 700, color: 'var(--color-accent-cyan)', lineHeight: 1 }}>
                            {predictedCPU || '--'}
                            <span style={{ fontSize: '18px', fontWeight: 400, color: 'var(--color-text-secondary)', marginLeft: '4px' }}>%</span>
                        </div>
                    </div>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>CONFIDENCE</p>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', fontWeight: 700, color: 'var(--color-accent-green)', marginBottom: '8px' }}>
                            {confidence || 0}%
                        </div>
                        <div style={{ background: 'var(--color-bg-tertiary)', borderRadius: '999px', height: '5px' }}>
                            <div style={{
                                width: `${confidence || 0}%`, height: '100%',
                                background: 'linear-gradient(90deg, var(--color-accent-blue), var(--color-accent-cyan))',
                                borderRadius: '999px', transition: 'width 0.5s ease',
                                boxShadow: '0 0 8px rgba(59,130,246,0.4)',
                            }} />
                        </div>
                    </div>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '16px' }}>
                    Model: Linear Regression (OLS) · Window: 10 samples
                </p>
            </div>
        </div>
    );
}
