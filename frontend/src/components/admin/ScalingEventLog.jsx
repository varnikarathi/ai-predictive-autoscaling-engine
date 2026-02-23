export default function ScalingEventLog({ events }) {
    if (!events || events.length === 0) {
        return (
            <div className="glass" style={{ padding: '24px', borderRadius: '16px', marginTop: '24px' }}>
                <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>📜 Scaling Event Log</h3>
                <p style={{ color: 'var(--text-muted)' }}>No scaling events recorded yet.</p>
            </div>
        );
    }

    // filter out NO_ACTION for the admin log view to reduce noise
    const actionEvents = events.filter(e => e.action !== 'NO_ACTION').slice().reverse();

    return (
        <div className="glass" style={{ padding: '24px', borderRadius: '16px', marginTop: '24px', maxHeight: '400px', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px', position: 'sticky', top: '-24px', background: 'var(--glass-bg)', padding: '8px 0', zIndex: 2 }}>📜 Scaling Event Log</h3>

            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--glass-border)' }}>
                        <th style={{ padding: '12px 8px', fontWeight: 500 }}>Time</th>
                        <th style={{ padding: '12px 8px', fontWeight: 500 }}>Action</th>
                        <th style={{ padding: '12px 8px', fontWeight: 500 }}>Instances</th>
                        <th style={{ padding: '12px 8px', fontWeight: 500 }}>CPU %</th>
                    </tr>
                </thead>
                <tbody>
                    {actionEvents.map((evt, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                            <td style={{ padding: '12px 8px', fontFamily: 'var(--font-mono)' }}>
                                {new Date(evt.ts || Date.now()).toLocaleTimeString()}
                            </td>
                            <td style={{ padding: '12px 8px' }}>
                                <span style={{
                                    padding: '4px 8px',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    background: evt.action === 'SCALE_UP' ? 'var(--accent-red)' :
                                        evt.action === 'SCALE_DOWN' ? 'var(--accent-green)' :
                                            'var(--accent-yellow)',
                                    color: '#fff'
                                }}>
                                    {evt.action.replace('_', ' ')}
                                </span>
                            </td>
                            <td style={{ padding: '12px 8px', fontFamily: 'var(--font-mono)' }}>{evt.instances}</td>
                            <td style={{ padding: '12px 8px', fontFamily: 'var(--font-mono)' }}>{evt.cpu || '--'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
