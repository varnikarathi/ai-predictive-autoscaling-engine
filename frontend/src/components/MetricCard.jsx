import useAutoscalerStore from '../store/useAutoscalerStore';

const statusColors = {
    healthy: 'var(--color-accent-blue)', // matching the cyan from image
    warning: 'var(--color-accent-yellow)',
    critical: 'var(--color-accent-red)',
};

const statusLabels = {
    healthy: '● HEALTHY',
    warning: '● WARNING',
    critical: '● CRITICAL',
};

export default function MetricCard({ title, icon, value, unit, status, subtitle }) {
    const color = status ? (statusColors[status] || statusColors.healthy) : 'var(--text-primary)';
    const pct = Math.min(100, Math.max(0, parseFloat(value) || 0));
    const showBar = unit === '%';

    return (
        <div className="glass card-hover" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {icon} {title}
                </span>
                {status && (
                    <span style={{ fontSize: '10px', fontWeight: 700, color, letterSpacing: '0.05em' }}>
                        {statusLabels[status]}
                    </span>
                )}
            </div>

            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '56px', fontWeight: 300, color: 'var(--color-accent-blue)', lineHeight: 1, transition: 'color 0.4s ease' }}>
                {value !== undefined && value !== 0 ? value : '--'}
                <span style={{ fontSize: '24px', fontWeight: 400, color: 'var(--text-secondary)', marginLeft: '4px' }}>
                    {unit}
                </span>
            </div>

            {showBar && (
                <div className="progress-bar-container">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                </div>
            )}

            {subtitle && (
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>{subtitle}</p>
            )}
        </div>
    );
}

