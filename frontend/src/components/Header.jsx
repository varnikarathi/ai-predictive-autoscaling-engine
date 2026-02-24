export default function Header({ isConnected }) {
    return (
        <header style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '40px',
            paddingBottom: '24px',
            borderBottom: '1px solid var(--color-border)',
        }}>
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                    <h1 style={{
                        fontSize: '26px',
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #f8fafc, #3b82f6)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-0.02em',
                    }}>
                        AI Predictive Autoscaler
                    </h1>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginLeft: '40px' }}>
                    Real-time ML-powered infrastructure intelligence
                </p>
            </div>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: isConnected ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
                border: `1px solid ${isConnected ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
                padding: '8px 16px',
                borderRadius: '999px',
                transition: 'all 0.4s ease',
            }}>
                <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: isConnected ? 'var(--color-accent-green)' : 'var(--color-accent-red)',
                    display: 'inline-block',
                    animation: isConnected ? 'pulse-live 2s ease-in-out infinite' : 'none',
                    boxShadow: isConnected ? '0 0 6px var(--color-accent-green)' : 'none',
                }} />
                <span style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: isConnected ? 'var(--color-accent-green)' : 'var(--color-accent-red)',
                    letterSpacing: '0.04em',
                }}>
                    {isConnected ? 'LIVE' : 'DISCONNECTED'}
                </span>
            </div>
        </header>
    );
}
