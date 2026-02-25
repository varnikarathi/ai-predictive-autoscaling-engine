const jwt = require('jsonwebtoken');
const { clearHistory } = require('../services/metrics.service');
const { clearEvents } = require('../services/admin.service');

function login(req, res) {
    const { username, password } = req.body;

    // In a real app, use bcrypt against a DB user. For this demo, using hardcoded env vars.
    const validUser = process.env.ADMIN_USER || 'admin';
    const validPass = process.env.ADMIN_PASS || 'admin';

    if (username === validUser && password === validPass) {
        // Clear history for the new session
        clearHistory();
        clearEvents();

        // Generate JWT
        const token = jwt.sign(
            { username },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '24h' }
        );
        return res.json({ token, username });
    }

    return res.status(401).json({ error: 'Invalid credentials' });
}

function verify(req, res) {
    // If they pass the middleware, they are valid
    res.json({ valid: true, user: req.user });
}

module.exports = { login, verify };
