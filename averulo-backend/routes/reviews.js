import express from "express";
import { z } from "zod";
import { auth } from "../lib/auth.js";
import { prisma } from "../lib/prisma.js";
import { requireRole } from "../lib/roles.js";

const router = express.Router();

const createReviewSchema = z.object({
  bookingId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(2000).optional(),
});

// POST /api/reviews
router.post("/", auth(true), async (req, res) => {
  try {
    const parsed = createReviewSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid body", detail: parsed.error.flatten() });
    }
    const { bookingId, rating, comment } = parsed.data;

    // Load booking and validate authorisation
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { property: true },
    });
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if (booking.guestId !== req.user.sub) return res.status(403).json({ error: "Not your booking" });

    // Require a successful payment (or you could require endDate < now)
    if (booking.paymentStatus !== "SUCCESS") {
      return res.status(400).json({ error: "Booking not paid yet" });
    }

    // One review per booking
    const existing = await prisma.review.findUnique({ where: { bookingId } });
    if (existing) return res.status(409).json({ error: "Booking already reviewed" });

    // Create review + update property aggregates atomically
    const result = await prisma.$transaction(async (tx) => {
      const review = await tx.review.create({
        data: {
          bookingId,
          propertyId: booking.propertyId,
          guestId: booking.guestId,
          rating,
          comment,
        },
      });

      // Recompute aggregates for the property
      const agg = await tx.review.aggregate({
        where: { propertyId: booking.propertyId },
        _avg: { rating: true },
        _count: { rating: true },
      });

      await tx.property.update({
        where: { id: booking.propertyId },
        data: {
          avgRating: agg._avg.rating ?? 0,
          reviewsCount: agg._count.rating,
        },
      });

      return review;
    });

    res.status(201).json(result);
  } catch (err) {
    console.error("[reviews:create] error:", err);
    res.status(500).json({ error: "Failed to create review", detail: err.message });
  }
});

// GET /api/reviews/property/:propertyId
router.get("/property/:propertyId", async (req, res) => {
  const { propertyId } = req.params;
  const rows = await prisma.review.findMany({
    where: { propertyId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true, rating: true, comment: true, createdAt: true,
      guest: { select: { id: true, email: true, name: true } },
    },
  });
  res.json(rows);
});

// GET /api/reviews/me
router.get("/me", auth(true), async (req, res) => {
  const rows = await prisma.review.findMany({
    where: { guestId: req.user.sub },
    orderBy: { createdAt: "desc" },
    include: {
      property: { select: { id: true, title: true, city: true, avgRating: true, reviewsCount: true } },
    },
  });
  res.json(rows);
});

// GET /api/reviews/host - get all reviews for host's properties
router.get("/host", auth(true), requireRole("HOST", "ADMIN"), async (req, res) => {
  try {
    const hostId = req.user.sub;

    // Get all reviews for properties owned by this host
    const reviews = await prisma.review.findMany({
      where: {
        property: { hostId },
      },
      orderBy: { createdAt: "desc" },
      include: {
        guest: { select: { id: true, email: true, name: true } },
        property: { select: { id: true, title: true, city: true } },
      },
    });

    res.json(reviews);
  } catch (err) {
    console.error("[reviews:host] error:", err);
    res.status(500).json({ error: "Failed to fetch host reviews", detail: err.message });
  }
});

// PATCH /api/reviews/:id/reply
router.patch("/:id/reply", auth(true), requireRole("HOST", "ADMIN"), async (req, res) => {
  const { reply } = req.body;
  if (!reply || reply.length > 1000) {
    return res.status(400).json({ error: "Reply is required and max 1000 chars" });
  }

  const review = await prisma.review.findUnique({
    where: { id: req.params.id },
    include: { property: true },
  });

  if (!review) return res.status(404).json({ error: "Review not found" });
  if (req.user.role === "HOST" && review.property.hostId !== req.user.sub) {
    return res.status(403).json({ error: "Not your property" });
  }

  const updated = await prisma.review.update({
    where: { id: req.params.id },
    data: { reply },
  });

  res.json({ ok: true, review: updated });
});

export default router;