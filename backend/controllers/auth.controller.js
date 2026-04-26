const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");
const User   = require("../db/model");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const safeUser = (u) => ({
  _id:        u._id,
  name:       u.name,
  email:      u.email,
  role:       u.role,
  avatar:     u.avatar,
  bio:        u.bio,
  location:   u.location,
  age:        u.age,
  skills:     u.skills,
  expertise:  u.expertise,
  industries: u.industries,
  startupName: u.startupName,
  startupStage: u.startupStage,
  startupDescription: u.startupDescription,
  lookingFor: u.lookingFor,
  linkedin:   u.linkedin,
  github:     u.github,
  website:    u.website,
  resumeUrl:  u.resumeUrl,
  matches:    u.matches,
  swipedRight:u.swipedRight,
  swipedLeft: u.swipedLeft,
  pendingRequests: u.pendingRequests,
  createdAt:  u.createdAt,
});

// ── POST /api/auth/register ───────────────────────────────
const register = async (req, res) => {
  try {
    const {
      name, email, password, age, location, bio,
      role, lookingFor,
      startupName, startupStage, startupDescription, expertise,
      skills, industries,
      linkedin, github, website,
    } = req.body;

    if (!name || !email || !password || !role)
      return res.status(400).json({ message: "Name, email, password and role are required." });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already in use." });

    const hashed = await bcrypt.hash(password, 10);

    // Parse JSON arrays sent as strings from FormData
    const parseArr = (v) => {
      if (!v) return [];
      try { return JSON.parse(v); } catch { return []; }
    };

    const user = await User.create({
      name,
      email,
      password: hashed,
      age:      age || null,
      location: location || "",
      bio:      bio || "",
      role,
      lookingFor:         parseArr(lookingFor),
      skills:             parseArr(skills),
      industries:         parseArr(industries),
      expertise:          expertise || "",
      startupName:        startupName || "",
      startupStage:       startupStage || "none",
      startupDescription: startupDescription || "",
      linkedin:  linkedin || "",
      github:    github   || "",
      website:   website  || "",
      resumeUrl: req.file ? `/uploads/${req.file.filename}` : "",
    });

    res.status(201).json({ token: generateToken(user._id), user: safeUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed.", error: err.message });
  }
};

// ── POST /api/auth/login ──────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password." });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)  return res.status(400).json({ message: "Invalid email or password." });

    res.json({ token: generateToken(user._id), user: safeUser(user) });
  } catch (err) {
    res.status(500).json({ message: "Login failed.", error: err.message });
  }
};

// ── GET /api/auth/me ──────────────────────────────────────
const getMe = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json(safeUser(user));
};

module.exports = { register, login, getMe };