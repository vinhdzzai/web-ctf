const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const { getProfile } = require("../controllers/profileController");

const router = express.Router();

router.get("/api/profile", requireAuth, getProfile);

module.exports = router;
