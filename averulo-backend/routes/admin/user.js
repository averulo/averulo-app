// routes/admin/users.js
import express from "express";
import { auth } from "../../lib/auth.js";
import { prisma } from "../../lib/prisma.js";

const router = express.Router();

router.get("/users", auth(true), async (req, res) => {
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
        { email: { contains: search, mode: "insensitive" } },
        { name: { contains: search, mode: "insensitive" } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: parseInt(limit),
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    const total = await prisma.user.count({ where });

    res.json({
      items: users,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Admin users list error:", err);
    res.status(500).json({ error: "Server error fetching users" });
  }
});

// PATCH role
router.patch("/:id", adminOnly, async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const allowed = ["USER", "HOST", "ADMIN"];
  if (!allowed.includes(role)) return res.status(400).json({ ok: false, message: "Invalid role" });
  const updated = await prisma.user.update({ where: { id }, data: { role } });
  res.json({ ok: true, updated });
});

// DELETE user
router.delete("/:id", adminOnly, async (req, res) => {
  await prisma.user.delete({ where: { id } });
  res.json({ ok: true, message: "User deleted successfully" });
});


export default router;