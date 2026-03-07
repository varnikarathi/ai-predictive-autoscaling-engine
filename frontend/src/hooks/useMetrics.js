import useAutoscalerStore from '../store/useAutoscalerStore';

export function useMetrics() {
    const {
        currentMetrics,
        cpuHistory,
        memoryHistory,
        rpsHistory,
        scalingDecision,
        scalingEvents,
        predictedCPU,
        confidence,
        isConnected,
        modelPredictions,
        activeModel,
        predictionHistory,
    } = useAutoscalerStore();

    const getStatus = (value, warnThreshold, critThreshold) => {
        if (value >= critThreshold) return 'critical';
        if (value >= warnThreshold) return 'warning';
        return 'healthy';
    };

    const cpuStatus = getStatus(currentMetrics.cpu, 60, 80);
    const memStatus = getStatus(currentMetrics.memory, 70, 85);

    return {
        cpu: currentMetrics.cpu,
        memory: currentMetrics.memory,
        requestsPerSecond: currentMetrics.requestsPerSecond,
        cpuHistory,
        memoryHistory,
        rpsHistory,
        scalingDecision,
        scalingEvents,
        predictedCPU,
        confidence,
        isConnected,
        cpuStatus,
        memStatus,
        modelPredictions,
        activeModel,
        predictionHistory,
    };
}

