const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },

  mobile: {
    type: String,
    match: /^[0-9]{10}$/,
    required: function () {
      return this.role === "student";
    }
  },

  password: { type: String, required: true },

  // ROLE
  role: {
    type: String,
    enum: ["student", "parent"],
    default: "student"
  },

  // PARENT–STUDENT LINKING
  parentOf: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],

  childOf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  // OTP
  isVerified: { type: Boolean, default: false },
  otp: String,
  otpExpiresAt: Date,

  // PREMIUM
  isPremium: { type: Boolean, default: false },
  premiumPlan: String,
  premiumStartAt: Date,
  premiumExpiresAt: Date,

  // RECEIPT
  receiptUrl: String,
  receiptStatus: {
    type: String,
    enum: ["pending", "approved", "denied"],
    default: "pending"
  },

  // =========================
  // ✅ QUIZ TRACKING ONLY
  // =========================
  services: {
    quiz: {
      attempted: { type: Boolean, default: false },
      totalAttempts: { type: Number, default: 0 },
      bestScore: { type: Number, default: 0 },
      lastAttemptAt: { type: Date, default: null }
    }
  }

}, { timestamps: true });

// PASSWORD HASH
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("User", userSchema);
