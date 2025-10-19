// routes/userRoutes.js
import express from "express";
import { auth } from "../lib/auth.js";
import { createNotification } from "../lib/notifications.js";
import { prisma } from "../lib/prisma.js";
import { requireRole } from "../lib/roles.js";

/**
 * GET /api/users
 * (Optional: admin use)
 */
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { getPendingKycUsers } = require('../controllers/userController');
const { auth, requireRole } = require('../middleware/auth');
const prisma = new PrismaClient();
const router = express.Router();

// Assuming auth and requireRole are imported from a middleware file, e.g.:
// const { auth, requireRole } = require('../middleware/auth');

// GET / - Fetch all users
router.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});


/**
 * PATCH /api/users/me
 * Authenticated user updates their own profile
 */
router.patch("/me", auth(true), async (req, res) => {
  try {
    const { name, dob, phone } = req.body;

    const updated = await prisma.user.update({
      where: { id: req.user.sub },
      data: {
        ...(name && { name }),
        ...(dob && { dob: new Date(dob) }),
        ...(phone && { phone }),
      },
    });

    res.json({ ok: true, user: updated });
  } catch (err) {
    console.error("Profile update failed:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * PATCH /api/users/:id/kyc
 * Admin can verify or reject a user's KYC
 */
router.patch("/:id/kyc", auth(true), requireRole("ADMIN"), async (req, res) => {
  try {
    const { status } = req.body;
    if (!["VERIFIED", "REJECTED"].includes(status)) {
      return res.status(400).json({ error: "Invalid KYC status value" });
    }

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { kycStatus: status },
    });

    // 🔔 Create notification
    await createNotification({
      userId: user.id,
      type: "KYC_UPDATE",
      title:
        status === "VERIFIED"
          ? "KYC Verification Approved ✅"
          : "KYC Verification Rejected ❌",
      body:
        status === "VERIFIED"
          ? "Your KYC documents have been successfully verified."
          : "Your KYC verification was rejected. Please re-upload valid documents.",
      emailTo: user.email,
      emailSubject: `Your KYC status: ${status}`,
    });

    res.json({ ok: true, user });
  } catch (err) {
    console.error("KYC update failed:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

// PATCH /:id/kyc - Update user KYC status (admin only)
router.patch("/:id/kyc", auth, requireRole("ADMIN"), async (req, res) => {
  const { kycStatus } = req.body;

  // Route: GET /api/users/kyc/pending
router.get('/kyc/pending', auth, requireRole('ADMIN'), getPendingKycUsers);


  // Validate kycStatus
  if (!kycStatus || !["VERIFIED", "REJECTED"].includes(kycStatus)) {
    return res.status(400).json({ message: 'Invalid kycStatus: Must be "VERIFIED" or "REJECTED"' });
  }

  try {
    const userId = Number(req.params.id);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { kycStatus },
      select: { id: true, email: true, kycStatus: true },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;