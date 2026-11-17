import { NavLink } from 'react-router-dom';

export default function Sidebar({ isConnected }) {
    const linkClass = ({ isActive }) =>
        `sidebar-link ${isActive ? 'sidebar-link--active' : 'sidebar-link--inactive'}`;

    return (
        <div className="glass sidebar">
            <h1 className="sidebar-brand">
                Autoscaling<br />Engine
            </h1>

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
