const express = require('express');
const router = express.Router();
const { login, verify } = require('../controllers/auth.controller');
const requireAuth = require('../middleware/auth.middleware');

router.post('/login', login);
router.get('/verify', requireAuth, verify);

module.exports = router;
