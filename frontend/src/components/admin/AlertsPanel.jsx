import { useMetrics } from '../../hooks/useMetrics';

export default function AlertsPanel() {
    const { cpu, memory } = useMetrics();

    const autoAlerts = [];
    if (cpu > 80) autoAlerts.push({ type: 'CRITICAL', msg: `CPU at critical levels (${cpu}%)` });
    if (memory > 85) autoAlerts.push({ type: 'CRITICAL', msg: `Host memory constrained (${memory}%)` });
    if (cpu > 70 && cpu <= 80) autoAlerts.push({ type: 'WARNING', count: `CPU running high (${cpu}%)` });

    return (
        <div className="glass" style={{ padding: '24px', borderRadius: '16px', height: '100%' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>🚨 System Alerts</h3>

            {autoAlerts.length === 0 ? (
                <div style={{ color: 'var(--accent-green)', padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>
                    ✓ All systems nominal. No active alerts.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {autoAlerts.map((a, i) => (
                        <div key={i} style={{
                            padding: '12px',
                            borderRadius: '8px',
                            background: a.type === 'CRITICAL' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(251, 191, 36, 0.1)',
                            border: `1px solid ${a.type === 'CRITICAL' ? 'var(--accent-red)' : 'var(--accent-yellow)'}`,
                            color: a.type === 'CRITICAL' ? 'var(--accent-red)' : 'var(--accent-yellow)'
                        }}>
                            {a.msg || a.count}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
