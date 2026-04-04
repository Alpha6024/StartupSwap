const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },

    // Profile
    avatar:   { type: String, default: "" },
    bio:      { type: String, maxlength: 300, default: "" },
    location: { type: String, default: "" },
    age:      { type: Number, default: null },

    // Role & discovery
    role: {
      type: String,
      enum: ["founder", "co-founder", "investor", "mentor", "employee"],
      required: true,
    },
    lookingFor: [
      {
        type: String,
        enum: ["founder", "co-founder", "investor", "mentor", "employee"],
      },
    ],

    // Skills & expertise
    skills:    [{ type: String }],
    expertise: { type: String, default: "" },
    industries:[{ type: String }],

    // Startup info
    startupName:        { type: String, default: "" },
    startupStage: {
      type: String,
      enum: ["idea", "mvp", "early-stage", "growth", "scale", "none"],
      default: "none",
    },
    startupDescription: { type: String, default: "" },

    // Documents
    resumeUrl: { type: String, default: "" },

    // Social links
    linkedin: { type: String, default: "" },
    github:   { type: String, default: "" },
    website:  { type: String, default: "" },

    // Swipe tracking
    swipedRight: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    swipedLeft:  [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    matches:     [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    isActive:   { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);