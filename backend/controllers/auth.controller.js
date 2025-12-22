const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");                 // ✅ REQUIRED
const User = require("../models/user");
const Consultant = require("../models/Consultant"); // ✅ REQUIRED

// ✅ OTP Store (move to top for safety)
const otpStore = new Map();

/* =========================
   REGISTER
========================= */
exports.register = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    // 🔍 Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 👤 Create user
    const newUser = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
      role: "student",
      isPremium: false,
      isVerified: false,
    });

    await newUser.save();

    // 🔢 Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, otp);

    console.log("📌 Generated OTP:", otp); // DEBUG

    // 📧 Send OTP email (IMPORTANT PART)
    await sendEmail(
      email,
      "Verify Your Email - CareerGenAI",
      "",
      `
      <div style="max-width:600px;margin:auto;font-family:Arial,sans-serif;
                  background:#ffffff;border-radius:10px;
                  box-shadow:0 10px 25px rgba(0,0,0,0.1);overflow:hidden;">

        <div style="background:#1e40af;padding:20px;text-align:center;color:white;">
          <h1 style="margin:0;">CareerGenAI</h1>
          <p style="margin:5px 0;font-size:14px;">AI Powered Career Guidance</p>
        </div>

        <div style="padding:30px;color:#0f172a;">
          <h2>Hello ${name}, 👋</h2>

          <p>
            Thank you for registering with <b>CareerGenAI</b>.
            Please use the OTP below to verify your email address.
          </p>

          <div style="text-align:center;margin:30px 0;">
            <span style="
              display:inline-block;
              padding:15px 30px;
              font-size:28px;
              letter-spacing:6px;
              background:#f1f5f9;
              border-radius:8px;
              color:#1e40af;
              font-weight:bold;">
              ${otp}
            </span>
          </div>

          <p style="font-size:14px;">
            ⏰ This OTP is valid for <b>5 minutes</b>.
          </p>

          <p style="font-size:14px;color:#64748b;">
            If you didn’t request this, you can safely ignore this email.
          </p>

          <hr style="margin:30px 0;" />

          <p style="font-size:12px;color:#94a3b8;">
            © ${new Date().getFullYear()} CareerGenAI. All rights reserved.
          </p>
        </div>
      </div>
      `
    );

    res.status(200).json({
      message: "OTP sent to email successfully",
      email,
    });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


/* =========================
   VERIFY OTP
========================= */
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const storedOtp = otpStore.get(email);

  if (storedOtp === otp) {
    await User.findOneAndUpdate({ email }, { isVerified: true });
    otpStore.delete(email);
    res.json({ message: 'OTP verified successfully' });
  } else {
    res.status(400).json({ error: 'Invalid or expired OTP' });
  }
};

/* =========================
   LOGIN
========================= */
exports.login = async (req, res) => {
  try {
    // 🔥 NORMALIZE INPUT (CRITICAL FIX)
    const email = req.body.email?.toLowerCase().trim();
    const password = req.body.password?.trim();

    // =========================
    // 0️⃣ BASIC VALIDATION
    // =========================
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // =========================
    // 1️⃣ FIND USER (STUDENT / PARENT)
    // =========================
    const user = await User.findOne({ email });

    // =========================
    // 2️⃣ FIND CONSULTANT (IF NOT USER)
    // =========================
    const consultant = !user ? await Consultant.findOne({ email }) : null;

    const account = user || consultant;
    if (!account) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // =========================
    // 3️⃣ PASSWORD CHECK (FIXED)
    // =========================
    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // =========================
    // 🚨 EMAIL VERIFICATION CHECK
    // =========================
    if (user && user.isVerified === false) {
      return res.status(403).json({
        error: "Email not verified. Please verify OTP first."
      });
    }

    // =========================
    // 4️⃣ ROLE RESOLUTION
    // =========================
    const role = user ? user.role : "consultant";

    // =========================
    // 5️⃣ JWT TOKEN
    // =========================
    const token = jwt.sign(
      { userId: account._id, role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // =========================
    // 6️⃣ FINAL RESPONSE
    // =========================
    res.json({
      message: "Login successful",
      token,
      user: {
        _id: account._id,
        name: account.name,
        email: account.email,
        role,
        isPremium: account.isPremium || false,
        premiumPlan: account.premiumPlan || null,
        premiumStartAt: account.premiumStartAt || null,
        premiumExpiresAt: account.premiumExpiresAt || null,
        ...(role !== "consultant" && {
          mobile: account.mobile || null,
          childOf: account.childOf || null,
          parentOf: account.parentOf || []
        })
      }
    });

  } catch (err) {
    console.error("🔥 Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


/* =========================
   FORGOT PASSWORD
========================= */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"CareerGenAI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 Reset Your Password - CareerGenAI",
      html: `...YOUR FULL HTML EXACTLY AS-IS...`,
    });

    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("Forgot password error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

/* =========================
   VERIFY FORGOT OTP
========================= */
exports.verifyForgotOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const otpData = otpStore.get(email);

    if (!otpData) {
      return res.status(400).json({ error: "OTP not found or expired" });
    }

    if (Date.now() > otpData.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ error: "OTP expired" });
    }

    if (otpData.otp !== otp.trim()) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error("Verify OTP error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

/* =========================
   RESET PASSWORD
========================= */
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const otpData = otpStore.get(email);

    if (!otpData) {
      return res.status(400).json({ error: "OTP not found or expired" });
    }

    if (Date.now() > otpData.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ error: "OTP expired" });
    }

    if (otpData.otp !== otp.trim()) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    otpStore.delete(email);
    res.status(200).json({ message: "Password updated successfully" });

  } catch (err) {
    console.error("Reset password error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};


exports.registerParent = async (req, res) => {
  try {
    const { parentName, email, password, studentId } = req.body;

    if (!parentName || !email || !password || !studentId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // 🔒 Parent already exists?
    const existingParent = await User.findOne({ email });
    if (existingParent) {
      return res.status(400).json({ error: "Parent email already registered" });
    }

    // 🔍 Student validation
    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      return res.status(404).json({ error: "Invalid student account" });
    }

    // ✅ Create parent
    const parent = new User({
      name: parentName,
      email,
      password,          // hashed by pre-save hook
      role: "parent",
      parentOf: [student._id]
    });

    await parent.save();

    // ✅ Link student → parent
    student.childOf = parent._id;
    await student.save();

    res.status(201).json({
      message: "Parent registered and linked successfully",
      parentId: parent._id
    });

  } catch (error) {
    console.error("❌ Parent Registration Error:", error.message);
    res.status(500).json({ error: "Server error while registering parent" });
  }
};

