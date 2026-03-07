import { create } from 'zustand';

const MAX_HISTORY = 60;

const useAutoscalerStore = create((set) => ({
    currentMetrics: { cpu: 0, memory: 0, requestsPerSecond: 0 },
    scalingDecision: { action: 'NO_ACTION', currentInstances: 1 },
    predictedCPU: 0,
    confidence: 0,
    activeModel: 'linearRegression',
    modelPredictions: {
        linearRegression: { predicted: 0, confidence: 0 },
        exponentialSmoothing: { predicted: 0, confidence: 0 },
        movingAverage: { predicted: 0, confidence: 0 },
    },
    predictionHistory: [],
    cpuHistory: [],
    memoryHistory: [],
    rpsHistory: [],
    scalingEvents: [],
    isConnected: false,

    updateMetrics: (metrics) =>
        set((state) => ({
            currentMetrics: {
                cpu: metrics.cpu,
                memory: metrics.memory,
                requestsPerSecond: metrics.requestsPerSecond,
            },
            predictedCPU: metrics.predictedCPU ?? state.predictedCPU,
            confidence: metrics.confidence ?? state.confidence,
            activeModel: metrics.activeModel ?? state.activeModel,
            modelPredictions: metrics.models ?? state.modelPredictions,
            cpuHistory: [
                ...state.cpuHistory.slice(-(MAX_HISTORY - 1)),
                { time: new Date().toLocaleTimeString(), value: metrics.cpu },
            ],
            memoryHistory: [
                ...state.memoryHistory.slice(-(MAX_HISTORY - 1)),
                { time: new Date().toLocaleTimeString(), value: metrics.memory },
            ],
            rpsHistory: [
                ...state.rpsHistory.slice(-(MAX_HISTORY - 1)),
                { time: new Date().toLocaleTimeString(), value: metrics.requestsPerSecond },
            ],
        })),

    addPredictionHistory: (entry) =>
        set((state) => ({
            predictionHistory: [
                ...state.predictionHistory.slice(-(MAX_HISTORY - 1)),
                { time: new Date().toLocaleTimeString(), ...entry },
            ],
        })),

    setScalingDecision: (decision) =>
        set((state) => {
            const isAction = decision.action !== 'NO_ACTION' && decision.action !== 'COOLDOWN';
            return {
                scalingDecision: decision,
                scalingEvents: isAction
                    ? [
                        ...state.scalingEvents.slice(-19),
                        {
                            time: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                            action: decision.action,
                            instances: decision.currentInstances,
                        },
                    ]
                    : state.scalingEvents,
            };
        }),

    setConnectionStatus: (isConnected) => set({ isConnected }),
}));

export default useAutoscalerStore;

