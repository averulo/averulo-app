// index.js
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import multer from "multer";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
dotenv.config();
console.log("Loaded SMTP from env:");
console.log("SMTP_USER:", process.env.SMTP_USER);
console.log("SMTP_PASS:", process.env.SMTP_PASS);

import helmet from "helmet";
import morgan from "morgan";
import { auth } from "./lib/auth.js";
import { getTransporter } from "./lib/mailer.js";
import { prisma } from "./lib/prisma.js";
import adminRouter from "./routes/admin.js";
import authRoutes from "./routes/auth.js";
import availabilityRouter from "./routes/availability.js";
import bookingsRouter from "./routes/bookings.js";
import favoritesRouter from "./routes/favorites.js";
import hostRouter from "./routes/host.js";

import notificationsRouter from "./routes/notifications.js";
import paymentsRouter, { paystackWebhook } from "./routes/payments.js";
import propertiesRouter from "./routes/properties.js";
import reviewsRouter from "./routes/reviews.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;
const isDev = process.env.NODE_ENV !== "production";

// Trust Render's proxy headers for rate limiting
app.set('trust proxy', true);
/* ── DEV HELPERS (only in non-prod) ─────────────────────────────────────── */
if (isDev) {
  app.get("/__dev/secret-meta", (_req, res) => {
    const s = process.env.PAYSTACK_SECRET_KEY || "";
    res.json({ len: s.length, tail: s.slice(-6) });
  });

  app.get("/__dev/secret-tail", (_req, res) => {
    const key = process.env.PAYSTACK_SECRET_KEY || "";
    res.json({ tail: key.slice(-6) });
  });

  // compute server-side HMAC of RAW body to compare with your local openssl
  app.post("/__dev/hmac", express.raw({ type: "application/json" }), (req, res) => {
    const secret = process.env.PAYSTACK_SECRET_KEY || "";
    const computed = crypto.createHmac("sha512", secret).update(req.body).digest("hex");
    res.json({ computed, tail: computed.slice(-8), bodyLen: req.body.length });
  });

  // quick sanity of loaded secret (no secret leak)
  app.get("/__dev/keyinfo", (_req, res) => {
    const key = process.env.PAYSTACK_SECRET_KEY || "";
    res.json({ byteLen: Buffer.byteLength(key), tail: key.slice(-6) });
  });
}

/* ── Webhook BEFORE json middleware ─────────────────────────────────────── */
app.post(
  "/api/payments/webhook/paystack",
  express.raw({ type: "application/json" }),
  paystackWebhook
);

/* ── Rest of middleware AFTER webhook ───────────────────────────────────── */
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());

// ensure uploads dir exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// uploads
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = /image\/(png|jpe?g)|application\/pdf/.test(file.mimetype);
    cb(ok ? null : new Error("Invalid file type"), ok);
  },
});

// simple health
app.get("/api/test", (_req, res) => res.json({ message: "Backend is reachable!" }));

// auth helper
const authRequired = auth(true);

// current user
app.get("/api/me", authRequired, async (req, res) => {
  const me = await prisma.user.findUnique({
    where: { id: req.user.sub },
    select: {
      id: true,
      email: true,
      name: true,
      dob: true,
      kycStatus: true,
      role: true,
    },
  });
  res.json(me);
});

// ID upload
app.post(
  "/api/upload-id",
  upload.fields([
    { name: "front", maxCount: 1 },
    { name: "back", maxCount: 1 },
  ]),
  (req, res) => {
    const { email, idType } = req.body;
    const files = req.files || {};
    if (!email || !idType || !files.front?.length) {
      return res.status(400).json({ success: false, message: "Missing fields or files" });
    }
    return res.json({ success: true, message: "ID uploaded", files: Object.keys(files) });
  }
);

// OTP store
const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  validate: { trustProxy: false }, // Disable proxy validation for testing
});
const otpStore = Object.create(null);

// send OTP
app.post("/api/send-otp", otpLimiter, async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: "Email is required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = { code: otp, expires: Date.now() + 10 * 60 * 1000 };

  try {
    const transporter = getTransporter();
    if (transporter) {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || '"Averulo" <no-reply@averulo.local>',
        to: email,
        subject: "Your OTP Code",
        html: `<h3>Your OTP is: ${otp}</h3>`,
      });

      // Include devOtp in development mode
      const response = { success: true, message: "OTP sent!" };
      if (isDev) {
        response.devOtp = otp;
        console.log('🧩 DEV MODE: OTP for', email, ':', otp);
      }
      return res.status(200).json(response);
    }
    throw new Error("SMTP not configured");
  } catch (err) {
    console.warn("Email send failed:", err.message);
    if (isDev) {
      return res.status(200).json({ success: true, message: "OTP (dev mode)", devOtp: otp });
    }
    return res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
});

// verify OTP
app.post("/api/verify-otp", otpLimiter, async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: "Missing email or otp" });

    const rec = otpStore[email];
    if (!rec) return res.status(400).json({ success: false, message: "No OTP found for this email" });
    if (rec.expires < Date.now()) {
      delete otpStore[email];
      return res.status(400).json({ success: false, message: "OTP expired" });
    }
    if (rec.code !== otp) return res.status(400).json({ success: false, message: "Invalid OTP" });

    delete otpStore[email];

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) user = await prisma.user.create({ data: { email, role: "USER" } });

    const token = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );
    console.log("✅ OTP Verified — token:", token);
    return res.json({ success: true, message: "OTP Verified!", token, user });
  } catch (err) {
    console.error("❌ OTP verification error:", err);
    return res.status(500).json({ success: false, message: "Failed to verify OTP", detail: err.message });
  }
});

app.get("/test-email", async (req, res) => {
  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: "yourrealemail@gmail.com",
      subject: "SMTP Test",
      text: "SMTP setup is working 🚀",
    });
    res.send("Email sent!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to send email");
  }
});

app.get("/api/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, status: "healthy" });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get("/api/version", (req, res) => {
  res.json({
    app: "Averulo API",
    version: "1.0.0",
    env: process.env.NODE_ENV || "development",
    build: new Date().toISOString(),
  });
});


// mount routers
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertiesRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/availability", availabilityRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/favorites", favoritesRouter);
app.use("/api/host", hostRouter);
app.use("/api/admin", adminRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/users", userRoutes);
app.use(morgan("dev"));
app.use(helmet());
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 API listening on http://0.0.0.0:${PORT}`);
});