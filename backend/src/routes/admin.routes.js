const express = require('express');
const router = express.Router();
const { getConfig, updateConfig, getStats } = require('../controllers/admin.controller');

router.get('/config', getConfig);
router.post('/config', updateConfig);
router.get('/stats', getStats);

module.exports = router;
