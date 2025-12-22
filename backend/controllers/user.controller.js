const User = require("../models/user");

exports.getPremiumStatus = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ isPremium: false });
  }

  const isActive =
    user.premiumPlan &&
    new Date(user.premiumExpiresAt) > new Date();

  res.json({ isPremium: isActive });
};

exports.getUserByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });

    if (!user) return res.status(404).json({ message: 'User not found' });

    // ✅ Expiry logic
    if (user.isPremium && user.premiumExpiresAt && new Date() > user.premiumExpiresAt) {
      user.isPremium = false;
      user.premiumPlan = null;
      user.premiumExpiresAt = null;
      await user.save();
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.activatePremium = async (req, res) => {
  try {
    const { email, plan, receiptUrl } = req.body;

    if (!email || !plan) {
      return res.status(400).json({ success: false, message: 'Email and plan are required' });
    }

    const validPlans = ['1month', '2months', '3months'];
    if (!validPlans.includes(plan)) {
      return res.status(400).json({ success: false, message: 'Invalid plan selected' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const now = new Date();
    let expiresAt = new Date(now);

    if (plan === '1month') {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    } else if (plan === '2months') {
      expiresAt.setMonth(expiresAt.getMonth() + 2);
    } else if (plan === '3months') {
      expiresAt.setFullYear(expiresAt.getMonth() + 3);
    }

    user.isPremium = true;
    user.premiumPlan = plan;
    user.premiumStartDate = now;
    user.premiumExpiresAt = expiresAt;
    user.receiptStatus = 'approved';

    if (receiptUrl) {
      user.receiptUrl = receiptUrl;
    }

    await user.save();

    return res.status(200).json({ success: true, user });
  } catch (err) {
    console.error('❌ Premium activation error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Server error during premium activation'
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { userId, name, mobile, email, profileImage } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email is already in use" });
      }
      user.email = email;
    }

    user.name = name || user.name;
    user.mobile = mobile || user.mobile;
    user.profileImage = profileImage || user.profileImage;

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Server error while updating profile" });
  }
};
