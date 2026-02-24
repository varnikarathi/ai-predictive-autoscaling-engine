import { NavLink } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

export default function Sidebar({ isConnected }) {
    const { token, logout, username } = useAuthStore();

    const linkStyle = ({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: '12px',
        color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
        background: isActive ? 'var(--glass-bg)' : 'transparent',
        border: `1px solid ${isActive ? 'var(--glass-border)' : 'transparent'}`,
        textDecoration: 'none',
        fontWeight: 500,
        fontSize: '15px',
        transition: 'all 0.3s ease',
        boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
    });

    return (
        <div className="glass" style={{
            width: '260px',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            display: 'flex',
            flexDirection: 'column',
            padding: '32px 24px',
            borderRight: '1px solid var(--glass-border)',
            borderTop: 'none', borderBottom: 'none', borderLeft: 'none',
            borderRadius: 0,
            zIndex: 10,
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
                <h1 style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #fff, var(--accent-hot))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1.2,
                }}>
                    Autoscaling<br />Engine
                </h1>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                <NavLink to="/" style={linkStyle}>
                    Live Dashboard
                </NavLink>
                <NavLink to="/admin" style={linkStyle}>
                    System Admin
                </NavLink>
            </nav>

            {token && (
                <div style={{
                    marginBottom: '16px',
                    padding: '12px',
                    borderRadius: '12px',
                    background: 'rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        User: <span style={{ color: '#fff', fontWeight: 600 }}>{username}</span>
                    </div>
                    <button
                        onClick={() => logout()}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--accent-red)',
                            fontSize: '13px',
                            cursor: 'pointer',
                            fontWeight: 600
                        }}
                    >
                        Sign Out
                    </button>
                </div>
            )}


            <div style={{
                marginTop: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                padding: '12px 16px',
                borderRadius: '12px',
            }}>
                <span style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: isConnected ? 'var(--accent-green)' : 'var(--accent-rose)',
                    animation: isConnected ? 'pulse-live 2s infinite' : 'none',
                    boxShadow: isConnected ? '0 0 8px var(--accent-green)' : 'none',
                }} />
                <span style={{
                    fontSize: '13px', fontWeight: 600, letterSpacing: '0.04em',
                    color: isConnected ? 'var(--accent-green)' : 'var(--accent-rose)'
                }}>
                    {isConnected ? 'CONN LIVE' : 'DISCONNECTED'}
                </span>
            </div>
        </div>
    );
}
