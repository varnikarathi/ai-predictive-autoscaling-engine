import useAutoscalerStore from '../store/useAutoscalerStore';

const statusColors = {
    healthy: 'var(--color-accent-green)',
    warning: 'var(--color-accent-yellow)',
    critical: 'var(--color-accent-red)',
};

const statusLabels = {
    healthy: '● HEALTHY',
    warning: '⚠ WARNING',
    critical: '✕ CRITICAL',
};

export default function MetricCard({ title, icon, value, unit, status, subtitle }) {
    const color = statusColors[status] || statusColors.healthy;
    const pct = Math.min(100, Math.max(0, parseFloat(value) || 0));
    const showBar = unit === '%';

    return (
        <div className="glass card-hover" style={{ padding: '28px 24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', letterSpacing: '0.08em', color: 'var(--color-text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
                    {icon} {title}
                </span>
                {status && (
                    <span style={{ fontSize: '11px', fontWeight: 600, color, letterSpacing: '0.04em' }}>
                        {statusLabels[status]}
                    </span>
                )}
            </div>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '48px', fontWeight: 700, color, lineHeight: 1, transition: 'color 0.4s ease' }}>
                {value !== undefined && value !== 0 ? value : '--'}
                <span style={{ fontSize: '22px', fontWeight: 400, color: 'var(--color-text-secondary)', marginLeft: '4px' }}>
                    {unit}
                </span>
            </div>

            {showBar && (
                <div style={{ background: 'var(--color-bg-tertiary)', borderRadius: '999px', height: '6px', overflow: 'hidden' }}>
                    <div style={{
                        width: `${pct}%`,
                        height: '100%',
                        background: color,
                        borderRadius: '999px',
                        transition: 'width 0.5s ease, background 0.4s ease',
                        boxShadow: `0 0 8px ${color}80`,
                    }} />
                </div>
            )}

            {subtitle && (
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>{subtitle}</p>
            )}
        </div>
    );
}
