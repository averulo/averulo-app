// test-mailtrap.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "892afe0c4f30df",   // 🔑 your Mailtrap SMTP user
    pass: "f340dd89d78b0e",  // 🔑 your Mailtrap SMTP pass
  },
});

async function test() {
  try {
    const info = await transporter.sendMail({
      from: '"Averulo Test" <no-reply@averulo.test>',
      to: "yourreal@email.com", // change to your real email
      subject: "Hello",
      text: "This is a test",
    });
    console.log("✅ Sent:", info.messageId);
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

test();