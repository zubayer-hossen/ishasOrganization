// utils/sendEmail.js
const nodemailer = require("nodemailer");

const getMailConfig = () => {
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
  const port = process.env.SMTP_PORT || process.env.EMAIL_PORT;
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  const secure =
    (process.env.SMTP_SECURE === "true") ||
    (process.env.EMAIL_SECURE === "true") ||
    (Number(port) === 465);

  if (!host || !port || !user || !pass) {
    throw new Error(
      "Missing SMTP config. Set SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS or EMAIL_HOST/EMAIL_PORT/EMAIL_USER/EMAIL_PASS"
    );
  }

  return { host, port: Number(port), secure, auth: { user, pass } };
};

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const config = getMailConfig();
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth,
    });

    // verify transport to surface config/auth errors early
    await transporter.verify();

    const info = await transporter.sendMail({
      from: `"ISHAS App" <${config.auth.user}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("❌ sendEmail error:", err && err.message ? err.message : err);
    // rethrow so callers can handle/log as needed
    throw err;
  }
};

module.exports = sendEmail;
