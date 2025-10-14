const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET /api/admin/kyc/pending
exports.getPendingKycUsers = async (req, res) => {
  try {
    const pendingUsers = await prisma.user.findMany({
      where: {
        kycStatus: "PENDING",
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        email: true,
        name: true,
        dob: true,
        role: true,
        kycStatus: true,
        createdAt: true,
      },
    });

    res.status(200).json(pendingUsers);
  } catch (error) {
    console.error("Error fetching pending KYC users:", error);
    res.status(500).json({ error: "Server error fetching pending KYC users" });
  }
};
