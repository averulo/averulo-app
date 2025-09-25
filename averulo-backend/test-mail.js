import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function testMail() {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: "test@example.com",
      subject: "✅ Test Email from Averulo Backend",
      html: "<h2>Success! Mailtrap SMTP is working!</h2>",
    });
    console.log("✅ Test mail sent!", info.messageId);
  } catch (err) {
    console.error("❌ Error sending test mail:", err.message);
  }
}

testMail();