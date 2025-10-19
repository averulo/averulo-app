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
router.post(
  "/",
  auth(true),
  validate(createBookingSchema),
  async (req, res) => {
    try {
      const userId = req.user?.sub;
      if (!userId) return res.status(401).json({ error: "Invalid token (no sub)" });

      // Ensure property exists + is ACTIVE
      const prop = await prisma.property.findUnique({
        where: { id: req.body.propertyId },
        select: {
          id: true,
          title: true,
          status: true,
          host: { select: { email: true, id: true } },
        },
      });
      if (!prop) return res.status(404).json({ error: "Property not found" });
      if (prop.status !== "ACTIVE") return res.status(400).json({ error: "Property is not bookable" });

      // Create booking
      const created = await prisma.booking.create({
        data: {
          property:  { connect: { id: req.body.propertyId } },
          guest:     { connect: { id: userId } },
          startDate: req.body.checkIn,   // z.coerce.date() already gave Date
          endDate:   req.body.checkOut,  // same here
          status:    "PENDING",
        },
        select: {
          id: true, startDate: true, endDate: true, status: true, createdAt: true,
          propertyId: true, guestId: true,
        },
      });

      // Re-fetch with host+guest to notify
      const fresh = await prisma.booking.findUnique({
        where: { id: created.id },
        include: {
          property: { select: { title: true, host: { select: { email: true } } } },
          guest: { select: { email: true } },
        },
      });

      // Notify host that a new booking arrived (best-effort)
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
  }
);

/* ──────────────────────────────────────────────────────────────────────────
   List my bookings (USER)
   ────────────────────────────────────────────────────────────────────────── */
router.get("/me", auth(true), async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { guestId: req.user.sub },
      orderBy: { createdAt: "desc" },
      include: {
        property: { 
          select: { 
            id: true, 
            title: true, 
            city: true,
            nightlyPrice: true 
          } 
        }
      },
    });

    // Add review: null to each booking for consistency with Task 4 spec
    const bookingsWithReviewField = bookings.map(booking => ({
      ...booking,
      review: null
    }));

    res.json(bookingsWithReviewField);
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      error: "Failed to fetch bookings", 
      detail: err.message 
    });
  }
});
/* ──────────────────────────────────────────────────────────────────────────
   Booking Analytics (Summary) - Task 7
   ────────────────────────────────────────────────────────────────────────── */
router.get("/analytics", auth(true), async (req, res) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ error: "Invalid token (no sub)" });

    // Fetch all bookings for the authenticated user with property pricing
    const bookings = await prisma.booking.findMany({
      where: { guestId: userId },
      include: {
        property: {
          select: {
            nightlyPrice: true
          }
        }
      }
    });

    // Calculate total bookings
    const totalBookings = bookings.length;

    // Calculate total spent (nights * nightlyPrice for each booking)
    const totalSpent = bookings.reduce((sum, booking) => {
      const checkIn = new Date(booking.startDate);
      const checkOut = new Date(booking.endDate);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      const bookingCost = nights * (booking.property?.nightlyPrice || 0);
      return sum + bookingCost;
    }, 0);

    // Calculate breakdown by status
    const breakdown = bookings.reduce((acc, booking) => {
      const status = booking.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return res.json({
      summary: {
        totalBookings,
        totalSpent,
        breakdown
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Failed to fetch booking analytics",
      detail: String(err.message || err)
    });
  }
});

/* ──────────────────────────────────────────────────────────────────────────
   Host/admin listing of bookings on their properties
   ────────────────────────────────────────────────────────────────────────── */
router.get(
  "/host",
  auth(true),
  requireRole("HOST", "ADMIN"),
  async (req, res) => {
    const role = req.user?.role;
    const where =
      role === "HOST"
        ? { property: { hostId: req.user.sub } }
        : {}; // ADMIN sees all

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        property: { select: { id: true, title: true, city: true, hostId: true } },
        guest: { select: { id: true, email: true, name: true} },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(bookings);
  }
);

/* ──────────────────────────────────────────────────────────────────────────
   Approve booking (HOST/ADMIN)
   ────────────────────────────────────────────────────────────────────────── */
router.patch(
  "/:id/approve",
  auth(true),
  requireRole("HOST", "ADMIN"),
  validate(idParamSchema, "params"),
  async (req, res) => {
    try {
      const role = req.user?.role;

      const booking = await prisma.booking.findUnique({
        where: { id: req.params.id },
        include: {
          property: { select: { hostId: true, title: true } },
          guest: true,
        },
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

      // Notify guest (best-effort)
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
router.patch(
  "/:id/reject",
  auth(true),
  requireRole("HOST", "ADMIN"),
  validate(idParamSchema, "params"),
  async (req, res) => {
    try {
      const role = req.user?.role;

      const booking = await prisma.booking.findUnique({
        where: { id: req.params.id },
        include: {
          property: { select: { hostId: true, title: true } },
          guest: true,
        },
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

      // Notify guest (best-effort)
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
router.patch(
  "/:id/cancel",
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

      // Notify guest (confirmation of cancel, best-effort)
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