const express = require("express");
const router = express.Router();
const { scaleSystem } = require("../controllers/scaling.controllers");
const requireAuth = require("../middleware/auth.middleware");

router.post("/", requireAuth, scaleSystem);
router.post("/evaluate", requireAuth, scaleSystem);

module.exports = router;



