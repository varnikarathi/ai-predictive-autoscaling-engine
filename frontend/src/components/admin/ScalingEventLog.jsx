export default function ScalingEventLog({ events }) {
    if (!events || events.length === 0) {
        return (
            <div className="glass" style={{ padding: '24px', borderRadius: '16px', marginTop: '24px' }}>
                <h3 style={{ fontSize: '18px', marginBottom: '16px', fontWeight: 600 }}>Scaling Event Log</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No scaling events recorded yet.</p>
            </div>
        );
    }

    // filter out NO_ACTION for the admin log view to reduce noise
    const actionEvents = events.filter(e => e.action !== 'NO_ACTION').slice().reverse();

    return (
        <div className="glass" style={{ padding: '24px', borderRadius: '16px', marginTop: '24px', maxHeight: '400px', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px', position: 'sticky', top: '-24px', background: 'var(--glass-bg)', padding: '8px 0', zIndex: 2, fontWeight: 600 }}>Scaling Event Log</h3>

            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                    <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--glass-border)' }}>
                        <th style={{ padding: '12px 8px', fontWeight: 600, fontSize: '12px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Time</th>
                        <th style={{ padding: '12px 8px', fontWeight: 600, fontSize: '12px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Action</th>
                        <th style={{ padding: '12px 8px', fontWeight: 600, fontSize: '12px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Instances</th>
                        <th style={{ padding: '12px 8px', fontWeight: 600, fontSize: '12px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>CPU %</th>
                    </tr>
                </thead>
                <tbody>
                    {actionEvents.map((evt, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                            <td style={{ padding: '16px 8px', color: 'var(--text-secondary)' }}>
                                {new Date(evt.ts || Date.now()).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </td>
                            <td style={{ padding: '16px 8px' }}>
                                <span style={{
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    letterSpacing: '0.05em',
                                    background: evt.action === 'SCALE_UP' || evt.action === 'SCALE_DOWN' ? 'rgba(94, 180, 212, 0.15)' : 'rgba(251, 191, 36, 0.15)',
                                    color: evt.action === 'SCALE_UP' || evt.action === 'SCALE_DOWN' ? 'var(--accent-primary)' : 'var(--accent-yellow)',
                                    border: `1px solid ${evt.action === 'SCALE_UP' || evt.action === 'SCALE_DOWN' ? 'rgba(94, 180, 212, 0.3)' : 'rgba(251, 191, 36, 0.3)'}`
                                }}>
                                    {evt.action.replace('_', ' ')}
                                </span>
                            </td>
                            <td style={{ padding: '16px 8px', fontWeight: 500, color: 'var(--text-primary)' }}>{evt.instances}</td>
                            <td style={{ padding: '16px 8px', fontWeight: 500, color: 'var(--text-primary)' }}>{evt.cpu || '--'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
