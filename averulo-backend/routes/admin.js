import express from "express";
import {
  getAnalytics,
  getAnalyticsTrends,
  getTopHosts,
  getTopProperties,
} from "../controllers/adminController.js";
import { auth } from "../lib/auth.js";
import { prisma } from "../lib/prisma.js";
import { requireRole } from "../lib/roles.js";

const router = express.Router();

// ──────────────────────────────
// ✅ 1. Admin stats
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
// 2. Recent data
router.get("/recent-users", auth(true), requireRole("ADMIN"), async (req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      role: true,
      kycStatus: true,
    },
  });
  res.json(users);
});

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

// ──────────────────────────────
// 3. Notifications
router.get("/notifications", auth(true), requireRole("ADMIN"), async (req, res) => {
  const items = await prisma.notification.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { email: true, role: true } } },
    take: 50,
  });
  res.json(items);
});

router.get("/unread-count", auth(true), async (req, res) => {
  const count = await prisma.notification.count({
    where: { userId: req.user.sub, readAt: null },
  });
  res.json({ count });
});

// ──────────────────────────────
// 4. Analytics
router.get("/analytics", auth(true), requireRole("ADMIN"), getAnalytics);
router.get("/analytics/trends", auth(true), requireRole("ADMIN"), getAnalyticsTrends);
router.get("/top-hosts", auth(true), requireRole("ADMIN"), getTopHosts);
router.get("/top-properties", auth(true), requireRole("ADMIN"), getTopProperties);

// ──────────────────────────────
// 5. KYC Routes
router.get("/kyc/pending", auth(true), requireRole("ADMIN"), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { kycStatus: "PENDING" },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        kycType: true,
        kycFrontUrl: true,
        kycBackUrl: true,
        createdAt: true,
      },
    });
    res.json({ ok: true, users });
  } catch (err) {
    console.error("[admin:kyc-pending]", err);
    res.status(500).json({ ok: false, error: "Failed to fetch pending KYCs" });
  }
});

// ✅ PATCH /kyc/:userId (approve/reject)
router.patch("/kyc/:userId", auth(true), requireRole("ADMIN"), async (req, res) => {
  const { userId } = req.params;
  const { action } = req.body;

  if (!["APPROVE", "REJECT"].includes(action))
    return res.status(400).json({ ok: false, message: "Invalid action" });

  const newStatus = action === "APPROVE" ? "VERIFIED" : "REJECTED";

  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { kycStatus: newStatus },
      select: { id: true, email: true, name: true, kycStatus: true },
    });

    // 📨 Optional: Notify user
    await prisma.notification.create({
      data: {
        userId,
        type: "KYC_UPDATE",
        title:
          action === "APPROVE"
            ? "Your KYC has been approved 🎉"
            : "Your KYC has been rejected ❌",
        body:
          action === "APPROVE"
            ? "You can now access host and booking features."
            : "Please re-upload valid ID documents for review.",
      },
    });

    res.json({ ok: true, user: updated });
  } catch (err) {
    console.error("[admin:kyc-update]", err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

// ✅ VERIFIED
router.get("/kyc/verified", auth(true), requireRole("ADMIN"), async (req, res) => {
  const users = await prisma.user.findMany({
    where: { kycStatus: "VERIFIED" },
    orderBy: { createdAt: "desc" },
  });
  res.json({ ok: true, users });
});

// ✅ REJECTED
router.get("/kyc/rejected", auth(true), requireRole("ADMIN"), async (req, res) => {
  const users = await prisma.user.findMany({
    where: { kycStatus: "REJECTED" },
    orderBy: { createdAt: "desc" },
  });
  res.json({ ok: true, users });
});


// 📊 Admin Analytics Trends
router.get("/analytics/trends", auth(true), requireRole("ADMIN"), async (req, res) => {
  try {
    // Group data by month (YYYY-MM)
    const users = await prisma.user.groupBy({
      by: ["createdAt"],
      _count: { _all: true },
    });

    const bookings = await prisma.booking.groupBy({
      by: ["createdAt"],
      _count: { _all: true },
    });

    const payments = await prisma.payment.groupBy({
      by: ["createdAt"],
      _sum: { amount: true },
    });

    // Helper to convert raw timestamps to YYYY-MM buckets
    const formatMonthly = (data, key = "_count") => {
      const grouped = {};
      data.forEach((r) => {
        const month = r.createdAt.toISOString().slice(0, 7); // e.g. 2025-11
        grouped[month] = (grouped[month] || 0) + (r[key]?._all || r[key]?.amount || 0);
      });
      return Object.entries(grouped).map(([month, value]) => ({
        month,
        value,
      }));
    };

    res.json({
      ok: true,
      trends: {
        users: formatMonthly(users),
        bookings: formatMonthly(bookings),
        revenue: formatMonthly(payments, "_sum"),
      },
    });
  } catch (err) {
    console.error("[admin:analytics-trends]", err);
    res.status(500).json({ ok: false, error: "Failed to compute trends" });
  }
});

// ✅ Summary Stats Endpoint
router.get("/analytics/summary", auth(true), async (req, res) => {
  try {
    // Ensure only ADMIN can access
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ ok: false, message: "Forbidden" });
    }

    const [users, properties, bookings, revenue] = await Promise.all([
      prisma.user.count(),
      prisma.property.count(),
      prisma.booking.count(),
      prisma.payment.aggregate({
        _sum: { amount: true },
      }),
    ]);

    res.json({
      ok: true,
      summary: {
        totalUsers: users,
        totalProperties: properties,
        totalBookings: bookings,
        totalRevenue: revenue._sum.amount || 0,
      },
    });
  } catch (err) {
    console.error("[admin/analytics/summary]", err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

// ──────────────────────────────────────────────
// ADMIN DATA LISTS
// ──────────────────────────────────────────────
router.get("/users", auth(true), async (req, res) => {
  if (req.user.role !== "ADMIN") return res.status(403).json({ message: "Forbidden" });

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });
  res.json({ ok: true, users });
});

router.get("/properties", auth(true), async (req, res) => {
  if (req.user.role !== "ADMIN") return res.status(403).json({ message: "Forbidden" });

  const properties = await prisma.property.findMany({
    orderBy: { createdAt: "desc" },
    include: { host: { select: { email: true, name: true } } },
  });
  res.json({ ok: true, properties });
});

router.get("/bookings", auth(true), async (req, res) => {
  if (req.user.role !== "ADMIN") return res.status(403).json({ message: "Forbidden" });

  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { property: { select: { title: true } }, user: { select: { email: true } } },
  });
  res.json({ ok: true, bookings });
});

router.get("/payments", auth(true), async (req, res) => {
  if (req.user.role !== "ADMIN") return res.status(403).json({ message: "Forbidden" });

  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: { booking: { select: { id: true } } },
  });
  res.json({ ok: true, payments });
});

export default router;