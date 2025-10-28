import express from "express";
import { PrismaClient } from "@prisma/client";
import { getPendingKycUsers } from "../controllers/userController.js";
import { auth, requireRole } from "../lib/auth.js";

const prisma = new PrismaClient();
const router = express.Router();

// ✅ GET /api/users - Fetch all users
router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// ✅ GET /api/users/kyc/pending - Admin fetch pending KYC users
router.get("/kyc/pending", auth, requireRole("ADMIN"), getPendingKycUsers);

// ✅ PATCH /api/users/:id/kyc - Admin update KYC status
router.patch("/:id/kyc", auth, requireRole("ADMIN"), async (req, res) => {
  const { status } = req.body;
  const userId = Number(req.params.id);

  console.log("PATCH /users/:id/kyc hit");
  console.log("User ID:", userId);
  console.log("Request body:", req.body);

  // ✅ Validate input
  if (!status || !["VERIFIED", "REJECTED"].includes(status)) {
    return res
      .status(400)
      .json({ message: 'Invalid status. Must be "VERIFIED" or "REJECTED"' });
  }

  try {
    // ✅ Check if user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Update user KYC
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { kycStatus: status },
      select: { id: true, email: true, kycStatus: true },
    });

    console.log("✅ Updated user:", updatedUser);
    res.status(200).json({
      message: "KYC status updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error updating KYC:", err);
    res.status(500).json({ error: "Server error while updating KYC" });
  }
});

export default router;
