import { useMetrics } from '../../hooks/useMetrics';

export default function AlertsPanel() {
    const { cpu, memory } = useMetrics();

    const autoAlerts = [];
    if (cpu > 80) autoAlerts.push({ type: 'CRITICAL', msg: `CPU at critical levels (${cpu}%)` });
    if (memory > 85) autoAlerts.push({ type: 'CRITICAL', msg: `Host memory constrained (${memory}%)` });
    if (cpu > 70 && cpu <= 80) autoAlerts.push({ type: 'WARNING', msg: `CPU running high (${cpu}%)` });

    return (
        <div className="glass card" style={{ height: '100%' }}>
            <h3 className="panel-title">System Alerts</h3>

            {autoAlerts.length === 0 ? (
                <div className="alert-nominal">
                    <span style={{ color: 'var(--accent-green)' }}>✓</span>
                    All systems nominal. No active alerts.
                </div>
            ) : (
                <div className="flex-col gap-md">
                    {autoAlerts.map((a, i) => (
                        <div key={i} className={`alert-item ${a.type === 'CRITICAL' ? 'alert-item--critical' : 'alert-item--warning'}`}>
                            <span style={{ fontWeight: 'bold' }}>{a.type === 'CRITICAL' ? '!' : '·'}</span>
                            {a.msg}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
