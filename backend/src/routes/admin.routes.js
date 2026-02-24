const express = require('express');
const router = express.Router();
const { getConfig, updateConfig, getStats } = require('../controllers/admin.controller');
const requireAuth = require('../middleware/auth.middleware');

router.get('/config', requireAuth, getConfig);
router.post('/config', requireAuth, updateConfig);
router.get('/stats', requireAuth, getStats);

module.exports = router;

