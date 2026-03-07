import { useState, useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';
import StatsBar from './admin/StatsBar';
import ManualScaling from './admin/ManualScaling';
import ThresholdConfig from './admin/ThresholdConfig';
import AlertsPanel from './admin/AlertsPanel';
import ScalingEventLog from './admin/ScalingEventLog';

export default function AdminSection() {
    const [config, setConfig] = useState(null);
    const [stats, setStats] = useState(null);

    const token = useAuthStore(state => state.token);
    const logout = useAuthStore(state => state.logout);

    useEffect(() => {
        if (!token) return;

        const headers = { 'Authorization': `Bearer ${token}` };

        fetch('/api/admin/config', { headers })
            .then(r => {
                if (r.status === 401) { logout(); return null; }
                return r.json();
            })
            .then(c => c && setConfig(c))
            .catch(console.error);

        const interval = setInterval(() => {
            fetch('/api/admin/stats', { headers })
                .then(r => {
                    if (r.status === 401) { logout(); return null; }
                    return r.json();
                })
                .then(s => s && setStats(s))
                .catch(console.error);
        }, 2000);

        return () => clearInterval(interval);
    }, [token, logout]);

    const handleSaveConfig = async (newConfig) => {
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        const res = await fetch('/api/admin/config', {
            method: 'POST',
            headers,
            body: JSON.stringify(newConfig)
        });
        if (res.status === 401) return logout();
        setConfig(await res.json());
    };

    const handleManualScale = async (instances) => {
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        const res = await fetch('/api/scaling', {
            method: 'POST',
            headers,
            body: JSON.stringify({ action: 'set', instances })
        });
        if (res.status === 401) return logout();

        fetch('/api/admin/stats', { headers })
            .then(r => r.json())
            .then(setStats)
            .catch(console.error);
    };

    return (
        <>
            <div className="section-header">
                <h2 className="section-title">System Administration</h2>
                <p className="section-subtitle">
                    Manage scaling logic, configure thresholds, and view cluster event logs.
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
