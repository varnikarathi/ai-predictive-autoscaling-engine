export default function StatsBar({ stats }) {
    if (!stats) return null;

    const uptimeMins = Math.floor(stats.uptimeMs / 60000);
    const uptimeSecs = Math.floor((stats.uptimeMs % 60000) / 1000);

    const Stat = ({ label, value }) => (
        <div className="stats-bar-item">
            <div className="section-label mb-sm">{label}</div>
            <div className="stat-value">{value}</div>
        </div>
    );

    return (
        <div className="glass stats-bar mb-xl">
            <Stat label="Uptime" value={`${uptimeMins}m ${uptimeSecs}s`} />
            <Stat label="Scale Events" value={stats.totalEvents} />
            <Stat label="Avg CPU (20s)" value={`${stats.avgCPU}%`} />
            <Stat label="Peak Instances" value={stats.peakInstances} />
        </div>
    );
}
