import useAutoscalerStore from '../store/useAutoscalerStore';

const statusColors = {
    healthy: 'var(--color-accent-blue)',
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
        <div className="glass card card-hover flex-col gap-sm">
            <div className="metric-card-header">
                <span className="section-label">{title}</span>
                {status && (
                    <span className="metric-status" style={{ color }}>
                        {statusLabels[status]}
                    </span>
                )}
            </div>

            <div className="big-number" style={{ color: 'var(--color-accent-blue)', transition: 'color 0.4s ease' }}>
                {value !== undefined && value !== 0 ? value : '--'}
                <span className="big-number-unit">{unit}</span>
            </div>

            {showBar && (
                <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: `${pct}%`, backgroundColor: color }} />
                </div>
            )}

            {subtitle && <p className="hint-text" style={{ marginTop: '8px' }}>{subtitle}</p>}
        </div>
    );
}
