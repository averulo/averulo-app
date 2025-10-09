// routes/admin.js
import express from "express";
import { getAnalytics, getAnalyticsTrends, getTopHosts, getTopProperties } from "../controllers/adminController.js";
import { auth } from "../lib/auth.js";
import { prisma } from "../lib/prisma.js";
import { requireRole } from "../lib/roles.js";


const router = express.Router();

// ──────────────────────────────
// ✅ Existing stats route
router.get("/stats", auth(true), requireRole("ADMIN"), async (req, res) => {
  try {
    const [users, properties, bookings, payments, reviews] = await Promise.all([
      prisma.user.count(),
      prisma.property.count(),
      prisma.booking.count(),
      prisma.booking.aggregate({
        where: { paymentStatus: "SUCCESS" },
        _sum: { totalAmount: true },
      }),
      prisma.review.count(),
    ]);

    res.json({
      totalUsers: users,
      totalProperties: properties,
      totalBookings: bookings,
      totalRevenue: payments._sum.totalAmount || 0,
      totalReviews: reviews,
    });
  } catch (err) {
    console.error("[admin:stats]", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// ──────────────────────────────
// 🆕 1. Recent Users
router.get("/recent-users", auth(true), requireRole("ADMIN"), async (req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, email: true, name: true, createdAt: true, role: true, kycStatus: true },
  });
  res.json(users);
});

// 🆕 2. Recent Bookings
router.get("/recent-bookings", auth(true), requireRole("ADMIN"), async (req, res) => {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      property: { select: { id: true, title: true, city: true } },
      guest: { select: { id: true, email: true, name: true } },
    },
  });
  res.json(bookings);
});

// 🆕 3. Recent Reviews
router.get("/recent-reviews", auth(true), requireRole("ADMIN"), async (req, res) => {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      property: { select: { id: true, title: true, city: true } },
      guest: { select: { id: true, email: true, name: true } },
    },
  });
  res.json(reviews);
});

// routes/admin.js
router.get("/notifications", auth(true), requireRole("ADMIN"), async (req, res) => {
  const items = await prisma.notification.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { email: true, role: true } } },
    take: 50
  });
  res.json(items);
});

router.get("/unread-count", auth(true), async (req, res) => {
  const count = await prisma.notification.count({
    where: { userId: req.user.sub, readAt: null }
  });
  res.json({ count });
});

router.get("/analytics", auth(true), requireRole("ADMIN"), getAnalytics);
router.get("/analytics/trends", auth(true), requireRole("ADMIN"), getAnalyticsTrends);
router.get("/top-hosts", auth(true), requireRole("ADMIN"), getTopHosts);
router.get("/top-properties", auth(true), requireRole("ADMIN"), getTopProperties);

export default router;