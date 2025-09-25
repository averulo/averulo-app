// routes/host.js
import express from "express";
import { auth } from "../lib/auth.js";
import { prisma } from "../lib/prisma.js";

const router = express.Router();

// tiny helper
const iso = (d) => new Date(d).toISOString().slice(0, 10);

function parseWindow(req) {
  // default = Year-To-Date (host local time not guaranteed; good enough for dev)
  const now = new Date();
  const ytdStart = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
  const from = req.query.from ? new Date(req.query.from.toString()) : ytdStart;
  const to   = req.query.to   ? new Date(req.query.to.toString())   : now;
  return { from, to };
}

/**
 * GET /api/host/stats
 * - HOST: stats for themselves
 * - ADMIN: can pass ?hostId=<id> to view a specific host
 * Query:
 *   from=YYYY-MM-DD (optional, default = Jan 1 of this year)
 *   to=YYYY-MM-DD   (optional, default = today)
 */
router.get("/stats", auth(true), async (req, res) => {
  try {
    const role = req.user?.role;
    const hostId = role === "ADMIN" && req.query.hostId
      ? req.query.hostId.toString()
      : req.user.sub; // HOST sees own stats

    // sanity: ensure host exists for ADMIN lookups
    if (role === "ADMIN" && req.query.hostId) {
      const exists = await prisma.user.findUnique({ where: { id: hostId }, select: { id: true } });
      if (!exists) return res.status(404).json({ error: "Host not found" });
    }

    const { from, to } = parseWindow(req);

    // counts done in parallel
    const [propertiesCount, upcomingBookingsCount] = await Promise.all([
      prisma.property.count({
        where: { hostId, status: { in: ["ACTIVE", "DRAFT", "INACTIVE"] } },
      }),
      prisma.booking.count({
        where: {
          property: { hostId },
          status: "APPROVED",
          startDate: { gte: new Date() },
        },
      }),
    ]);

    // revenue (SUCCESS payments in window)
    const revenueAgg = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        status: "SUCCESS",
        createdAt: { gte: from, lte: to },
        booking: { property: { hostId } },
      },
    });
    const revenueKobo = revenueAgg._sum.amount ?? 0;

    // revenue by month (YYYY-MM) – simple JS bucketing
    const payments = await prisma.payment.findMany({
      where: {
        status: "SUCCESS",
        createdAt: { gte: from, lte: to },
        booking: { property: { hostId } },
      },
      select: { amount: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    const byMonthMap = new Map(); // "2025-02" -> kobo
    for (const p of payments) {
      const d = new Date(p.createdAt);
      const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
      byMonthMap.set(key, (byMonthMap.get(key) ?? 0) + (p.amount ?? 0));
    }
    const revenueByMonth = [...byMonthMap.entries()].map(([month, kobo]) => ({ month, kobo }));

    return res.json({
      hostId,
      window: { from: iso(from), to: iso(to) },
      propertiesCount,
      upcomingBookingsCount,
      revenue: {
        currency: "NGN",
        kobo: revenueKobo,
        naira: Math.round(revenueKobo) / 100,
        byMonth: revenueByMonth, // [{ month: "2025-01", kobo: 123000 }]
      },
    });
  } catch (err) {
    console.error("[/api/host/stats] error:", err);
    res.status(500).json({ error: "Failed to load stats", detail: err.message });
  }
});

export default router;