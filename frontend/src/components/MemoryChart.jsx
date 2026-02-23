import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
        return (
            <div style={{
                background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)',
                borderRadius: '8px', padding: '10px 14px', fontSize: '12px',
            }}>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '4px' }}>{label}</p>
                <p style={{ color: 'var(--color-accent-cyan)', fontWeight: 600 }}>
                    Memory: {payload[0]?.value}%
                </p>
            </div>
        );
    }
    return null;
};

export default function MemoryChart({ data }) {
    return (
        <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
            <p style={{ fontSize: '12px', letterSpacing: '0.08em', color: 'var(--color-text-secondary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '20px' }}>
                💾 Memory Utilization
            </p>
            <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: -15 }}>
                    <defs>
                        <linearGradient id="memGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(51,65,85,0.5)" />
                    <XAxis
                        dataKey="time"
                        tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }}
                        interval="preserveStartEnd"
                        tickLine={false}
                    />
                    <YAxis
                        domain={[0, 100]}
                        tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="var(--color-accent-cyan)"
                        strokeWidth={2}
                        fill="url(#memGradient)"
                        dot={false}
                        activeDot={{ r: 4, fill: 'var(--color-accent-cyan)' }}
                        isAnimationActive={false}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
