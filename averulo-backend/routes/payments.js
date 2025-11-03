// routes/payments.js
import express from "express";
import crypto from "node:crypto";
import { auth } from "../lib/auth.js";
import { computePrice } from "../lib/pricing.js";
import { prisma } from "../lib/prisma.js";

/* --------- Webhook handler (exported and mounted in index.js with express.raw) --------- */
export async function paystackWebhook(req, res) {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY || "";
    const sig = req.get("x-paystack-signature") || "";
    const computed = crypto.createHmac("sha512", secret).update(req.body).digest("hex");
    if (computed !== sig) return res.status(401).send("Bad signature");

    const evt = JSON.parse(req.body.toString("utf8"));
    const data = evt?.data;
    const ref = data?.reference;

    if (evt.event === "charge.success" && data?.status === "success" && ref) {
      const booking = await prisma.booking.findFirst({ where: { paymentRef: ref } });
      if (booking) {
        await prisma.$transaction([
          prisma.payment.create({
            data: {
              bookingId: booking.id,
              reference: ref,
              amount: data.amount,
              currency: data.currency || "NGN",
              status: "SUCCESS",
              raw: evt,
            },
          }),
          prisma.booking.update({
            where: { id: booking.id },
            data: { paymentStatus: "SUCCESS", status: "APPROVED" },
          }),
        ]);
      }
    }

    return res.sendStatus(200);
  } catch (e) {
    console.error("[paystack webhook] error:", e);
    return res.sendStatus(500);
  }
}

/* ---------------------------- JSON API router below ---------------------------- */
// helper
const toKobo = (n) => Math.round(Number(n) * 100);

// INIT
import { z } from "zod";

import { notifyGuestBookingStatus, notifyHostBooking } from "../lib/notify.js";
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


router.post("/init", auth(true), async (req, res) => {
  try {
    const { bookingId } = req.body;
    if (!bookingId) return res.status(400).json({ error: "bookingId is required" });

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { property: true, guest: true },
    });
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if (booking.guestId !== req.user.sub) return res.status(403).json({ error: "Not your booking" });
    if (!booking.property) return res.status(400).json({ error: "Booking has no property" });

    const nights =
      (new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24);
    if (nights <= 0) return res.status(400).json({ error: "Invalid dates" });

    // ✅ prefer stored total; else compute with pricing util (already in KOBO)
    const amountKobo =
      booking.totalAmount ??
      computePrice(booking.property.nightlyPrice, booking.startDate, booking.endDate).total;

    const reference = `pay_${booking.id}_${Date.now()}`;

    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        amount: amountKobo,
        currency: "NGN",
        paymentRef: reference,
        paymentStatus: "INITIATED",
      },
    });

    const resp = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amountKobo,
        email: booking.guest.email || "guest@example.com",
        reference,
        callback_url: process.env.PAYSTACK_CALLBACK_URL || undefined,
        currency: "NGN",
      }),
    });

    const data = await resp.json();
    if (!data?.status) {
      return res.status(400).json({ error: "Payment init failed", detail: data?.message || "Unknown" });
    }

    res.json({
      authorization_url: data.data.authorization_url,
      access_code: data.data.access_code,
      reference: data.data.reference,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Payment init failed", detail: err.message });
  }
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

router.post("/webhook/paystack", express.raw({ type: "application/json" }), async (req, res) => {
  try {
    const signature = req.headers["x-paystack-signature"];
    const computed = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(req.body)
      .digest("hex");

    if (signature !== computed) {
      return res.status(400).send("Invalid signature");
    }

    const event = JSON.parse(req.body.toString());
    console.log("✅ Paystack webhook received:", event.event);

    // handle charge.success, transfer.success, etc.
    if (event.event === "charge.success") {
      const ref = event.data.reference;
      await prisma.payment.updateMany({
        where: { reference: ref },
        data: { status: "SUCCESS", raw: event.data },
      });
      await prisma.booking.updateMany({
        where: { paymentRef: ref },
        data: { paymentStatus: "SUCCESS" },
      });
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).send("Webhook failed");
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

router.post("/verify", auth(true), async (req, res) => {
  const { reference } = req.body;
  if (!reference) return res.status(400).json({ error: "Reference required" });

  const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
  });
  const data = await response.json();

  if (!data.status) return res.status(400).json({ error: "Verification failed" });

  await prisma.payment.updateMany({
    where: { reference },
    data: { status: data.data.status.toUpperCase(), raw: data.data },
  });

  await prisma.booking.updateMany({
    where: { paymentRef: reference },
    data: { paymentStatus: data.data.status.toUpperCase() },
  });

  res.json({ ok: true, data: data.data });
});

// VERIFY
router.get("/verify/:reference", auth(true), async (req, res) => {
  try {
    const ref = req.params.reference;

    const resp = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(ref)}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    });
    const data = await resp.json();

    if (!data?.status) {
      return res.status(400).json({ error: "Verify failed", detail: data?.message || "Unknown" });
    }

    const status = data?.data?.status;
    const amount = data?.data?.amount;
    const currency = data?.data?.currency || "NGN";

    const booking = await prisma.booking.findFirst({ where: { paymentRef: ref } });

    if (status === "success" && booking && booking.paymentStatus !== "SUCCESS") {
      await prisma.$transaction(async (tx) => {
        const existing = await tx.payment.findUnique({ where: { reference: ref } });
        if (!existing) {
          await tx.payment.create({
            data: {
              bookingId: booking.id,
              reference: ref,
              amount: amount ?? booking.amount ?? 0,
              currency,
              status: "SUCCESS",
              raw: data.data,
            },
          });
        }
        await tx.booking.update({
          where: { id: booking.id },
          data: { paymentStatus: "SUCCESS", status: "APPROVED" },
        });
      });
    }

    return res.json({ reference: ref, providerStatus: status, synced: Boolean(booking) });
  } catch (err) {
    console.error("[verify] error:", err);
    return res.status(500).json({ error: "Verify error", detail: err.message });
  }
});

