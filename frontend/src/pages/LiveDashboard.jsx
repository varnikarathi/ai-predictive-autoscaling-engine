import Header from '../components/Header';
import MetricCard from '../components/MetricCard';
import ScalingPanel from '../components/ScalingPanel';
import CPUChart from '../components/CPUChart';
import MemoryChart from '../components/MemoryChart';
import { useMetrics } from '../hooks/useMetrics';
import useAuthStore from '../store/useAuthStore';
import AdminSection from '../components/AdminSection';

export default function LiveDashboard() {
    const token = useAuthStore(state => state.token);
    const {
        cpu, memory, requestsPerSecond,
        cpuHistory, memoryHistory,
        scalingDecision, scalingEvents,
        predictedCPU, confidence,
        cpuStatus, memStatus,
    } = useMetrics();

    return (
        <>
            <div style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    Live Telemetry Overview
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                    Real-time metrics and AI forecasts updated every 5 seconds.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
                <MetricCard
                    title="CPU Usage"
                    icon=""
                    value={cpu}
                    unit="%"
                    status={cpuStatus}
                    subtitle={`Predicted next: ${predictedCPU || '--'}%`}
                />
                <MetricCard
                    title="Memory"
                    icon=""
                    value={memory}
                    unit="%"
                    status={memStatus}
                    subtitle="Live system memory"
                />
                <MetricCard
                    title="Requests / sec"
                    icon="📡"
                    value={requestsPerSecond}
                    unit="req/s"
                    subtitle="Simulated traffic load"
                />
            </div>

            <ScalingPanel
                scalingDecision={scalingDecision}
                predictedCPU={predictedCPU}
                confidence={confidence}
                scalingEvents={scalingEvents}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
                <CPUChart data={cpuHistory} />
                <MemoryChart data={memoryHistory} />
            </div>

            {token && (
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '40px', marginTop: '40px' }}>
                    <AdminSection />
                </div>
            )}
        </>
    );
}
