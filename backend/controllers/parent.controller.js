const User = require("../models/user");

/**
 * GET Parent Dashboard Data
 * Route: GET /api/parent/dashboard
 */
exports.getParentDashboard = async (req, res) => {
  try {
    // 1️⃣ Get logged-in user ID from token
    const parentId = req.user.id;

    // 2️⃣ Fetch parent
    const parent = await User.findById(parentId);

    if (!parent || parent.role !== "parent") {
      return res.status(403).json({
        message: "Access denied. Parent only."
      });
    }

    // 3️⃣ Check linked student
    if (!parent.parentOf || parent.parentOf.length === 0) {
      return res.json({
        profile: null,
        services: {}
      });
    }

    const studentId = parent.parentOf[0];

    // 4️⃣ Fetch student (exclude password)
    const student = await User.findById(studentId).select("-password");

    if (!student) {
      return res.status(404).json({
        message: "Linked student not found"
      });
    }

    // 5️⃣ Send dashboard response
    res.json({
      profile: {
        name: student.name,
        email: student.email,
        mobile: student.mobile || null,
        isPremium: student.isPremium
      },
      services: student.services || {}
    });

  } catch (error) {
    console.error("Parent Dashboard Error:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
};
