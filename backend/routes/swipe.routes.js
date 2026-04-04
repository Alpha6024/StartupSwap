const express = require("express");
const { getFeed, swipeRight, swipeLeft } = require("../controllers/swipe.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/feed",              protect, getFeed);
router.post("/right/:targetId",  protect, swipeRight);
router.post("/left/:targetId",   protect, swipeLeft);

module.exports = router;