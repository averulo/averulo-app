Backend Assignments

Run locally with npm run dev and test with Postman (or curl) before submitting a PR.
Do not commit any .env or secrets.

Task 1 — Cancel Booking Endpoint

Assigned: Dev A
	•	Route: DELETE /api/bookings/:id/cancel
	•	File: averulo-backend/routes/bookings.js
	•	Logic:
	•	Only the booking owner (guest) can cancel.
	•	Set status → CANCELLED (uses Prisma BookingStatus.CANCELLED).
	•	Return the updated booking.

Acceptance Criteria
	•	Returns 200 with updated object when owner cancels a non-cancelled booking.
	•	Returns 403 when a different user attempts to cancel.
	•	Returns 404 if booking does not exist.
	•	Idempotent: cancelling an already-cancelled booking still returns 200 with status: "CANCELLED".

Code stub

// routes/bookings.js
import express from "express";
import { auth } from "../lib/auth.js";
import { prisma } from "../lib/prisma.js";

const router = express.Router();

// ...other routes...

router.delete("/:id/cancel", auth(true), async (req, res) => {
  const userId = req.user.sub;
  const { id } = req.params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    select: { id: true, guestId: true, status: true },
  });
  if (!booking) return res.status(404).json({ error: "Booking not found" });
  if (booking.guestId !== userId) return res.status(403).json({ error: "Not allowed" });

  if (booking.status !== "CANCELLED") {
    await prisma.booking.update({
      where: { id },
      data: { status: "CANCELLED" },
    });
  }

  const updated = await prisma.booking.findUnique({
    where: { id },
    select: { id: true, status: true },
  });

  return res.json({ ok: true, booking: updated });
});

export default router;

Quick test (replace <TOKEN> and <BOOKING_ID>):

curl -X DELETE http://localhost:4000/api/bookings/<BOOKING_ID>/cancel \
  -H "Authorization: Bearer <TOKEN>"

  Task 2 — Booking History Endpoint

Assigned: Dev B
	•	Route: GET /api/bookings/me
	•	File: averulo-backend/routes/bookings.js
	•	Logic:
	•	Fetch bookings for req.user.sub.
	•	Include property info: title, city, nightlyPrice, status.
	•	Sort by createdAt DESC.
	•	Return an array.

Acceptance Criteria
	•	Returns 200 with an array (possibly empty).
	•	Each item includes id, status, startDate, endDate, createdAt, property{...}.
	•	Sorted newest → oldest (createdAt DESC).

Code stub
// routes/bookings.js (same file, add below)
router.get("/me", auth(true), async (req, res) => {
  const userId = req.user.sub;

  const rows = await prisma.booking.findMany({
    where: { guestId: userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      startDate: true,
      endDate: true,
      createdAt: true,
      property: {
        select: {
          id: true,
          title: true,
          city: true,
          nightlyPrice: true,
          status: true,
        },
      },
    },
  });

  res.json(rows);
});

curl http://localhost:4000/api/bookings/me \
  -H "Authorization: Bearer <TOKEN>"

Run & Test
	1.	Install & generate Prisma client (if needed):
    cd averulo-backend
    npm install
    npx prisma generate
    2.	Start API:
    npm run dev
# API on http://localhost:4000

	3.	Test with Postman or the curl commands above.
	•	Add header Authorization: Bearer <token>.
Git & PR Flow

# Dev A
git checkout -b feat/cancel-booking
# implement Task 1
git add -A
git commit -m "feat: cancel booking endpoint"
git push -u origin feat/cancel-booking
# open PR to main

# Dev B
git checkout -b feat/booking-history
# implement Task 2
git add -A
git commit -m "feat: booking history endpoint"
git push -u origin feat/booking-history
# open PR to main