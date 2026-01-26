import express from "express";
import { adminOnly } from "../../lib/auth.js";
import { prisma } from "../../lib/prisma.js";

const router = express.Router();

/**
 * ✅ GET /api/admin/payments
 * Paginated, searchable, sortable list of all payments.
 */
router.get("/", adminOnly, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const where = {};

    // 🔍 Search
    if (req.query.search) {
      where.OR = [
        { booking: { property: { title: { contains: req.query.search, mode: "insensitive" } } } },
        { booking: { user: { email: { contains: req.query.search, mode: "insensitive" } } } },
        { id: { contains: req.query.search, mode: "insensitive" } },
      ];
    }

    // 🔄 Status filter
    if (req.query.status) where.status = req.query.status;

    // 🧭 Sort options with validation to prevent Prisma injection
    const allowedSortFields = ["createdAt", "updatedAt", "amount", "status"];
    const sortBy = req.query.sortBy || "createdAt";
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? "asc" : "desc";

    const [items, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [safeSortBy]: sortOrder },
        include: {
          booking: {
            include: { user: true, property: true },
          },
        },
      }),
      prisma.payment.count({ where }),
    ]);

    res.json({
      ok: true,
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("❌ Admin fetch payments failed:", err);
    res.status(500).json({ ok: false, message: "Failed to load payments" });
  }
});

/**
 * ✅ PATCH /api/admin/payments/:id
 * Update payment status (e.g. VERIFIED, REFUNDED).
 */
router.patch("/:id", adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["PENDING", "VERIFIED", "REFUNDED", "FAILED"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ ok: false, message: "Invalid status" });
    }

    const updated = await prisma.payment.update({
      where: { id },
      data: { status },
      include: {
        booking: {
          include: { user: true, property: true },
        },
      },
    });

    res.json({ ok: true, updated });
  } catch (err) {
    console.error("❌ Payment update failed:", err);
    res.status(500).json({ ok: false, message: "Failed to update payment" });
  }
});

/**
 * ✅ DELETE /api/admin/payments/:id
 * Remove a payment record.
 */
router.delete("/:id", adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.payment.delete({ where: { id } });
    res.json({ ok: true, message: "Payment deleted successfully" });
  } catch (err) {
    console.error("❌ Payment delete failed:", err);
    res.status(500).json({ ok: false, message: "Failed to delete payment" });
  }
});

/**
 * ✅ GET /api/admin/payments/summary
 * Summary statistics for the admin dashboard.
 */
router.get("/summary", adminOnly, async (_req, res) => {
  try {
    const [total, verified, refunded, totalRevenue] = await Promise.all([
      prisma.payment.count(),
      prisma.payment.count({ where: { status: "VERIFIED" } }),
      prisma.payment.count({ where: { status: "REFUNDED" } }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: "VERIFIED" },
      }),
    ]);

    res.json({
      ok: true,
      summary: {
        total,
        verified,
        refunded,
        totalRevenue: totalRevenue._sum.amount || 0,
      },
    });
  } catch (err) {
    console.error("❌ Admin payment summary failed:", err);
    res.status(500).json({ ok: false, message: "Failed to load summary" });
  }
});

export default router;