const express = require("express");
const { getFeed, getAllUsers, swipeRight, swipeLeft, getRequests, acceptRequest, declineRequest } =
  require("../controllers/swipe.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/feed",                    protect, getFeed);
router.get("/all",                     protect, getAllUsers);
router.get("/requests",                protect, getRequests);
router.post("/right/:targetId",        protect, swipeRight);
router.post("/left/:targetId",         protect, swipeLeft);
router.post("/accept/:requesterId",    protect, acceptRequest);
router.post("/decline/:requesterId",   protect, declineRequest);

module.exports = router;
