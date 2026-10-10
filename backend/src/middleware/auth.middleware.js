const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
    const authHeader = req.get('authorization') || '';
    const [scheme, token, ...extra] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token || extra.length > 0) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET, {
            algorithms: ['HS256'],
            issuer: 'ai-predictive-autoscaling-engine',
            audience: 'ai-predictive-autoscaling-engine-api',
        });
        return next();
    } catch {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

function requireRole(role) {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ error: 'Authentication required' });
        if (req.user.role !== role) return res.status(403).json({ error: 'Forbidden' });
        return next();
    };
}

module.exports = { requireAuth, requireRole };
