import { useEffect, useRef, useCallback } from 'react';
import useAutoscalerStore from '../store/useAutoscalerStore';

const WS_URL = import.meta.env.PROD
    ? window.location.origin.replace(/^http/, 'ws')
    : 'ws://localhost:5000';
const RECONNECT_DELAY = 3000;

export function useWebSocket() {
    const ws = useRef(null);
    const reconnectTimer = useRef(null);
    const { updateMetrics, setScalingDecision, setConnectionStatus, addPredictionHistory } = useAutoscalerStore();

    const connect = useCallback(() => {
        if (ws.current?.readyState === WebSocket.OPEN) return;

        ws.current = new WebSocket(WS_URL);

        ws.current.onopen = () => {
            setConnectionStatus(true);
            if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
        };

        ws.current.onmessage = (event) => {
            try {
                const { type, payload } = JSON.parse(event.data);
                if (type === 'METRICS_UPDATE') updateMetrics(payload);
                if (type === 'SCALING_DECISION') setScalingDecision(payload);
                if (type === 'PREDICTION_HISTORY') addPredictionHistory(payload);
            } catch (e) {
                console.error('[WS] parse error', e);
            }
        };

        ws.current.onclose = () => {
            setConnectionStatus(false);
            reconnectTimer.current = setTimeout(connect, RECONNECT_DELAY);
        };

        ws.current.onerror = () => {
            ws.current?.close();
        };
    }, [updateMetrics, setScalingDecision, setConnectionStatus, addPredictionHistory]);

    useEffect(() => {
        connect();
        return () => {
            if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
            ws.current?.close();
        };
    }, [connect]);
}
