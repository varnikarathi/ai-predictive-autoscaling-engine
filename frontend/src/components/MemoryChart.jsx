import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts';

function ChartTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="chart-tooltip">
            <p style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>{label}</p>
            <p style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                Memory: {payload[0]?.value}%
            </p>
        </div>
    );
}

export default function MemoryChart({ data }) {
    return (
        <div className="glass card">
            <p className="section-label mb-lg">Memory Utilization</p>
            <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: -15 }}>
                    <defs>
                        <linearGradient id="memGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="time" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} interval="preserveStartEnd" tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickLine={false} axisLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Area type="monotone" dataKey="value" stroke="var(--accent-primary)" strokeWidth={2} fill="url(#memGradient)" dot={false} activeDot={{ r: 4, fill: 'var(--accent-primary)' }} isAnimationActive={false} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
