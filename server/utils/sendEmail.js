// server/utils/sendEmail.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com", // default gmail
  port: Number(process.env.EMAIL_PORT) || 465, // Gmail SSL port
  secure: true, // 465 হলে অবশ্যই true দিতে হবে
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail হলে App Password লাগবে
  },
  tls: {
    rejectUnauthorized: false, // self-signed cert issue fix
  },
});

async function sendEmail({ to, subject, html }) {
  try {
    const info = await transporter.sendMail({
      from: `${process.env.EMAIL_USER}`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("❌ Email send error:", err.message);
    throw new Error("Email sending failed");
  }
}

module.exports = sendEmail;
