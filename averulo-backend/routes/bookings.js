import express from "express";
import { z } from "zod";
import { auth } from "../lib/auth.js";
import { notifyGuestBookingStatus, notifyHostBooking } from "../lib/notify.js";
import { computePrice } from "../lib/pricing.js";
import { prisma } from "../lib/prisma.js";
import { requireRole } from "../lib/roles.js";
import { validate } from "../lib/validate.js";

const router = express.Router();

/* ──────────────────────────────────────────────────────────────
   Schemas
   ────────────────────────────────────────────────────────────── */
const createBookingSchema = z.object({
  propertyId: z.string().min(1),
  checkIn: z.coerce.date(),
  checkOut: z.coerce.date(),
});

const idParamSchema = z.object({
  id: z.string().min(1),
});

/* ──────────────────────────────────────────────────────────────
   Quote (no auth required)
   ────────────────────────────────────────────────────────────── */
router.post("/quote", async (req, res) => {
  const { propertyId, checkIn, checkOut } = req.body || {};
  if (!propertyId || !checkIn || !checkOut) {
    return res.status(400).json({ error: "propertyId, checkIn, checkOut are required" });
  }
  const prop = await prisma.property.findUnique({ where: { id: propertyId } });
  if (!prop) return res.status(404).json({ error: "Property not found" });

  const breakdown = computePrice(prop.nightlyPrice, checkIn, checkOut);
  return res.json({ propertyId, checkIn, checkOut, currency: "NGN", ...breakdown });
});

/* ──────────────────────────────────────────────────────────────
   Create booking (USER)
   ────────────────────────────────────────────────────────────── */
router.post("/", auth(true), validate(createBookingSchema), async (req, res) => {
  try {
    const { propertyId, checkIn, checkOut } = req.body;
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ error: "Invalid token (no sub)" });

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const prop = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { id: true, title: true, status: true, nightlyPrice: true, host: { select: { email: true, id: true } } },
    });
    if (!prop) return res.status(404).json({ error: "Property not found" });
    if (prop.status !== "ACTIVE") return res.status(400).json({ error: "Property is not bookable" });

    const collision = await prisma.booking.findFirst({
      where: {
        propertyId,
        status: { in: ["PENDING", "APPROVED"] },
        NOT: [
          { endDate: { lte: start } },
          { startDate: { gte: end } },
        ],
      },
      select: { id: true },
    });
    if (collision) return res.status(409).json({ error: "Dates not available" });

    const blocked = await prisma.availabilityBlock.findFirst({
      where: {
        propertyId,
        NOT: [
          { endDate: { lte: start } },
          { startDate: { gte: end } },
        ],
      },
      select: { id: true },
    });
    if (blocked) return res.status(409).json({ error: "Dates blocked by host" });

    const breakdown = computePrice(prop.nightlyPrice, start, end);

    const created = await prisma.booking.create({
      data: {
        property: { connect: { id: propertyId } },
        guest: { connect: { id: userId } },
        startDate: start,
        endDate: end,
        status: "PENDING",
        feesJson: breakdown,
        totalAmount: breakdown.total,
        amount: breakdown.total,
        currency: "NGN",
      },
      select: {
        id: true,
        startDate: true,
        endDate: true,
        status: true,
        createdAt: true,
        propertyId: true,
        guestId: true,
        feesJson: true,
        totalAmount: true,
      },
    });

    // Notify host (best effort)
    if (prop.host?.email) {
      await notifyHostBooking({
        hostEmail: prop.host.email,
        propertyTitle: prop.title,
        start: start.toISOString().slice(0, 10),
        end: end.toISOString().slice(0, 10),
        guestEmail: req.user?.email || "guest",
      }).catch(() => {});
    }

    return res.status(201).json(created);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to create booking", detail: String(err.message || err) });
  }
});

/* ──────────────────────────────────────────────────────────────
   My bookings
   ────────────────────────────────────────────────────────────── */
