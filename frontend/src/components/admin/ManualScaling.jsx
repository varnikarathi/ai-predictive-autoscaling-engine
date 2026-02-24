import { useState } from 'react';

export default function ManualScaling({ onScale }) {
    const [customInstances, setCustomInstances] = useState(3);

    const btnStyle = (bg, border, color) => ({
        padding: '12px 24px',
        borderRadius: '8px',
        border: `1px solid ${border}`,
        background: bg,
        color: color,
        fontWeight: 600,
        fontSize: '12px',
        letterSpacing: '0.05em',
        cursor: 'pointer',
        flex: 1,
        transition: 'all 0.2s',
        whiteSpace: 'nowrap'
    });

    return (
        <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px', fontWeight: 600 }}>Manual Overrides</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Bypass AI and force an immediate scaling action.
            </p>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <button
                    style={btnStyle('rgba(239, 68, 68, 0.1)', 'rgba(239, 68, 68, 0.3)', 'var(--accent-red)')}
                    onClick={() => onScale(1)}
                    onMouseEnter={e => e.target.style.background = 'rgba(239, 68, 68, 0.2)'}
                    onMouseLeave={e => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
                >
                    1 INSTANCE
                </button>
                <button
                    style={btnStyle('rgba(251, 191, 36, 0.1)', 'rgba(251, 191, 36, 0.3)', 'var(--accent-yellow)')}
                    onClick={() => onScale(5)}
                    onMouseEnter={e => e.target.style.background = 'rgba(251, 191, 36, 0.2)'}
                    onMouseLeave={e => e.target.style.background = 'rgba(251, 191, 36, 0.1)'}
                >
                    5 INSTANCES
                </button>
                <button
                    style={btnStyle('rgba(16, 185, 129, 0.1)', 'rgba(16, 185, 129, 0.3)', 'var(--accent-green)')}
                    onClick={() => onScale(10)}
                    onMouseEnter={e => e.target.style.background = 'rgba(16, 185, 129, 0.2)'}
                    onMouseLeave={e => e.target.style.background = 'rgba(16, 185, 129, 0.1)'}
                >
                    10 INSTANCES
                </button>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input
                    type="number"
                    min="1"
                    max="10"
                    value={customInstances}
                    onChange={e => setCustomInstances(parseInt(e.target.value) || 1)}
                    style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--glass-border)',
                        background: 'rgba(0,0,0,0.2)',
                        color: 'var(--text-primary)',
                        width: '80px',
                        outline: 'none',
                        fontFamily: 'var(--font-sans)',
                        fontWeight: 600,
                        textAlign: 'center'
                    }}
                />
                <button
                    style={{ ...btnStyle('var(--accent-primary)', 'var(--accent-primary)', 'var(--color-bg-base)'), flex: 2 }}
                    onClick={() => onScale(customInstances)}
                    onMouseEnter={e => e.target.style.opacity = '0.8'}
                    onMouseLeave={e => e.target.style.opacity = '1'}
                >
                    CUSTOM SCALE
                </button>
            </div>
        </div>
    );
}
