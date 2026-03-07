import Header from '../components/Header';
import MetricCard from '../components/MetricCard';
import ScalingPanel from '../components/ScalingPanel';
import CPUChart from '../components/CPUChart';
import MemoryChart from '../components/MemoryChart';
import PredictionChart from '../components/PredictionChart';
import ModelComparisonPanel from '../components/ModelComparisonPanel';
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
        modelPredictions, activeModel, predictionHistory,
    } = useMetrics();

    return (
        <>
            <div className="section-header">
                <h2 className="section-title">Live Telemetry Overview</h2>
                <p className="section-subtitle">
                    Real-time metrics and AI forecasts updated every 5 seconds.
                </p>
            </div>

            <div className="grid-3 mb-xl">
                <MetricCard
                    title="CPU Usage"
                    value={cpu}
                    unit="%"
                    status={cpuStatus}
                    subtitle={`Predicted next: ${predictedCPU || '--'}%`}
                />
                <MetricCard
                    title="Memory"
                    value={memory}
                    unit="%"
                    status={memStatus}
                    subtitle="Live system memory"
                />
                <MetricCard
                    title="Requests / sec"
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

            <div className="mb-xl">
                <ModelComparisonPanel modelPredictions={modelPredictions} activeModel={activeModel} />
            </div>

            <div className="grid-2 mb-xl">
                <CPUChart data={cpuHistory} />
                <MemoryChart data={memoryHistory} />
            </div>

            <div className="mb-2xl">
                <PredictionChart data={predictionHistory} />
            </div>

            {token && (
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '40px', marginTop: '40px' }}>
                    <AdminSection />
                </div>
            )}
        </>
    );
}
