import { NavLink } from 'react-router-dom';

export default function Sidebar({ isConnected }) {
    const linkClass = ({ isActive }) =>
        `sidebar-link ${isActive ? 'sidebar-link--active' : 'sidebar-link--inactive'}`;

    return (
        <div className="glass sidebar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
                <img src="/logo.svg" alt="Logo" style={{ width: '38px', height: '38px', borderRadius: '8px' }} />
                <h1 className="sidebar-brand" style={{ marginBottom: 0 }}>
                    Autoscaling<br />Engine
                </h1>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/" className={linkClass}>
                    Live Dashboard
                </NavLink>
                <NavLink to="/admin" className={linkClass}>
                    System Admin
                </NavLink>
            </nav>

            <div className="sidebar-status">
                <span className={`status-dot ${isConnected ? 'status-dot--live' : 'status-dot--dead'}`} />
                <span className={`status-label ${isConnected ? 'status-label--live' : 'status-label--dead'}`}>
                    {isConnected ? 'CONN LIVE' : 'DISCONNECTED'}
                </span>
            </div>
        </div>
    );
}
