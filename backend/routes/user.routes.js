const express = require("express");
const multer  = require("multer");
const path    = require("path");
const { getProfile, updateProfile, getMatches, getAllUsers, getStats } =
  require("../controllers/user.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename:    (req, file, cb) =>
    cb(null, `file_${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get("/stats",        getStats);
router.get("/all",          protect, getAllUsers);
router.get("/matches",      protect, getMatches);
router.get("/profile/:id",  protect, getProfile);
router.put("/profile",      protect, upload.single("resume"), updateProfile);

module.exports = router;