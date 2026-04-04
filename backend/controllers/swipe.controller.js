const User = require("../db/model");

// ── GET /api/swipe/feed ───────────────────────────────────
const getFeed = async (req, res) => {
  try {
    const me = await User.findById(req.user._id);

    const excludeIds = [
      me._id,
      ...me.swipedRight,
      ...me.swipedLeft,
      ...me.matches,
    ];

    const query = {
      _id:      { $nin: excludeIds },
      isActive: true,
    };

    // Filter by roles the user is looking for
    if (me.lookingFor && me.lookingFor.length > 0) {
      query.role = { $in: me.lookingFor };
    }

    const users = await User.find(query)
      .select("-password -swipedLeft -swipedRight")
      .limit(30);

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── POST /api/swipe/right/:targetId ──────────────────────
const swipeRight = async (req, res) => {
  try {
    const me     = await User.findById(req.user._id);
    const target = await User.findById(req.params.targetId);

    if (!target) return res.status(404).json({ message: "User not found." });

    // Record swipe
    if (!me.swipedRight.includes(target._id)) {
      me.swipedRight.push(target._id);
      await me.save();
    }

    // Check mutual interest
    const isMatch = target.swipedRight.some(
      (id) => id.toString() === me._id.toString()
    );

    if (isMatch) {
      if (!me.matches.includes(target._id)) {
        me.matches.push(target._id);
        await me.save();
      }
      if (!target.matches.includes(me._id)) {
        target.matches.push(me._id);
        await target.save();
      }

      return res.json({
        match: true,
        matchedUser: {
          _id:       target._id,
          name:      target.name,
          avatar:    target.avatar,
          role:      target.role,
          expertise: target.expertise,
          bio:       target.bio,
        },
      });
    }

    res.json({ match: false });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── POST /api/swipe/left/:targetId ───────────────────────
const swipeLeft = async (req, res) => {
  try {
    const me = await User.findById(req.user._id);

    if (!me.swipedLeft.includes(req.params.targetId)) {
      me.swipedLeft.push(req.params.targetId);
      await me.save();
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getFeed, swipeRight, swipeLeft };