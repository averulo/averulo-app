// routes/bookings.js
import express from "express";
import { z } from "zod";

import { auth } from "../lib/auth.js";
import {
  notifyGuestBookingStatus,
  notifyHostBooking,
} from "../lib/notify.js";
import { prisma } from "../lib/prisma.js";
import { requireRole } from "../lib/roles.js";
import { validate } from "../lib/validate.js";

const router = express.Router();

/* ──────────────────────────────────────────────────────────────────────────
   Schemas
   ────────────────────────────────────────────────────────────────────────── */
const createBookingSchema = z.object({
  propertyId: z.string().min(1),
  checkIn: z.coerce.date(),   // accepts "YYYY-MM-DD"
  checkOut: z.coerce.date(),  // accepts "YYYY-MM-DD"
});

const idParamSchema = z.object({
  id: z.string().min(1),
});

/* ──────────────────────────────────────────────────────────────────────────
   Create booking (USER)
   ────────────────────────────────────────────────────────────────────────── */
// Create booking (USER)
router.post("/", auth(true), validate(createBookingSchema), async (req, res) => {
  try {
    const { propertyId, checkIn, checkOut } = req.body; // ✅ make sure we read these
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ error: "Invalid token (no sub)" });

    const start = new Date(checkIn);
    const end   = new Date(checkOut);

    // Ensure property exists + is ACTIVE
    const prop = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { id: true, title: true, status: true, host: { select: { email: true, id: true } } },
    });
    if (!prop) return res.status(404).json({ error: "Property not found" });
    if (prop.status !== "ACTIVE") return res.status(400).json({ error: "Property is not bookable" });

    // ❌ prevent overlap with existing bookings (PENDING/APPROVED)
    const collision = await prisma.booking.findFirst({
      where: {
        propertyId,
        status: { in: ["PENDING", "APPROVED"] },
        NOT: [
          { endDate:   { lte: start } }, // ends before requested start
          { startDate: { gte: end   } }, // starts after requested end
        ],
      },
      select: { id: true },
    });
    if (collision) {
      return res.status(409).json({ error: "Dates not available" });
    }

    // ❌ respect host availability blocks (use correct field names)
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
    if (blocked) {
      return res.status(409).json({ error: "Dates blocked by host" });
    }

    // ✅ Create booking
    const created = await prisma.booking.create({
      data: {
        property:  { connect: { id: propertyId } },
        guest:     { connect: { id: userId } },
        startDate: start,
        endDate:   end,
        status:    "PENDING",
      },
      select: {
        id: true, startDate: true, endDate: true, status: true, createdAt: true,
        propertyId: true, guestId: true,
      },
    });

    // (optional) notify host
    const fresh = await prisma.booking.findUnique({
      where: { id: created.id },
      include: {
        property: { select: { title: true, host: { select: { email: true } } } },
        guest: { select: { email: true } },
      },
    });
    if (fresh?.property?.host?.email) {
      await notifyHostBooking({
        hostEmail: fresh.property.host.email,
        propertyTitle: fresh.property.title,
        start: new Date(fresh.startDate).toISOString().slice(0, 10),
        end: new Date(fresh.endDate).toISOString().slice(0, 10),
        guestEmail: fresh.guest?.email || "guest",
      }).catch(() => {});
    }

    return res.status(201).json(created);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Failed to create booking",
      detail: String(err.message || err),
    });
  }
});

/* ──────────────────────────────────────────────────────────────────────────
   List my bookings (USER)
   ────────────────────────────────────────────────────────────────────────── */
router.get("/me", auth(true), async (req, res) => {
  const bookings = await prisma.booking.findMany({
    where: { guestId: req.user.sub },
    orderBy: { createdAt: "desc" },
    include: { property: { select: { id: true, title: true, city: true } } },
  });
  res.json(bookings);
});

/* ──────────────────────────────────────────────────────────────────────────
   Host/admin listing of bookings on their properties
   ────────────────────────────────────────────────────────────────────────── */
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

/* ──────────────────────────────────────────────────────────────────────────
   Approve booking (HOST/ADMIN)
   ────────────────────────────────────────────────────────────────────────── */
router.patch("/:id/approve",
  auth(true),
  requireRole("HOST", "ADMIN"),
  validate(idParamSchema, "params"),
  async (req, res) => {
    try {
      const role = req.user?.role;
      const booking = await prisma.booking.findUnique({
        where: { id: req.params.id },
        include: { property: { select: { hostId: true, title: true } }, guest: true },
      });
      if (!booking) return res.status(404).json({ error: "Booking not found" });
      if (role === "HOST" && booking.property.hostId !== req.user.sub) {
        return res.status(403).json({ error: "Not your property" });
      }
      if (booking.status !== "PENDING") {
        return res.status(400).json({ error: "Only PENDING bookings can be approved" });
      }

      const updated = await prisma.booking.update({
        where: { id: booking.id },
        data: { status: "APPROVED" },
      });

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
  }
);

/* ──────────────────────────────────────────────────────────────────────────
   Reject booking (HOST/ADMIN)
   ────────────────────────────────────────────────────────────────────────── */
router.patch("/:id/reject",
  auth(true),
  requireRole("HOST", "ADMIN"),
  validate(idParamSchema, "params"),
  async (req, res) => {
    try {
      const role = req.user?.role;
      const booking = await prisma.booking.findUnique({
        where: { id: req.params.id },
        include: { property: { select: { hostId: true, title: true } }, guest: true },
      });
      if (!booking) return res.status(404).json({ error: "Booking not found" });
      if (role === "HOST" && booking.property.hostId !== req.user.sub) {
        return res.status(403).json({ error: "Not your property" });
      }
      if (booking.status !== "PENDING") {
        return res.status(400).json({ error: "Only PENDING bookings can be rejected" });
      }

      const updated = await prisma.booking.update({
        where: { id: booking.id },
        data: { status: "REJECTED" },
      });

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
  }
);

/* ──────────────────────────────────────────────────────────────────────────
   Cancel booking (USER cancels own PENDING)
   ────────────────────────────────────────────────────────────────────────── */
router.patch("/:id/cancel",
  auth(true),
  validate(idParamSchema, "params"),
  async (req, res) => {
    try {
      const booking = await prisma.booking.findUnique({
        where: { id: req.params.id },
        include: { property: { select: { title: true } }, guest: true },
      });
      if (!booking) return res.status(404).json({ error: "Booking not found" });
      if (booking.guestId !== req.user.sub) {
        return res.status(403).json({ error: "Not your booking" });
      }
      if (booking.status !== "PENDING") {
        return res.status(400).json({ error: "Only pending bookings can be cancelled" });
      }

      const updated = await prisma.booking.update({
        where: { id: booking.id },
        data: { status: "CANCELLED" },
      });

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
  }
);

export default router;