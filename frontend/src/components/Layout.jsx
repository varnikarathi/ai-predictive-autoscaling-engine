import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useWebSocket } from '../hooks/useWebSocket';
import { useMetrics } from '../hooks/useMetrics';

export default function Layout() {
    useWebSocket();
    const { isConnected } = useMetrics();

    return (
        <div className="animated-bg" style={{ minHeight: '100vh', display: 'flex' }}>
            <Sidebar isConnected={isConnected} />

            <main style={{
                marginLeft: '260px', // width of sidebar
                flex: 1,
                padding: '40px',
                maxWidth: '1200px',
            }}>
                <Outlet />
            </main>
        </div>
    );
}