router.get("/me", auth(true), async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { guestId: req.user.sub },
      orderBy: { createdAt: "desc" },
      include: {
        property: { select: { id: true, title: true, city: true, nightlyPrice: true } },
      },
    });

    const bookingsWithReviewField = bookings.map(b => ({
      ...b,
      review: null,
    }));

    res.json(bookingsWithReviewField);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch bookings", detail: err.message });
  }
});

/* ──────────────────────────────────────────────────────────────
   Booking Analytics (Summary)
   ────────────────────────────────────────────────────────────── */
router.get("/analytics", auth(true), async (req, res) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ error: "Invalid token (no sub)" });

    const bookings = await prisma.booking.findMany({
      where: { guestId: userId },
      include: { property: { select: { nightlyPrice: true } } },
    });

    const totalBookings = bookings.length;

    const totalSpent = bookings.reduce((sum, booking) => {
      const checkIn = new Date(booking.startDate);
      const checkOut = new Date(booking.endDate);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      const cost = nights * (booking.property?.nightlyPrice || 0);
      return sum + cost;
    }, 0);

    const breakdown = bookings.reduce((acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1;
      return acc;
    }, {});

    return res.json({
      summary: { totalBookings, totalSpent, breakdown },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch booking analytics", detail: String(err.message || err) });
  }
});

/* ──────────────────────────────────────────────────────────────
   Host/Admin bookings
   ────────────────────────────────────────────────────────────── */
router.get("/host", auth(true), requireRole("HOST", "ADMIN"), async (req, res) => {
  const role = req.user?.role;
  const where = role === "HOST" ? { property: { hostId: req.user.sub } } : {};
  const bookings = await prisma.booking.findMany({
    where,
    include: {
      property: { select: { id: true, title: true, city: true, hostId: true } },
      guest: { select: { id: true, email: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  res.json(bookings);
});

/* ──────────────────────────────────────────────────────────────
   Approve / Reject / Cancel
   ────────────────────────────────────────────────────────────── */
router.patch("/:id/approve", auth(true), requireRole("HOST", "ADMIN"), validate(idParamSchema, "params"), async (req, res) => {
  try {
    const role = req.user?.role;
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: { property: { select: { hostId: true, title: true } }, guest: true },
    });
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if (role === "HOST" && booking.property.hostId !== req.user.sub) return res.status(403).json({ error: "Not your property" });
    if (booking.status !== "PENDING") return res.status(400).json({ error: "Only PENDING bookings can be approved" });

    const updated = await prisma.booking.update({ where: { id: booking.id }, data: { status: "APPROVED" } });

    await notifyGuestBookingStatus({
      guestEmail: booking.guest?.email,
      propertyTitle: booking.property?.title,
      status: "APPROVED",
      start: new Date(booking.startDate).toISOString().slice(0, 10),
      end: new Date(booking.endDate).toISOString().slice(0, 10),
    }).catch(() => {});

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to approve booking", detail: err.message });
  }
});

/* ──────────────────────────────────────────────────────────────
   Cancel booking (User or Admin)
   ────────────────────────────────────────────────────────────── */
router.patch("/:id/cancel", auth(true), async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: { guest: true, property: { select: { title: true, hostId: true } } },
    });
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    // Only allow the guest who booked it, or admin
    if (req.user.sub !== booking.guest.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Not allowed to cancel this booking" });
    }

    // Only allow cancelling if pending or approved
    if (!["PENDING", "APPROVED"].includes(booking.status)) {
      return res.status(400).json({ error: "Cannot cancel this booking" });
    }

    const updated = await prisma.booking.update({
      where: { id: booking.id },
      data: { status: "CANCELLED" },
    });

    // Optional notification to host/guest
    await notifyGuestBookingStatus({
      guestEmail: booking.guest.email,
      propertyTitle: booking.property.title,
      status: "CANCELLED",
      start: new Date(booking.startDate).toISOString().slice(0, 10),
      end: new Date(booking.endDate).toISOString().slice(0, 10),
    }).catch(() => {});

    res.json({ ok: true, booking: updated });
  } catch (err) {
    console.error("❌ Cancel booking failed:", err);
    res.status(500).json({ error: "Failed to cancel booking", detail: err.message });
  }
});

export default router;