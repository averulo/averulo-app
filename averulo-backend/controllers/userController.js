// controllers/userController.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


/**
 * GET /api/users/kyc/pending
 * Admin-only: Fetch users whose KYC status is 'PENDING'
 */
export const getPendingKycUsers = async (req, res) => {
  try {
    const pendingUsers = await prisma.user.findMany({
      where: { kycStatus: 'PENDING' },
      select: {
        id: true,
        email: true,
        name: true,
        dob: true,
        role: true,
        kycStatus: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json(pendingUsers);
  } catch (error) {
    console.error('Error fetching pending KYC users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
