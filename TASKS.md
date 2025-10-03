# Backend Assignments (Next Round)

This document lists new tasks for contributors.  
Please pick up your assigned task, create a branch, and open a PR when ready.  
Run locally with `npm run dev` and test with Postman before submitting.  

---

## Task 3: User Profile Update Endpoint  
**Assigned to: Dev A**

- **Route:** `PATCH /api/users/me`  
- **File to modify:** `routes/userRoutes.js`  
- **Logic:**  
  - Only an authenticated user can hit this route (`auth(true)`).  
  - Allow updating: `name`, `dob`, and `phone`.  
  - Do **not** allow editing `role`, `email`, or `kycStatus` here.  
  - Return the updated user object.  

**Example Response:**  
```json
{
  "ok": true,
  "user": {
    "id": "user_123",
    "email": "guest@example.com",
    "name": "John Doe",
    "dob": "1995-07-21T00:00:00.000Z",
    "phone": "+2348012345678",
    "role": "USER",
    "kycStatus": "PENDING"
  }
}

Task 4: Booking History (Detailed)

Assigned to: Dev B
	•	Route: GET /api/bookings/me
	•	File to modify: routes/bookings.js
	•	Logic:
	•	Fetch all bookings for the authenticated user.
	•	Include property info (title, city, nightlyPrice).
	•	Include review if it exists (rating, comment).
	•	Sort results by createdAt DESC.

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
      "nightlyPrice": 35000
    },
    "review": {
      "rating": 5,
      "comment": "Great stay!"
    }
  }
]
