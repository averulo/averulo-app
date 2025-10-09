const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = express.Router();

// Assuming auth and requireRole are imported from a middleware file, e.g.:
// const { auth, requireRole } = require('../middleware/auth');

// GET / - Fetch all users
router.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// PATCH /:id/kyc - Update user KYC status (admin only)
router.patch("/:id/kyc", auth, requireRole("ADMIN"), async (req, res) => {
  const { kycStatus } = req.body;

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