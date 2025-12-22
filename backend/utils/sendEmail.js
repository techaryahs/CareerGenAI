const nodemailer = require("nodemailer");

/**
 * Send Email Utility
 * @param {string} to - receiver email
 * @param {string} subject - email subject
 * @param {string} text - fallback plain text
 * @param {string} html - html content (USE TEMPLATE LITERALS when calling)
 */
const sendEmail = async (to, subject, text = "", html = "") => {
  try {
    // 🔍 Debug (remove in production if needed)
    console.log("📨 Sending email to:", to);

    // ✅ Create transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail App Password
      },
    });

    // ✅ Verify transporter (helps catch auth issues early)
    await transporter.verify();

    // ✅ Compose mail
    const mailOptions = {
      from: `"CareerGenAI Admin" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    };

    // ✅ Send mail
    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully");
    console.log("📧 Message ID:", info.messageId);
  } catch (error) {
    console.error("❌ Email send error:", error);
    throw new Error("Email sending failed");
  }
};

module.exports = sendEmail;
