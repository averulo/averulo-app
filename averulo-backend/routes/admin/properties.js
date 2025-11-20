// routes/admin/properties.js
import express from "express";
import { adminOnly, auth } from "../../lib/auth.js";
import { prisma } from "../../lib/prisma.js";

const router = express.Router();

/**
 * GET /api/admin/properties
 * List all properties with pagination, search, and sort.
 */
router.get("/", auth(true), async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Admins only" });
    }

    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      search = "",
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
        { host: { email: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { [sortBy]: sortOrder },
        include: {
          host: { select: { id: true, email: true } },
        },
      }),
      prisma.property.count({ where }),
    ]);

    res.json({
      items: properties,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Admin properties list error:", err);
    res.status(500).json({ error: "Server error fetching properties" });
  }
});

/**
 * PATCH /api/admin/properties/:id
 * Approve, hide, or update property status
 */
router.patch("/:id", adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["PENDING", "APPROVED", "HIDDEN"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ ok: false, message: "Invalid status" });
    }

    const updated = await prisma.property.update({
      where: { id },
      data: { status },
    });

    res.json({ ok: true, updated });
  } catch (err) {
    console.error("❌ Failed to update property:", err);
    res.status(500).json({ ok: false, message: "Failed to update property" });
  }
});

/**
 * DELETE /api/admin/properties/:id
 * Permanently delete a property
 */
router.delete("/:id", adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.property.delete({ where: { id } });
    res.json({ ok: true, message: "Property deleted successfully" });
  } catch (err) {
    console.error("❌ Delete failed:", err);
    res.status(500).json({ ok: false, message: "Failed to delete property" });
  }
});

export default router;