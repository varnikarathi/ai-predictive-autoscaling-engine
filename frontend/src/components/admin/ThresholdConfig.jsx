import { useState } from 'react';

export default function ThresholdConfig({ config, onSave }) {
    const [up, setUp] = useState(config?.scaleUpThreshold || 70);
    const [down, setDown] = useState(config?.scaleDownThreshold || 30);

    if (!config) return null;

    return (
        <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px', fontWeight: 600 }}>Scaling Thresholds</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Scale Up CPU</span>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{up}%</span>
                    </div>
                    <input
                        type="range" min="50" max="95" value={up}
                        onChange={e => setUp(parseInt(e.target.value))}
                        style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                    />
                </div>

                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Scale Down CPU</span>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{down}%</span>
                    </div>
                    <input
                        type="range" min="10" max="45" value={down}
                        onChange={e => setDown(parseInt(e.target.value))}
                        style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                    />
                </div>

                <button
                    onClick={() => onSave({ scaleUpThreshold: up, scaleDownThreshold: down })}
                    style={{
                        marginTop: '12px',
                        padding: '12px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'var(--accent-primary)',
                        color: 'var(--color-bg-base)',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'opacity 0.2s'
                    }}
                    onMouseOver={e => e.target.style.opacity = 0.8}
                    onMouseOut={e => e.target.style.opacity = 1}
                >
                    Save Configuration
                </button>
            </div>
        </div>
    );
}
