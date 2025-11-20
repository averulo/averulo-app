import express from "express";
import { adminOnly } from "../../lib/auth.js";
import { prisma } from "../../lib/prisma.js";

const router = express.Router();

// ✅ GET all bookings (with pagination, search, and sort)
router.get("/", adminOnly, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const where = {};

    // 🔍 Search filters
    if (req.query.search) {
      where.OR = [
        { property: { title: { contains: req.query.search, mode: "insensitive" } } },
        { user: { email: { contains: req.query.search, mode: "insensitive" } } },
      ];
    }

    if (req.query.status) {
      where.status = req.query.status;
    }

    const [items, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
        { [req.query.sortBy || "createdAt"]: req.query.sortOrder || "desc" },
        { id: "desc" }, // ensures stable order and prevents duplicate overlaps
        ],
        include: { user: true, property: true, payment: true },
      }),
      prisma.booking.count({ where }),
    ]);

    res.json({ items, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("❌ Admin fetch bookings failed:", err);
    res.status(500).json({ ok: false, message: "Failed to load bookings" });
  }
});

// ✅ PATCH /api/admin/bookings/:id — update booking status
router.patch("/:id", adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ["PENDING", "CONFIRMED", "CANCELLED", "REFUNDED", "COMPLETED"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ ok: false, message: "Invalid status" });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status },
      include: { user: true, property: true },
    });

    // Optional: send notification later (via queue/email)
    res.json({ ok: true, updated });
  } catch (err) {
    console.error("❌ Booking update failed:", err);
    res.status(500).json({ ok: false, message: "Failed to update booking" });
  }
});

// ✅ POST /api/admin/bookings/:id/action
router.post("/:id/action", adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { user: true, property: true, payment: true },
    });

    if (!booking) {
      return res.status(404).json({ ok: false, message: "Booking not found" });
    }

    let updatedStatus;
    switch (action) {
      case "approve":
        updatedStatus = "CONFIRMED";
        break;
      case "cancel":
        updatedStatus = "CANCELLED";
        break;
      case "refund":
        updatedStatus = "REFUNDED";
        break;
      case "complete":
        updatedStatus = "COMPLETED";
        break;
      default:
        return res.status(400).json({ ok: false, message: "Invalid action" });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status: updatedStatus },
    });

    return res.json({ ok: true, updated });
  } catch (err) {
    console.error("❌ Booking action failed:", err);
    res.status(500).json({ ok: false, message: "Booking action failed" });
  }
});

// ✅ DELETE /api/admin/bookings/:id
router.delete("/:id", adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.booking.delete({ where: { id } });
    res.json({ ok: true, message: "Booking deleted successfully" });
  } catch (err) {
    console.error("❌ Booking delete failed:", err);
    res.status(500).json({ ok: false, message: "Failed to delete booking" });
  }
});

// GET /api/admin/bookings/summary
router.get("/summary", adminOnly, async (req, res) => {
  try {
    const [
      total,
      pending,
      confirmed,
      cancelled,
      refunded,
      totalRevenue,
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.booking.count({ where: { status: "CONFIRMED" } }),
      prisma.booking.count({ where: { status: "CANCELLED" } }),
      prisma.booking.count({ where: { status: "REFUNDED" } }),
      prisma.booking.aggregate({
        _sum: { totalAmount: true },
        where: {
          OR: [
            { status: "CONFIRMED" },
            { status: "COMPLETED" },
            { status: "REFUNDED" }, // include/exclude as your logic demands
          ],
        },
      }),
    ]);

    res.json({
      ok: true,
      summary: {
        total,
        pending,
        confirmed,
        cancelled,
        refunded,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
      },
    });
  } catch (err) {
    console.error("❌ Admin bookings summary failed:", err);
    res.status(500).json({ ok: false, message: "Failed to load booking summary" });
  }
});


export default router;