// index.js (CommonJS, aligned with controllers/routes we prepped)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const bookingRoutes = require('./routes/bookings');

const app = express();
const PORT = process.env.PORT || 4000;

// ---------- Middleware ----------
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Basic rate-limit for OTP endpoints (reduce abuse)
const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5,                  // 5 requests per window per IP
});

// ---------- Health ----------
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// ---------- File Upload (KYC/ID) ----------
const upload = multer({ dest: process.env.UPLOADS_DIR || 'uploads/' });
// Accept two files: front/back
app.post('/api/upload-id', upload.fields([
  { name: 'front', maxCount: 1 },
  { name: 'back',  maxCount: 1 }
]), (req, res) => {
  const { email, idType } = req.body;
  const files = req.files || {};
  if (!email || !idType || !files.front) {
    return res.status(400).json({ success: false, message: 'Missing required fields or files.' });
  }
  // TODO: persist metadata in DB (userId, idType, file paths)
  return res.json({ success: true, message: 'ID uploaded successfully!' });
});

// ---------- OTP (email) ----------
const otpStore = new Map(); // TODO: use Redis in production

function setOtp(email, code, ttlMs) {
  otpStore.set(email, { code, expires: Date.now() + ttlMs });
}
function getOtp(email) {
  return otpStore.get(email);
}
function clearOtp(email) {
  otpStore.delete(email);
}

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: EMAIL_USER, pass: EMAIL_PASS },
});

// Send OTP
app.post('/api/send-otp', otpLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const ttlMinutes = Number(process.env.OTP_TTL_MINUTES || 5);
    setOtp(email, otp, ttlMinutes * 60 * 1000);

    await transporter.sendMail({
      from: `"Averulo" <${EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP Code',
      html: `<p>Your OTP is:</p><h2>${otp}</h2><p>Valid for ${ttlMinutes} minutes.</p>`,
    });

    return res.json({ success: true, message: 'OTP sent' });
  } catch (err) {
    console.error('send-otp error:', err);
    return res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
});

// Verify OTP
app.post('/api/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ success: false, message: 'Missing email or otp' });

  const record = getOtp(email);
  if (!record) return res.status(400).json({ success: false, message: 'No OTP for this email' });
  if (record.expires < Date.now()) {
    clearOtp(email);
    return res.status(400).json({ success: false, message: 'OTP expired' });
  }
  if (record.code !== otp) return res.status(400).json({ success: false, message: 'Invalid OTP' });

  clearOtp(email);
  return res.json({ success: true, message: 'OTP Verified' });
});

// ---------- Core MVP Routes ----------
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);

// ---------- Start ----------
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API running on http://localhost:${PORT}`);
});