// LIST MINE (Payment History)
router.get("/me", auth(true), async (req, res) => {
  const { status, limit } = req.query;

  const where = {
    booking: { guestId: req.user.sub },
    ...(status ? { status: status.toUpperCase() } : {}),
  };

  const rows = await prisma.payment.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit ? parseInt(limit) : undefined,
    include: {
      booking: {
        select: {
          id: true,
          startDate: true,
          endDate: true,
          paymentStatus: true,
          property: { select: { id: true, title: true, city: true } },
        },
      },
    },
  });

  res.json({ ok: true, payments: rows });
});

// BY BOOKING
router.get("/by-booking/:bookingId", auth(true), async (req, res) => {
  const rows = await prisma.payment.findMany({
    where: { bookingId: req.params.bookingId },
    orderBy: { createdAt: "desc" },
  });
  res.json(rows);
});

/* ──────────────────────────────────────────────────────────────
   Payment History (USER/HOST)
   - GET /api/payments/history?status=SUCCESS&limit=10
   ────────────────────────────────────────────────────────────── */
router.get("/history", auth(true), async (req, res) => {
  try {
    const { status, limit } = req.query;

    const where = {
      booking: { guestId: req.user.sub },
      ...(status ? { status: status.toString().toUpperCase() } : {}),
    };

    const payments = await prisma.payment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit ? Math.min(50, parseInt(limit.toString(), 10)) : undefined,
      select: {
        id: true,
        bookingId: true,
        amount: true,
        currency: true,
        status: true,
        createdAt: true,
        booking: {
          select: {
            property: { select: { title: true } },
          },
        },
      },
    });

    const formatted = payments.map(p => ({
      ...p,
      property: p.booking?.property?.title || null,
      booking: undefined, // remove nested booking object
    }));

    res.json({ ok: true, payments: formatted });
  } catch (err) {
    console.error("[/api/payments/history] error:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch payment history", detail: err.message });
  }
});

export default router;