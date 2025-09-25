import nodemailer from "nodemailer";

export function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const port = Number(process.env.SMTP_PORT || 587);

  if (host && user && pass) {
    console.log("📦 Creating transporter with:", { host, user, port, pass: "****" });

    return nodemailer.createTransport({
      host,
      port,
      secure: false, // STARTTLS on 587/2525
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
    });
  }

  console.warn("❌ Missing SMTP config");
  return null;
}