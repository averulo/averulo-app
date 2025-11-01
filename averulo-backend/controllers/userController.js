import { createNotification } from "../lib/notifications.js";
import { prisma } from "../lib/prisma.js";

/**
 * GET /api/me
 */
export async function getMe(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.sub },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("getMe failed:", err);
    res.status(500).json({ error: err.message });
  }
}

/**
 * PATCH /api/users/me
 */
export async function updateMe(req, res) {
  try {
    const { name, dob, phone } = req.body;
    const avatarPath = req.file ? `/uploads/avatars/${req.file.filename}` : undefined;

    const updated = await prisma.user.update({
      where: { id: req.user.sub },
      data: {
        ...(name && { name }),
        ...(dob && { dob: new Date(dob) }),
        ...(phone && { phone }),
        ...(avatarPath && { avatar: avatarPath }),
      },
    });

    res.json({ ok: true, user: updated });
  } catch (err) {
    console.error("updateMe failed:", err);
    res.status(500).json({ error: err.message });
  }
}

/**
 * GET /api/users
 */
export async function getAllUsers(req, res) {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    console.error("getAllUsers failed:", err);
    res.status(500).json({ error: err.message });
  }
}

/**
 * PATCH /api/users/:id/kyc
 */
export async function updateKycStatus(req, res) {
  try {
    const { status } = req.body;
    if (!["VERIFIED", "REJECTED"].includes(status)) {
      return res.status(400).json({ error: "Invalid KYC status value" });
    }

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { kycStatus: status },
    });

    await createNotification({
      userId: user.id,
      type: "KYC_UPDATE",
      title:
        status === "VERIFIED"
          ? "KYC Verification Approved ✅"
          : "KYC Verification Rejected ❌",
      body:
        status === "VERIFIED"
          ? "Your KYC documents have been verified successfully."
          : "Your KYC verification was rejected. Please re-upload valid documents.",
      emailTo: user.email,
      emailSubject: `Your KYC status: ${status}`,
    });

    res.json({ ok: true, user });
  } catch (err) {
    console.error("updateKycStatus failed:", err);
    res.status(500).json({ error: err.message });
  }
}

/**
 * GET /api/users/kyc/pending
 */
export async function getPendingKycUsers(req, res) {
  try {
    const pendingUsers = await prisma.user.findMany({
      where: { kycStatus: "PENDING" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        kycStatus: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      count: pendingUsers.length,
      users: pendingUsers,
    });
  } catch (err) {
    console.error("getPendingKycUsers failed:", err);
    res.status(500).json({ error: err.message });
  }
}

/**
 * POST /api/users/kyc/upload
 */
export async function uploadKycDocs(req, res) {
  try {
    const { idType } = req.body;
    if (!idType) return res.status(400).json({ error: "idType is required" });
    if (!req.files?.frontImage || !req.files?.backImage)
      return res.status(400).json({ error: "Both front and back images are required" });

    const frontPath = `/uploads/kyc/${req.files.frontImage[0].filename}`;
    const backPath = `/uploads/kyc/${req.files.backImage[0].filename}`;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.sub },
      data: {
        kycStatus: "PENDING",
        kycType: idType,
        kycFrontUrl: frontPath,
        kycBackUrl: backPath,
      },
    });

    res.json({
      ok: true,
      message: "KYC submitted successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("KYC upload failed:", err);
    res.status(500).json({ error: err.message });
  }
}