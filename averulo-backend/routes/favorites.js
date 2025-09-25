// routes/favorites.js
import express from "express";
import { auth } from "../lib/auth.js";
import { prisma } from "../lib/prisma.js";

const router = express.Router();

// POST /api/favorites/:propertyId
router.post("/:propertyId", auth(true), async (req, res) => {
  const userId = req.user.sub;
  const { propertyId } = req.params;

  try {
    const prop = await prisma.property.findUnique({ where: { id: propertyId }, select: { id: true }});
    if (!prop) return res.status(404).json({ error: "Property not found" });

    const wasNew = await prisma.$transaction(async (tx) => {
      // upsert to be race-safe
      const before = await tx.favorite.findUnique({
        where: { userId_propertyId: { userId, propertyId } },
        select: { id: true },
      });
      if (before) return false;

      await tx.favorite.create({ data: { userId, propertyId } });
      await tx.property.update({
        where: { id: propertyId },
        data: { favoritesCount: { increment: 1 } },
      });
      return true;
    });

    return res.status(wasNew ? 201 : 200).json({ ok: true, favorited: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to favorite", detail: err.message });
  }
});

// DELETE /api/favorites/:propertyId
router.delete("/:propertyId", auth(true), async (req, res) => {
  const userId = req.user.sub;
  const { propertyId } = req.params;

  try {
    const removed = await prisma.$transaction(async (tx) => {
      const exists = await tx.favorite.findUnique({
        where: { userId_propertyId: { userId, propertyId } },
        select: { id: true },
      });
      if (!exists) return false;

      await tx.favorite.delete({
        where: { userId_propertyId: { userId, propertyId } },
      });
      await tx.property.update({
        where: { id: propertyId },
        data: { favoritesCount: { decrement: 1 } },
      });
      // clamp in case of double-decrement races
      await tx.property.updateMany({
        where: { id: propertyId, favoritesCount: { lt: 0 } },
        data: { favoritesCount: 0 },
      });
      return true;
    });

    return res.json({ ok: true, favorited: false, removed });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to unfavorite", detail: err.message });
  }
});

// GET /api/favorites/me  -> list my favorite properties (with basic property info)
router.get("/me", auth(true), async (req, res) => {
  try {
    const rows = await prisma.favorite.findMany({
      where: { userId: req.user.sub },
      orderBy: { createdAt: "desc" },
      include: {
        property: {
          select: {
            id: true, title: true, city: true, nightlyPrice: true,
            avgRating: true, reviewsCount: true, favoritesCount: true,
            status: true,
          },
        },
      },
    });

    // return just properties or keep favorite metadata — here we return properties
    const properties = rows.map(r => r.property);
    res.json(properties);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch favorites", detail: err.message });
  }
});

// GET /api/favorites/ids  -> quick set of propertyIds I’ve favorited (for UI badges)
router.get("/ids", auth(true), async (req, res) => {
  const rows = await prisma.favorite.findMany({
    where: { userId: req.user.sub },
    select: { propertyId: true },
  });
  res.json(rows.map(r => r.propertyId));
});

export default router;