const express = require("express");
const multer  = require("multer");
const path    = require("path");
const { register, login, getMe } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename:    (req, file, cb) =>
    cb(null, `resume_${Date.now()}${path.extname(file.originalname)}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const allowed = [".pdf", ".doc", ".docx"];
    if (allowed.includes(path.extname(file.originalname).toLowerCase()))
      cb(null, true);
    else
      cb(new Error("Only PDF / Word documents are allowed."));
  },
});

router.post("/register", upload.single("resume"), register);
router.post("/login",    login);
router.get("/me",        protect, getMe);

module.exports = router;