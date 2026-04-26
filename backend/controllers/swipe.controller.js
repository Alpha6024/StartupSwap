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

    if (me.lookingFor && me.lookingFor.length > 0) {
      query.role = { $in: me.lookingFor };
    }

    const users = await User.find(query)
      .select("-password -swipedLeft -swipedRight -pendingRequests")
      .limit(30);

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET /api/swipe/all ────────────────────────────────────
const getAllUsers = async (req, res) => {
  try {
    const me = await User.findById(req.user._id);

    const users = await User.find({
      _id:      { $ne: me._id },
      isActive: true,
    })
      .select("-password -swipedLeft -swipedRight -pendingRequests")
      .limit(100);

    const shuffled = users.sort(() => Math.random() - 0.5);
    res.json(shuffled);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── POST /api/swipe/right/:targetId ──────────────────────
// Sends a connection request to the target user
const swipeRight = async (req, res) => {
  try {
    const me     = await User.findById(req.user._id);
    const target = await User.findById(req.params.targetId);

    if (!target) return res.status(404).json({ message: "User not found." });

    // Record that I swiped right
    if (!me.swipedRight.map(String).includes(String(target._id))) {
      me.swipedRight.push(target._id);
      await me.save();
    }

    // Add to target's pendingRequests (if not already there and not already matched)
    const alreadyMatched = me.matches.map(String).includes(String(target._id));
    const alreadyPending = target.pendingRequests.map(String).includes(String(me._id));

    if (!alreadyMatched && !alreadyPending) {
      target.pendingRequests.push(me._id);
      await target.save();
    }

    res.json({ sent: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── POST /api/swipe/left/:targetId ───────────────────────
const swipeLeft = async (req, res) => {
  try {
    const me = await User.findById(req.user._id);

    if (!me.swipedLeft.map(String).includes(req.params.targetId)) {
      me.swipedLeft.push(req.params.targetId);
      await me.save();
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET /api/swipe/requests ───────────────────────────────
// Returns all pending incoming connection requests for the logged-in user
const getRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("pendingRequests", "-password -swipedLeft -swipedRight -pendingRequests");
    res.json(user.pendingRequests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── POST /api/swipe/accept/:requesterId ──────────────────
// Accept a connection request → both become matches, remove from pending
const acceptRequest = async (req, res) => {
  try {
    const me       = await User.findById(req.user._id);
    const requester = await User.findById(req.params.requesterId);

    if (!requester) return res.status(404).json({ message: "User not found." });

    // Remove from pending
    me.pendingRequests = me.pendingRequests.filter(
      (id) => String(id) !== String(requester._id)
    );

    // Add to matches (both sides)
    if (!me.matches.map(String).includes(String(requester._id))) {
      me.matches.push(requester._id);
    }
    if (!requester.matches.map(String).includes(String(me._id))) {
      requester.matches.push(me._id);
    }

    // Record that I swiped right on them too (so stats are accurate)
    if (!me.swipedRight.map(String).includes(String(requester._id))) {
      me.swipedRight.push(requester._id);
    }

    await me.save();
    await requester.save();

    res.json({
      success: true,
      matchedUser: {
        _id:       requester._id,
        name:      requester.name,
        avatar:    requester.avatar,
        role:      requester.role,
        expertise: requester.expertise,
        bio:       requester.bio,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── POST /api/swipe/decline/:requesterId ─────────────────
// Decline a connection request → remove from pending
const declineRequest = async (req, res) => {
  try {
    const me = await User.findById(req.user._id);

    me.pendingRequests = me.pendingRequests.filter(
      (id) => String(id) !== String(req.params.requesterId)
    );
    await me.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getFeed, getAllUsers, swipeRight, swipeLeft, getRequests, acceptRequest, declineRequest };
