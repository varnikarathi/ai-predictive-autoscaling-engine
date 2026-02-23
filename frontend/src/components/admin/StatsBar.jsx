export default function StatsBar({ stats }) {
    if (!stats) return null;

    const uptimeMins = Math.floor(stats.uptimeMs / 60000);
    const uptimeSecs = Math.floor((stats.uptimeMs % 60000) / 1000);

    const Stat = ({ label, value }) => (
        <div style={{ flex: 1, borderRight: '1px solid var(--glass-border)', padding: '0 20px' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>{label}</div>
            <div style={{ fontSize: '24px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{value}</div>
        </div>
    );

    return (
        <div className="glass" style={{
            display: 'flex',
            padding: '24px 0',
            borderRadius: '16px',
            marginBottom: '24px'
        }}>
            <Stat label="Uptime" value={`${uptimeMins}m ${uptimeSecs}s`} />
            <Stat label="Total Scale Events" value={stats.totalEvents} />
            <Stat label="Average CPU (Last 20)" value={`${stats.avgCPU}%`} />
            <div style={{ flex: 1, padding: '0 20px' }}>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>Peak Instances</div>
                <div style={{ fontSize: '24px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{stats.peakInstances}</div>
            </div>
        </div>
    );
}
