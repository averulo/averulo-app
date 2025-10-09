import express from "express";
import { auth } from "../lib/auth.js";
import { prisma } from "../lib/prisma.js";

const router = express.Router();

// ──────────────────────────────────────────────
// TEMP route for manual notification testing
// ──────────────────────────────────────────────
router.post("/", auth(true), async (req, res) => {
  try {
    const notif = await prisma.notification.create({
      data: {
        userId: req.user.sub,
        type: "BOOKING_STATUS",
        title: "Booking confirmed",
        body: "Your stay at Eko Suites is confirmed!",
      },
    });
    res.status(201).json(notif);
  } catch (err) {
    console.error("Failed to create notif:", err);
    res.status(500).json({ error: err.message });
  }
});

// ──────────────────────────────────────────────
// GET /api/notifications?only=unread&page=1&limit=20
// Paginated + filter support
// ──────────────────────────────────────────────
router.get("/", auth(true), async (req, res) => {
  const only = req.query.only === "unread" ? { readAt: null } : {};
  const page = Math.max(1, parseInt(req.query.page || "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit || "20", 10)));
  const skip = (page - 1) * limit;

  const where = { userId: req.user.sub, ...only };

  const [total, items] = await Promise.all([
    prisma.notification.count({ where }),
    prisma.notification.findMany({
      where,
      orderBy: [{ readAt: "asc" }, { createdAt: "desc" }],
      skip,
      take: limit,
    }),
  ]);

  res.json({ page, limit, total, items });
});

// ──────────────────────────────────────────────
// PATCH /api/notifications/:id/read
// ──────────────────────────────────────────────
router.patch("/:id/read", auth(true), async (req, res) => {
  const notif = await prisma.notification.findUnique({
    where: { id: req.params.id },
  });
  if (!notif || notif.userId !== req.user.sub)
    return res.status(404).json({ error: "Not found" });

  const updated = await prisma.notification.update({
    where: { id: notif.id },
    data: { readAt: new Date() },
  });
  res.json({ ok: true, notification: updated });
});

// ──────────────────────────────────────────────
// PATCH /api/notifications/read-all
// ──────────────────────────────────────────────
router.patch("/read-all", auth(true), async (req, res) => {
  const result = await prisma.notification.updateMany({
    where: { userId: req.user.sub, readAt: null },
    data: { readAt: new Date() },
  });
  res.json({ ok: true, marked: result.count });
});

export default router;