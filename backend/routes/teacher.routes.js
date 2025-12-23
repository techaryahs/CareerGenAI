const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// Teacher-specific routes
router.post("/register-teacher", authController.registerTeacher);
// Future: GET /teacher/:id - Get teacher profile
// Future: PUT /teacher/:id - Update teacher profile

module.exports = router;
