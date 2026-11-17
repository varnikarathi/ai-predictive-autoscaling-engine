import { useState, useEffect } from 'react';
import StatsBar from './admin/StatsBar';
import ManualScaling from './admin/ManualScaling';
import ThresholdConfig from './admin/ThresholdConfig';
import AlertsPanel from './admin/AlertsPanel';
import ScalingEventLog from './admin/ScalingEventLog';

export default function AdminSection() {
    const [config, setConfig] = useState(null);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetch('/api/admin/config')
            .then(r => r.json())
            .then(c => c && setConfig(c))
            .catch(console.error);

        const fetchStats = () => {
            fetch('/api/admin/stats')
                .then(r => r.json())
                .then(s => s && setStats(s))
                .catch(console.error);
        };

        fetchStats();
        const interval = setInterval(fetchStats, 2000);

        return () => clearInterval(interval);
    }, []);

    const handleSaveConfig = async (newConfig) => {
        try {
            const res = await fetch('/api/admin/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newConfig)
            });
            if (res.ok) {
                setConfig(await res.json());
            }
        } catch (err) {
            console.error('Failed to save config:', err);
        }
    };

    const handleManualScale = async (instances) => {
        try {
            const res = await fetch('/api/scaling', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'set', instances })
            });
            if (res.ok) {
                fetch('/api/admin/stats')
                    .then(r => r.json())
                    .then(setStats)
                    .catch(console.error);
            }
        } catch (err) {
            console.error('Failed to scale:', err);
        }
    };

    return (
        <>
            <div className="section-header">
                <h2 className="section-title">System Administration</h2>
                <p className="section-subtitle">
                    Manage simulated thresholds and instance counts. No cloud resources are modified.
                </p>
            </div>

            <StatsBar stats={stats} />

            <div className="grid-2">
                <div className="flex-col gap-xl">
                    <ThresholdConfig config={config} onSave={handleSaveConfig} />
                    <ManualScaling onScale={handleManualScale} />
                </div>
                <AlertsPanel />
            </div>

            <ScalingEventLog events={stats?.events} />
        </>
    );
}
