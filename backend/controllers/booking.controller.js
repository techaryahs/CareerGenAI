const Booking = require("../models/Booking");
const Consultant = require("../models/Consultant");
const User = require("../models/user");
// const transporter = require("../utils/transporter"); // nodemailer instance
const sendEmail = require("../utils/sendEmail");     // used in bookConsultant

/* =========================
   BOOK CONSULTANT
========================= */
exports.bookConsultant = async (req, res) => {
  try {
    const {
      consultantId,
      consultantEmail,
      consultantName,
      date,
      time,
      userEmail,
      userPhone,
      userName,
      userId,
      consultantType,
      userPlan
    } = req.body;

    if (!consultantId || !consultantEmail || !date || !time || !userEmail || !userPhone) {
      return res.status(400).json({ message: 'Missing required data' });
    }

    if (consultantType === "Premium" && userPlan !== "Premium") {
      return res.status(403).json({
        message: "This counselor is available only for Premium Users."
      });
    }

    if (userPlan !== "Premium") {
      const todayBooking = await Booking.findOne({ userEmail, date });
      if (todayBooking) {
        return res.status(403).json({
          message: "Free users can book only 1 consultation per day."
        });
      }
    }

    const alreadyBooked = await Booking.findOne({ consultantId, date, time });
    if (alreadyBooked) {
      return res.status(400).json({ message: 'Slot already booked' });
    }

    const booking = await Booking.create({
      consultantId,
      consultantEmail,
      consultantName,
      date,
      time,
      userEmail,
      userName,
      userPhone,
      userId,
      consultantType,
      userPlan
    });

    await sendEmail(
      userEmail,
      "Your CareerGenAI Consultation is Confirmed",
      "",
      `<p>Your appointment with <b>${consultantName}</b> is confirmed.</p>
       <p>Date: <b>${date}</b></p>
       <p>Time: <b>${time}</b></p>`
    );

    await sendEmail(
      consultantEmail,
      "New Consultation Booking",
      "",
      `<p>You have a new booking from <b>${userName}</b>.</p>`
    );

    await sendEmail(
      process.env.ADMIN_NOTIFY_TO,
      "New Consultation Booking (Admin Copy)",
      "",
      `<p>User: ${userName} (${userEmail})</p>`
    );

    res.json({ message: "Booking successful", booking });

  } catch (err) {
    console.error("❌ Booking error:", err.message);
    res.status(500).json({ message: "Server error. Could not complete booking." });
  }
};

/* =========================
   GET BOOKED SLOTS
========================= */
exports.getBookedSlots = async (req, res) => {
  try {
    const { consultantId, date } = req.query;
    if (!consultantId || !date) {
      return res.status(400).json({ message: 'Missing consultantId or date' });
    }

    const bookings = await Booking.find({ consultantId, date });
    const bookedTimes = bookings.map(b => b.time);

    res.json({ bookedTimes });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

/* =========================
   USER COUNSELLING HISTORY
========================= */
exports.getUserCounselling = async (req, res) => {
  try {
    const bookings = await Booking.find({ userEmail: req.params.email })
      .sort({ date: -1 });

    res.json({ bookings });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

/* =========================
   CONSULTANTS LIST
========================= */
exports.getAllConsultants = async (req, res) => {
  const consultants = await Consultant.find({});
  res.json({ consultants });
};

/* =========================
   CONSULTANT BOOKINGS
========================= */
exports.getConsultantBookings = async (req, res) => {
  const bookings = await Booking.find({ consultantId: req.params.consultantId })
    .sort({ date: 1, time: 1 });
  res.json(bookings);
};

/* =========================
   ACCEPT BOOKING (EMAIL)
========================= */
exports.acceptBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = "accepted";
    await booking.save();

    const user = await User.findOne({ email: booking.userEmail });

    await transporter.sendMail({
      from: `"Career GenAI" <${process.env.EMAIL_USER}>`,
      to: booking.userEmail,
      subject: "✅ Appointment Accepted",
      html: `<p>Hello ${user?.name || "User"}, your booking is accepted.</p>`
    });

    res.json({ message: "Booking accepted and email sent", booking });

  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   REJECT BOOKING (EMAIL)
========================= */
exports.rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = "rejected";
    await booking.save();

    const user = await User.findOne({ email: booking.userEmail });

    await transporter.sendMail({
      from: `"Career GenAI" <${process.env.EMAIL_USER}>`,
      to: booking.userEmail,
      subject: "❌ Appointment Rejected",
      html: `<p>Hello ${user?.name || "User"}, your booking was rejected.</p>`
    });

    res.json({ message: "Booking rejected and email sent", booking });

  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
