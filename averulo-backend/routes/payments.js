// routes/payments.js
import express from "express";
import crypto from "node:crypto";
import { auth } from "../lib/auth.js";
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
const router = express.Router();

// helper
const toKobo = (n) => Math.round(Number(n) * 100);

// INIT
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

    const amountKobo = toKobo(booking.property.nightlyPrice * nights);
    const reference = `pay_${booking.id}_${Date.now()}`;

    await prisma.booking.update({
      where: { id: booking.id },
      data: { amount: amountKobo, currency: "NGN", paymentRef: reference, paymentStatus: "INITIATED" },
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

    return res.json({
      authorization_url: data.data.authorization_url,
      access_code: data.data.access_code,
      reference: data.data.reference,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Payment init failed", detail: err.message });
  }
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

// LIST MINE
router.get("/me", auth(true), async (req, res) => {
  const rows = await prisma.payment.findMany({
    where: { booking: { guestId: req.user.sub } },
    orderBy: { createdAt: "desc" },
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
  res.json(rows);
});

// BY BOOKING
router.get("/by-booking/:bookingId", auth(true), async (req, res) => {
  const rows = await prisma.payment.findMany({
    where: { bookingId: req.params.bookingId },
    orderBy: { createdAt: "desc" },
  });
  res.json(rows);
});

export default router;