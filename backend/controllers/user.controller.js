const User = require("../db/model");

// ── GET /api/users/profile/:id ────────────────────────────
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password -swipedLeft -swipedRight");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── PUT /api/users/profile ────────────────────────────────
const updateProfile = async (req, res) => {
  try {
    const allowed = [
      "name","bio","location","age","role","lookingFor",
      "skills","expertise","industries",
      "startupName","startupStage","startupDescription",
      "linkedin","github","website",
    ];

    const updates = {};
    allowed.forEach((k) => {
      if (req.body[k] !== undefined) {
        // Parse JSON arrays from FormData strings
        if (["lookingFor","skills","industries"].includes(k)) {
          try { updates[k] = JSON.parse(req.body[k]); }
          catch { updates[k] = req.body[k]; }
        } else {
          updates[k] = req.body[k];
        }
      }
    });

    if (req.file) updates.resumeUrl = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true, runValidators: true,
    }).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET /api/users/matches ────────────────────────────────
const getMatches = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("matches", "-password -swipedLeft -swipedRight")
      .select("matches");
    res.json(user.matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET /api/users/all ────────────────────────────────────
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id }, isActive: true })
      .select("-password -swipedLeft -swipedRight")
      .limit(50);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET /api/users/stats ─────────────────────────────────
const getStats = async (req, res) => {
  try {
    const [totalUsers, founders, investors, mentors, startups, matchesAgg] = await Promise.all([
      User.countDocuments({ isActive: true }),
      User.countDocuments({ isActive: true, role: "founder" }),
      User.countDocuments({ isActive: true, role: "investor" }),
      User.countDocuments({ isActive: true, role: "mentor" }),
      User.countDocuments({ isActive: true, startupName: { $ne: "" } }),
      User.aggregate([{ $project: { matchCount: { $size: "$matches" } } }, { $group: { _id: null, total: { $sum: "$matchCount" } } }]),
    ]);
    res.json({
      totalUsers,
      founders,
      investors,
      mentors,
      startups,
      matches: matchesAgg[0] ? Math.floor(matchesAgg[0].total / 2) : 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getProfile, updateProfile, getMatches, getAllUsers, getStats };