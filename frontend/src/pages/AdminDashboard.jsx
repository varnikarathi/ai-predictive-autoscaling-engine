import { useState, useEffect } from 'react';
import StatsBar from '../components/admin/StatsBar';
import ManualScaling from '../components/admin/ManualScaling';
import ThresholdConfig from '../components/admin/ThresholdConfig';
import AlertsPanel from '../components/admin/AlertsPanel';
import ScalingEventLog from '../components/admin/ScalingEventLog';

export default function AdminDashboard() {
    const [config, setConfig] = useState(null);
    const [stats, setStats] = useState(null);

    // Poll for admin stats every 2s
    useEffect(() => {
        fetch('/api/admin/config').then(r => r.json()).then(setConfig);

        const interval = setInterval(() => {
            fetch('/api/admin/stats').then(r => r.json()).then(setStats);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const handleSaveConfig = async (newConfig) => {
        const res = await fetch('/api/admin/config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newConfig)
        });
        setConfig(await res.json());
    };

    const handleManualScale = async (instances) => {
        await fetch('/api/scaling', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'set', instances })
        });
        // refresh stats immediately
        fetch('/api/admin/stats').then(r => r.json()).then(setStats);
    };

    return (
        <>
            <div style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    System Administration
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                    Manage scaling logic, configure thresholds, and view cluster event logs.
                </p>
            </div>

            <StatsBar stats={stats} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <ThresholdConfig config={config} onSave={handleSaveConfig} />
                    <ManualScaling onScale={handleManualScale} />
                </div>
                <AlertsPanel />
            </div>

            <ScalingEventLog events={stats?.events} />
        </>
    );
}
