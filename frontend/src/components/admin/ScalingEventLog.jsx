export default function ScalingEventLog({ events }) {
    if (!events || events.length === 0) {
        return (
            <div className="glass card mt-xl">
                <h3 className="panel-title">Scaling Event Log</h3>
                <p className="caption-text">No scaling events recorded yet.</p>
            </div>
        );
    }

    const actionEvents = events.filter(e => e.action !== 'NO_ACTION').slice().reverse();
    const isScaleAction = (action) => action === 'SCALE_UP' || action === 'SCALE_DOWN';

    return (
        <div className="glass card mt-xl event-log">
            <h3 className="panel-title event-log-title">Scaling Event Log</h3>

            <table className="event-table">
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Action</th>
                        <th>Instances</th>
                        <th>CPU %</th>
                    </tr>
                </thead>
                <tbody>
                    {actionEvents.map((evt, i) => (
                        <tr key={i}>
                            <td style={{ color: 'var(--text-secondary)' }}>
                                {new Date(evt.ts || Date.now()).toLocaleString('en-US', {
                                    month: 'short', day: 'numeric',
                                    hour: '2-digit', minute: '2-digit', second: '2-digit'
                                })}
                            </td>
                            <td>
                                <span className={`action-tag ${isScaleAction(evt.action) ? 'action-tag--scale' : 'action-tag--other'}`}>
                                    {evt.action.replace('_', ' ')}
                                </span>
                            </td>
                            <td style={{ fontWeight: 500 }}>{evt.instances}</td>
                            <td style={{ fontWeight: 500 }}>{evt.cpu || '--'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
