import { useMetrics } from '../../hooks/useMetrics';

export default function AlertsPanel() {
    const { cpu, memory } = useMetrics();

    const autoAlerts = [];
    if (cpu > 80) autoAlerts.push({ type: 'CRITICAL', msg: `CPU at critical levels (${cpu}%)` });
    if (memory > 85) autoAlerts.push({ type: 'CRITICAL', msg: `Host memory constrained (${memory}%)` });
    if (cpu > 70 && cpu <= 80) autoAlerts.push({ type: 'WARNING', count: `CPU running high (${cpu}%)` });

    return (
        <div className="glass" style={{ padding: '24px', borderRadius: '16px', height: '100%' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px', fontWeight: 600 }}>System Alerts</h3>

            {autoAlerts.length === 0 ? (
                <div style={{ color: 'var(--text-secondary)', padding: '16px', background: 'var(--color-bg-base)', borderRadius: '12px', border: '1px solid var(--glass-border)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--accent-green)' }}>✓</span> All systems nominal. No active alerts.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {autoAlerts.map((a, i) => (
                        <div key={i} style={{
                            padding: '16px',
                            borderRadius: '12px',
                            background: a.type === 'CRITICAL' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(251, 191, 36, 0.1)',
                            border: `1px solid ${a.type === 'CRITICAL' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(251, 191, 36, 0.3)'}`,
                            color: a.type === 'CRITICAL' ? 'var(--accent-red)' : 'var(--accent-yellow)',
                            fontSize: '14px',
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <span style={{ fontWeight: 'bold' }}>{a.type === 'CRITICAL' ? '!' : '·'}</span>
                            {a.msg || a.count}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
