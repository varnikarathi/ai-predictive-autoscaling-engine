import MetricCard from '../components/MetricCard';
import ScalingPanel from '../components/ScalingPanel';
import CPUChart from '../components/CPUChart';
import MemoryChart from '../components/MemoryChart';
import PredictionChart from '../components/PredictionChart';
import ModelComparisonPanel from '../components/ModelComparisonPanel';
import { useMetrics } from '../hooks/useMetrics';

export default function LiveDashboard() {
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
                    Read-only demo using simulated metrics and AI forecasts updated every 5 seconds.
                </p>
                <span style={{ display: 'inline-flex', marginTop: '12px', padding: '6px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--color-accent-green)', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)' }}>
                    READ-ONLY DEMO · SIMULATED DATA
                </span>
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
                    subtitle="Simulated memory"
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

        </>
    );
}
