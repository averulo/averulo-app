import { getTransporter } from "./mailer.js"; // optional email
import { prisma } from "./prisma.js";

export async function createNotification({
  userId,
  type,
  title,
  body,
  data = null,
  emailTo,
  emailSubject,
  emailHtml,
}) {
  const notif = await prisma.notification.create({
    data: { userId, type, title, body: body || null, data },
  });

  // optional sound trigger (for frontend later)
  if (process.env.SOUND_ENABLED === "true") {
    console.log("🔔 Play notification sound (to be handled in frontend)");
  }

  // optional email
  if (emailTo && emailSubject) {
    try {
      const tx = getTransporter?.();
      if (tx) {
        await tx.sendMail({
          from: process.env.EMAIL_FROM || "no-reply@averulo.local",
          to: emailTo,
          subject: emailSubject,
          html: emailHtml || `<p>${body || title}</p>`,
        });
      }
    } catch (err) {
      console.error("Email notif failed:", err.message);
    }
  }

  return notif;
}