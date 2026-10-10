const express = require("express");
const router = express.Router();
const { scaleSystem } = require("../controllers/scaling.controllers");
const { requireAuth, requireRole } = require("../middleware/auth.middleware");

router.use(requireAuth, requireRole('admin'));
router.post("/", scaleSystem);
router.post("/evaluate", scaleSystem);

module.exports = router;



