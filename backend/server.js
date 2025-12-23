const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const ProgressReport = require("./models/ProgressReport");

dotenv.config();
const app = express();

// =======================
// MIDDLEWARE
// =======================
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));


// =======================
// DATABASE
// =======================
mongoose
  .connect(process.env.MONGO_URI)
  // .then(() => ProgressReport.deleteMany({})) // TEMP: Clear progress reports on server start
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// =======================
// ROUTES
// =======================

// TEMP: Clear progress reports on server start

// 🔐 Auth
app.use("/api/auth", require("./routes/auth.routes"));

// 👤 User
app.use("/api/user", require("./routes/user.routes"));

// 🧑‍💼 Admin (receipts, premium, consultants, api-key)
app.use("/api/admin", require("./routes/admin.routes"));

// 🎓 Careers / AI tools
app.use("/api/careers", require("./routes/career.routes"));

// 🤖 Chatbot
app.use("/api/chat", require("./routes/chat.routes"));

// 📅 Booking & Consultants
app.use("/api/bookings", require("./routes/booking.routes"));

app.use("/api/progress", require("./routes/progressRoutes"));

// 🧑‍🎤 Profile (IMPORTANT – WAS MISSING)
app.use("/api", require("./routes/profile.routes"));

// 👪 Parent
// 👨‍👩‍👧 Parent Dashboard
app.use("/api/parent", require("./routes/parent.routes"));

// 👨‍🏫 Teacher
app.use("/api/teacher", require("./routes/teacher.routes"));




// =======================
// HEALTH CHECK (OPTIONAL)
// =======================
app.get("/", (req, res) => {
  res.send("🚀 CareerGenAI Backend is running");
});

// =======================
// GLOBAL ERROR HANDLER (SAFE)
// =======================
app.use((err, req, res, next) => {
  console.error("🔥 Unhandled Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// =======================
// SERVER
// =======================
const PORT = process.env.PORT || 5001;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
