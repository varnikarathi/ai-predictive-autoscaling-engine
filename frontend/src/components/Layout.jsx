import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useWebSocket } from '../hooks/useWebSocket';
import { useMetrics } from '../hooks/useMetrics';

export default function Layout() {
    useWebSocket();
    const { isConnected } = useMetrics();

    return (
        <div className="animated-bg app-layout">
            <Sidebar isConnected={isConnected} />
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}
