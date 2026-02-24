export default function StatsBar({ stats }) {
    if (!stats) return null;

    const uptimeMins = Math.floor(stats.uptimeMs / 60000);
    const uptimeSecs = Math.floor((stats.uptimeMs % 60000) / 1000);

    const Stat = ({ label, value }) => (
        <div style={{ flex: 1, borderRight: '1px solid var(--glass-border)', padding: '0 24px' }}>
            <div style={{ fontSize: '12px', letterSpacing: '0.05em', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 }}>{label}</div>
            <div style={{ fontSize: '32px', fontWeight: 300, color: 'var(--accent-primary)', fontFamily: 'var(--font-sans)', lineHeight: 1.2 }}>{value}</div>
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
            <Stat label="Scale Events" value={stats.totalEvents} />
            <Stat label="Avg CPU (20s)" value={`${stats.avgCPU}%`} />
            <div style={{ flex: 1, padding: '0 24px' }}>
                <div style={{ fontSize: '12px', letterSpacing: '0.05em', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 }}>Peak Instances</div>
                <div style={{ fontSize: '32px', fontWeight: 300, color: 'var(--accent-primary)', fontFamily: 'var(--font-sans)', lineHeight: 1.2 }}>{stats.peakInstances}</div>
            </div>
        </div>
    );
}
