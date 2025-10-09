import express from "express";
import { z } from "zod";

import { auth } from "../lib/auth.js";
import { createNotification } from "../lib/notifications.js";
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
  checkIn: z.coerce.date(),   // accepts "YYYY-MM-DD"
  checkOut: z.coerce.date(),  // accepts "YYYY-MM-DD"
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
    const end   = new Date(checkOut);

    // Ensure property is bookable
    const prop = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { id: true, title: true, status: true, nightlyPrice: true, host: { select: { email: true, id: true } } },
    });
    if (!prop) return res.status(404).json({ error: "Property not found" });
    if (prop.status !== "ACTIVE") return res.status(400).json({ error: "Property is not bookable" });

    // Overlap with bookings (PENDING/APPROVED)
    const collision = await prisma.booking.findFirst({
      where: {
        propertyId,
        status: { in: ["PENDING", "APPROVED"] },
        NOT: [
          { endDate:   { lte: start } },
          { startDate: { gte: end   } },
        ],
      },
      select: { id: true },
    });
    if (collision) return res.status(409).json({ error: "Dates not available" });

    // Respect host blackouts
    const blocked = await prisma.availabilityBlock.findFirst({
      where: {
        propertyId,
        NOT: [
          { endDate:   { lte: start } },
          { startDate: { gte: end   } },
        ],
      },
      select: { id: true },
    });
    if (blocked) return res.status(409).json({ error: "Dates blocked by host" });

    // 💰 Price breakdown + total (KOBO) and store
    const breakdown = computePrice(prop.nightlyPrice, start, end);

    const created = await prisma.booking.create({
      data: {
        property:    { connect: { id: propertyId } },
        guest:       { connect: { id: userId } },
        startDate:   start,
        endDate:     end,
        status:      "PENDING",
        feesJson:    breakdown,          // UI-facing NGN numbers + nights
        totalAmount: breakdown.total,    // KOBO total for payments
        amount:      breakdown.total,    // keep legacy fields in sync
        currency:    "NGN",
      },
      select: {
        id: true, startDate: true, endDate: true, status: true, createdAt: true,
        propertyId: true, guestId: true, feesJson: true, totalAmount: true,
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
  const bookings = await prisma.booking.findMany({
    where: { guestId: req.user.sub },
    orderBy: { createdAt: "desc" },
    include: { property: { select: { id: true, title: true, city: true } } },
  });
  res.json(bookings);
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

router.patch("/:id/reject", auth(true), requireRole("HOST", "ADMIN"), validate(idParamSchema, "params"), async (req, res) => {
  try {
    const role = req.user?.role;
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: { property: { select: { hostId: true, title: true } }, guest: true },
    });
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if (role === "HOST" && booking.property.hostId !== req.user.sub) return res.status(403).json({ error: "Not your property" });
    if (booking.status !== "PENDING") return res.status(400).json({ error: "Only PENDING bookings can be rejected" });

    const updated = await prisma.booking.update({ where: { id: booking.id }, data: { status: "REJECTED" } });

    await notifyGuestBookingStatus({
      guestEmail: booking.guest?.email,
      propertyTitle: booking.property?.title,
      status: "REJECTED",
      start: new Date(booking.startDate).toISOString().slice(0, 10),
      end: new Date(booking.endDate).toISOString().slice(0, 10),
    }).catch(() => {});

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to reject booking", detail: err.message });
  }
});

router.patch("/:id/cancel", auth(true), validate(idParamSchema, "params"), async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: { property: { select: { title: true } }, guest: true },
    });
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if (booking.guestId !== req.user.sub) return res.status(403).json({ error: "Not your booking" });
    if (booking.status !== "PENDING") return res.status(400).json({ error: "Only pending bookings can be cancelled" });

    const updated = await prisma.booking.update({ where: { id: booking.id }, data: { status: "CANCELLED" } });

    await notifyGuestBookingStatus({
      guestEmail: booking.guest?.email,
      propertyTitle: booking.property?.title,
      status: "CANCELLED",
      start: new Date(booking.startDate).toISOString().slice(0, 10),
      end: new Date(booking.endDate).toISOString().slice(0, 10),
    }).catch(() => {});

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to cancel booking", detail: err.message });
  }
});

// PATCH /api/bookings/:id/status
router.patch("/:id/status", auth(true), requireRole("ADMIN", "HOST"), async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status },
      include: { 
        guest: { select: { id: true, email: true } },
        property: { select: { title: true, city: true } }
      },
    });

    // Automatically create notification for the guest
    await createNotification({
      userId: booking.guest.id,
      type: "BOOKING_STATUS",
      title:
        status === "APPROVED"
          ? "Booking Approved 🎉"
          : status === "REJECTED"
          ? "Booking Rejected ❌"
          : `Booking ${status}`,
      body:
        status === "APPROVED"
          ? `Your booking for ${booking.property.title} in ${booking.property.city} was approved.`
          : `Your booking for ${booking.property.title} in ${booking.property.city} was ${status.toLowerCase()}.`,
      emailTo: booking.guest.email,
      emailSubject: `Your booking was ${status}`,
    });

    res.json({ ok: true, booking });
  } catch (err) {
    console.error("Booking status update failed:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;