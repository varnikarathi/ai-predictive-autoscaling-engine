const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
async function login(req, res) {
    const { username, password } = req.body || {};
    if (typeof username !== 'string' || typeof password !== 'string' ||
        username.length < 1 || username.length > 128 || password.length < 1 || password.length > 1024) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const matchesUser = username === process.env.ADMIN_USER;
        const isMatch = await bcrypt.compare(password, process.env.ADMIN_PASS_HASH);
        if (!matchesUser || !isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { username: process.env.ADMIN_USER, role: 'admin' },
            process.env.JWT_SECRET,
            {
                algorithm: 'HS256',
                expiresIn: '8h',
                issuer: 'ai-predictive-autoscaling-engine',
                audience: 'ai-predictive-autoscaling-engine-api',
            }
        );
        return res.json({ token, username: process.env.ADMIN_USER, role: 'admin' });
    } catch {
        return res.status(503).json({ error: 'Authentication is temporarily unavailable' });
    }
}

function verify(req, res) {
    // If they pass the middleware, they are valid
    res.json({ valid: true, user: req.user });
}

module.exports = { login, verify };
