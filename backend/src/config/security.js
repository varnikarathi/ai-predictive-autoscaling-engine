const PLACEHOLDER_SECRETS = new Set([
    'secret',
    'your_secret_key',
    'your_jwt_secret_here',
    'change_me',
    'changeme',
    'password',
]);
const bcrypt = require('bcryptjs');

function validateSecurityEnvironment() {
    const secret = process.env.JWT_SECRET;
    const normalizedSecret = secret?.trim().toLowerCase();
    if (!secret || secret.trim().length < 32 || PLACEHOLDER_SECRETS.has(normalizedSecret) ||
        /^(replace|your|change)[_-]/.test(normalizedSecret || '')) {
        throw new Error('JWT_SECRET must be set to a unique secret of at least 32 characters.');
    }

    const adminUser = process.env.ADMIN_USER;
    const passwordHash = process.env.ADMIN_PASS_HASH;
    if (!adminUser || adminUser.trim() !== adminUser || adminUser.length > 128 || !passwordHash) {
        throw new Error('ADMIN_USER and ADMIN_PASS_HASH must be configured; there is no default admin account.');
    }
    const hashMatch = passwordHash.match(/^\$2[aby]\$(\d{2})\$[./A-Za-z0-9]{53}$/);
    if (!hashMatch || Number(hashMatch[1]) < 10 || Number(hashMatch[1]) > 14) {
        throw new Error('ADMIN_PASS_HASH must contain a valid bcrypt hash.');
    }
    if (bcrypt.compareSync('admin', passwordHash)) {
        throw new Error('ADMIN_PASS_HASH matches the publicly documented default password and must be changed.');
    }

    if (process.env.NODE_ENV === 'production') {
        const origins = process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim()).filter(Boolean) || [];
        const validOrigins = origins.length > 0 && origins.every((origin) => {
            if (origin === '*') return false;
            try {
                const parsed = new URL(origin);
                return parsed.origin === origin && (parsed.protocol === 'https:' || parsed.hostname === 'localhost');
            } catch {
                return false;
            }
        });
        if (!validOrigins) throw new Error('CORS_ORIGIN must contain explicit HTTPS origins in production.');
    }
}

function getAllowedOrigins() {
    const configured = process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:5173';
    return new Set(configured.split(',').map((origin) => origin.trim()).filter(Boolean));
}

module.exports = { validateSecurityEnvironment, getAllowedOrigins };
