export default function ManualScaling({ onScale }) {
    const btnStyle = (bg) => ({
        padding: '12px 24px',
        borderRadius: '8px',
        border: 'none',
        background: bg,
        color: '#fff',
        fontWeight: 600,
        cursor: 'pointer',
        flex: 1
    });

    return (
        <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>🕹️ Manual Overrides</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Bypass AI and force an immediate scaling action.
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
                <button
                    style={btnStyle('var(--accent-red)')}
                    onClick={() => onScale(1)}
                >
                    FORCE 1 INSTANCE
                </button>
                <button
                    style={btnStyle('var(--accent-yellow)')}
                    onClick={() => onScale(5)}
                >
                    FORCE 5 INSTANCES
                </button>
                <button
                    style={btnStyle('var(--accent-green)')}
                    onClick={() => onScale(10)}
                >
                    FORCE 10 INSTANCES
                </button>
            </div>
        </div>
    );
}
