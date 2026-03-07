import { useState } from 'react';

export default function ManualScaling({ onScale }) {
    const [customInstances, setCustomInstances] = useState(3);

    return (
        <div className="glass card">
            <h3 className="panel-title">Manual Overrides</h3>
            <p className="caption-text mb-lg">
                Bypass AI and force an immediate scaling action.
            </p>

            <div className="flex-row gap-md mb-lg">
                <button className="btn-scale btn-scale--danger" onClick={() => onScale(1)}>
                    1 INSTANCE
                </button>
                <button className="btn-scale btn-scale--warning" onClick={() => onScale(5)}>
                    5 INSTANCES
                </button>
                <button className="btn-scale btn-scale--success" onClick={() => onScale(10)}>
                    10 INSTANCES
                </button>
            </div>

            <div className="flex-row gap-md">
                <input
                    type="number"
                    min="1"
                    max="10"
                    className="custom-scale-input"
                    value={customInstances}
                    onChange={e => setCustomInstances(parseInt(e.target.value) || 1)}
                />
                <button className="btn-scale btn-scale--primary" onClick={() => onScale(customInstances)}>
                    CUSTOM SCALE
                </button>
            </div>
        </div>
    );
}
