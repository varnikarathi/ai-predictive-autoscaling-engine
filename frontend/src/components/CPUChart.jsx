import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts';

function ChartTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="chart-tooltip">
            <p style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>{label}</p>
            <p style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                CPU: {payload[0]?.value}%
            </p>
        </div>
    );
}

export default function CPUChart({ data }) {
    return (
        <div className="glass card">
            <div className="chart-header">
                <p className="section-label">CPU Utilization</p>
                <div className="chart-legend">
                    <span style={{ color: 'var(--accent-yellow)' }}>― Scale-Up &gt;70%</span>
                    <span style={{ color: 'var(--accent-green)' }}>― Scale-Down &lt;30%</span>
                </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: -15 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="time" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} interval="preserveStartEnd" tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickLine={false} axisLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Line type="monotone" dataKey="value" stroke="var(--accent-primary)" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: 'var(--accent-primary)' }} isAnimationActive={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
