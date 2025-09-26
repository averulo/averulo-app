# Backend Assignments (Updated)

This document lists new tasks for contributors.  
Please pick up your assigned task, create a branch, and open a PR when ready.  
Run locally with `npm run dev` and test with Postman before submitting.

---

## Task 1: KYC Verification Endpoint
**Assigned to: Ebube**

- **Route:** `PATCH /api/users/:id/kyc`
- **File to modify:** `routes/userRoutes.js`
- **Logic:**  
  - Only an `ADMIN` can hit this route.  
  - Update `kycStatus` of a user to either `VERIFIED` or `REJECTED`.  
  - Return the updated user object.  

**Example Response:**
```json
{
  "ok": true,
  "user": {
    "id": "user_123",
    "email": "guest@example.com",
    "kycStatus": "VERIFIED"
  }
}


## Task 2: Admin Stats Endpoint
**Assigned to: Wale**

- **Route:** `GET /api/admin/stats`  
- **File to modify:** create new file `routes/admin.js`  
- **Logic:**  
  - Only an `ADMIN` can hit this route.  
  - Return basic counts:  
    - Total users  
    - Total properties  
    - Total bookings  
    - Total revenue (sum of successful payments)  
  - Wrap the result in `{ ok: true, stats: { ... } }`.  

**Example Response:**
```json
{
  "ok": true,
  "stats": {
    "users": 150,
    "properties": 42,
    "bookings": 87,
    "revenue": 3500000
  }
}