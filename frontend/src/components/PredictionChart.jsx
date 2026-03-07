import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend
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
                {payload.map((entry, i) => (
                    <p key={i} style={{ color: entry.color, fontWeight: 600 }}>
                        {entry.name}: {entry.value}%
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function PredictionChart({ data }) {
    return (
        <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <p style={{ fontSize: '12px', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Predicted vs Actual CPU
                </p>
                <div style={{ display: 'flex', gap: '16px', fontSize: '11px' }}>
                    <span style={{ color: 'var(--accent-primary)' }}>― Actual</span>
                    <span style={{ color: '#f97316' }}>┅ Predicted</span>
                </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
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
                    <Line
                        type="monotone"
                        dataKey="actual"
                        name="Actual"
                        stroke="var(--accent-primary)"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, fill: 'var(--accent-primary)' }}
                        isAnimationActive={false}
                    />
                    <Line
                        type="monotone"
                        dataKey="predicted"
                        name="Predicted"
                        stroke="#f97316"
                        strokeWidth={2}
                        strokeDasharray="6 3"
                        dot={false}
                        activeDot={{ r: 4, fill: '#f97316' }}
                        isAnimationActive={false}
                    />
                </LineChart>
            </ResponsiveContainer>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '12px' }}>
                Compares the active model's predicted CPU against the actual measured value.
            </p>
        </div>
    );
}
