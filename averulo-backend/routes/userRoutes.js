import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import {
  getAllUsers,
  getMe,
  getPendingKycUsers,
  updateKycStatus,
  updateMe,
  uploadKycDocs,
} from "../controllers/userController.js";
import { auth } from "../lib/auth.js";
import { requireRole } from "../lib/roles.js";
import { kycUpload } from "../lib/upload.js";


console.log("✅ userRoutes.js loaded");

const router = express.Router();

// 📂 Ensure uploads/avatars folder exists
const uploadDir = "uploads/avatars";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// 🖼 Multer storage for avatar uploads
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user.sub}-${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

/**
 * 👤 GET /api/users/me
 * Get logged-in user info
 */
router.get("/me", auth(true), getMe);

/**
 * ✏️ PATCH /api/users/me
 * Update profile details (name, dob, phone, avatar)
 */
router.patch("/me", auth(true), upload.single("avatar"), updateMe);

/**
 * 👥 GET /api/users
 * Admin: fetch all users
 */
router.get("/", auth(true), requireRole("ADMIN"), getAllUsers);

/**
 * 🧾 PATCH /api/users/:id/kyc
 * Admin: verify or reject user KYC
 */
router.patch("/:id/kyc", auth(true), requireRole("ADMIN"), updateKycStatus);

/**
 * 🕵️ GET /api/users/kyc/pending
 * Admin: list all pending KYC users
 */
router.get("/kyc/pending", auth(true), requireRole("ADMIN"), getPendingKycUsers);

/**
 * 📸 POST /api/users/kyc/upload
 * User uploads KYC front/back images + idType
 */
router.post(
  "/kyc/upload",
  auth(true),
  kycUpload.fields([
    { name: "frontImage", maxCount: 1 },
    { name: "backImage", maxCount: 1 },
  ]),
  uploadKycDocs
);

export default router;