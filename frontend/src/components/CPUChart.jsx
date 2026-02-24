import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
        return (
            <div style={{
                background: 'var(--color-surface)', border: '1px solid var(--glass-border)',
                borderRadius: '8px', padding: '10px 14px', fontSize: '12px',
                boxShadow: 'var(--glass-shadow)'
            }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>{label}</p>
                <p style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                    CPU: {payload[0]?.value}%
                </p>
            </div>
        );
    }
    return null;
};

export default function CPUChart({ data }) {
    return (
        <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <p style={{ fontSize: '12px', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    CPU Utilization
                </p>
                <div style={{ display: 'flex', gap: '16px', fontSize: '11px' }}>
                    <span style={{ color: 'var(--accent-yellow)' }}>― Scale-Up &gt;70%</span>
                    <span style={{ color: 'var(--accent-green)' }}>― Scale-Down &lt;30%</span>
                </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: -15 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                        dataKey="time"
                        tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                        interval="preserveStartEnd"
                        tickLine={false}
                    />
                    <YAxis
                        domain={[0, 100]}
                        tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={70} stroke="var(--accent-yellow)" strokeDasharray="4 4" strokeOpacity={0.5} />
                    <ReferenceLine y={30} stroke="var(--accent-green)" strokeDasharray="4 4" strokeOpacity={0.5} />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="var(--accent-primary)"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, fill: 'var(--accent-primary)' }}
                        isAnimationActive={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
