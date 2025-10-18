const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"ISHAS App" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log(`✅ Email sent to ${to}`);
  } catch (err) {
    console.error("❌ Error sending email:", err);
    throw new Error("Email could not be sent");
  }
};

module.exports = sendEmail;
