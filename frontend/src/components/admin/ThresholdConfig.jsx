import { useState } from 'react';

export default function ThresholdConfig({ config, onSave }) {
    const [up, setUp] = useState(config?.scaleUpThreshold || 70);
    const [down, setDown] = useState(config?.scaleDownThreshold || 30);

    if (!config) return null;

    return (
        <div className="glass card">
            <h3 className="panel-title">Scaling Thresholds</h3>

            <div className="flex-col gap-lg">
                <div>
                    <div className="threshold-row">
                        <span style={{ color: 'var(--text-secondary)' }}>Scale Up CPU</span>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{up}%</span>
                    </div>
                    <input
                        type="range" min="50" max="95" value={up}
                        className="threshold-range"
                        onChange={e => setUp(parseInt(e.target.value))}
                    />
                </div>

                <div>
                    <div className="threshold-row">
                        <span style={{ color: 'var(--text-secondary)' }}>Scale Down CPU</span>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{down}%</span>
                    </div>
                    <input
                        type="range" min="10" max="45" value={down}
                        className="threshold-range"
                        onChange={e => setDown(parseInt(e.target.value))}
                    />
                </div>

                <button
                    className="btn-primary"
                    style={{ marginTop: '12px' }}
                    onClick={() => onSave({ scaleUpThreshold: up, scaleDownThreshold: down })}
                >
                    Save Configuration
                </button>
            </div>
        </div>
    );
}
