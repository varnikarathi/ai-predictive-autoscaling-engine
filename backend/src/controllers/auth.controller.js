const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { clearHistory } = require('../services/metrics.service');
const { clearEvents } = require('../services/admin.service');

async function login(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const validUser = process.env.ADMIN_USER || 'admin';
    const passHash = process.env.ADMIN_PASS_HASH;

    // Compare username and verify password against bcrypt hash
    if (username !== validUser || !passHash) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, passHash);
    if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Clear history for the new session
    clearHistory();
    clearEvents();

    // Generate JWT — JWT_SECRET is validated at startup (server.js)
    const token = jwt.sign(
        { username },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
    return res.json({ token, username });
}

function verify(req, res) {
    // If they pass the middleware, they are valid
    res.json({ valid: true, user: req.user });
}

module.exports = { login, verify };
