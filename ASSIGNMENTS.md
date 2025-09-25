# Backend Assignments

This document lists small, focused tasks for contributors to continue building out the Averulo backend.  
Please pick up your assigned task, create a branch, and open a PR when ready.  
Make sure to **run locally with `npm run dev`** and **test with Postman** before submitting.

---

## Task 1: Cancel Booking Endpoint
**Assigned to: Dev A**

- **Route:** `DELETE /api/bookings/:id/cancel`  
- **File to modify:** `routes/bookings.js`  
- **Logic:**  
  - Instead of deleting a booking, update its `status` field to `CANCELLED`.  
  - Use the existing `BookingStatus` enum in Prisma (`CANCELLED` already exists).  
  - Only the booking’s owner (the guest who created it) should be able to cancel.  
  - Return the updated booking object as JSON.  

**Example Response:**
```json
{
  "ok": true,
  "booking": {
    "id": "book_123",
    "status": "CANCELLED"
  }
}


Task 2: Booking History Endpoint

Assigned to: Dev B
	•	Route: GET /api/bookings/me
	•	File to modify: routes/bookings.js
	•	Logic:
	•	Fetch all bookings for the currently authenticated user (req.user.sub).
	•	Include basic property info (title, city, nightlyPrice, status).
	•	Sort by createdAt DESC so newest bookings come first.
	•	Return as an array.

Example Response:
[
  {
    "id": "book_123",
    "status": "APPROVED",
    "startDate": "2025-10-01",
    "endDate": "2025-10-05",
    "property": {
      "title": "2-Bedroom Apartment",
      "city": "Lagos",
      "nightlyPrice": 35000,
      "status": "ACTIVE"
    }
  }
]

Notes for Both Devs
	•	Do not touch .env or secrets.
	•	After implementation, run:

npx prisma generate
npm run dev

	•	Test with Postman:
	•	Add Authorization: Bearer <token> header.
	•	Confirm correct responses.

    