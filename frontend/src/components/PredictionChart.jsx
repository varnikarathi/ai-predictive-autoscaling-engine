import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts';

function ChartTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="chart-tooltip">
            <p style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>{label}</p>
            {payload.map((entry, i) => (
                <p key={i} style={{ color: entry.color, fontWeight: 600 }}>
                    {entry.name}: {entry.value}%
                </p>
            ))}
        </div>
    );
}

export default function PredictionChart({ data }) {
    return (
        <div className="glass card">
            <div className="chart-header">
                <p className="section-label">Predicted vs Actual CPU</p>
                <div className="chart-legend">
                    <span style={{ color: 'var(--accent-primary)' }}>― Actual</span>
                    <span style={{ color: '#f97316' }}>┅ Predicted</span>
                </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: -15 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="time" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} interval="preserveStartEnd" tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickLine={false} axisLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Line type="monotone" dataKey="actual" name="Actual" stroke="var(--accent-primary)" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: 'var(--accent-primary)' }} isAnimationActive={false} />
                    <Line type="monotone" dataKey="predicted" name="Predicted" stroke="#f97316" strokeWidth={2} strokeDasharray="6 3" dot={false} activeDot={{ r: 4, fill: '#f97316' }} isAnimationActive={false} />
                </LineChart>
            </ResponsiveContainer>
            <p className="hint-text mt-xl">
                Compares the active model's predicted CPU against the actual measured value.
            </p>
        </div>
    );
}
