import { NavLink } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

export default function Sidebar({ isConnected }) {
    const { token, logout, username } = useAuthStore();

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

            {token && (
                <div className="sidebar-user">
                    <span className="sidebar-user-label">
                        User: <span className="sidebar-user-name">{username}</span>
                    </span>
                    <button className="sidebar-logout-btn" onClick={() => logout()}>
                        Sign Out
                    </button>
                </div>
            )}

            <div className="sidebar-status">
                <span className={`status-dot ${isConnected ? 'status-dot--live' : 'status-dot--dead'}`} />
                <span className={`status-label ${isConnected ? 'status-label--live' : 'status-label--dead'}`}>
                    {isConnected ? 'CONN LIVE' : 'DISCONNECTED'}
                </span>
            </div>
        </div>
    );
}
