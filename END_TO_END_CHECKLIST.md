# End-to-End Functionality Checklist

**Focus:** Guest App + Host App working completely
**Status:** Pre-Distribution Verification

---

## 🎯 Goal: Both flows work end-to-end before team testing

### Guest Flow: Browse → Book → Pay → Complete
### Host Flow: Register → Create Property → Manage Bookings

---

## ✅ Guest App - End-to-End Flow

### Flow: User Registration → Browse → Book → Pay → Confirm

**Test Locally Before Sharing:**

### Step 1: Authentication ⬜
```
1. [ ] Open app
2. [ ] Enter email
3. [ ] Receive OTP (check console or email)
4. [ ] Enter OTP
5. [ ] Successfully logged in → Home screen
```
**Files:** LoginScreen.js, OtpScreen.js
**Backend:** /api/send-otp, /api/verify-otp

### Step 2: Browse Properties ⬜
```
1. [ ] Home screen loads properties from backend
2. [ ] Properties display with images, prices
3. [ ] Can tap property card
4. [ ] PropertyDetailsScreen shows all info
5. [ ] Can view amenities
6. [ ] Can view "about this place"
```
**Files:** PropertiesListScreen.js, PropertyDetailsScreen.js
**Backend:** GET /api/properties, GET /api/properties/:id

### Step 3: Book Property ⬜
```
1. [ ] From PropertyDetails, tap "Book Now"
2. [ ] Select check-in/check-out dates
3. [ ] Select number of guests
4. [ ] Price calculates correctly
5. [ ] Tap "Continue" → ConfirmBookingScreen
6. [ ] Review booking details
7. [ ] All data displays correctly
```
**Files:** BookingDetailsScreen.js, ConfirmBookingScreen.js
**Backend:** POST /api/bookings/calculate-price

### Step 4: Payment ⬜
```
1. [ ] Tap "Confirm & Pay" → PaymentScreen
2. [ ] Paystack payment initializes
3. [ ] Enter test card: 4084084084084081
4. [ ] Enter CVV: 408
5. [ ] Enter PIN: 0000
6. [ ] Enter OTP: 123456
7. [ ] Payment processes
8. [ ] Webhook receives confirmation
9. [ ] Booking status updates
```
**Files:** PaymentScreen.js, BookingInProgressScreen.js
**Backend:** POST /api/payments/initialize, POST /api/payments/webhook/paystack

### Step 5: Confirmation ⬜
```
1. [ ] BookingSuccessScreen displays
2. [ ] Booking reference shown
3. [ ] Can view BookingTicketScreen
4. [ ] QR code generates
5. [ ] All booking details correct
6. [ ] Booking appears in "My Bookings"
```
**Files:** BookingSuccessScreen.js, BookingTicketScreen.js
**Backend:** GET /api/bookings

### Step 6: View Bookings ⬜
```
1. [ ] Navigate to Bookings tab
2. [ ] See created booking
3. [ ] Tap booking → ViewBookingDetailsScreen
4. [ ] All details display correctly
5. [ ] Can cancel booking (if pending)
```
**Files:** MyBookingsScreen.js, ViewBookingDetailsScreen.js
**Backend:** GET /api/bookings, PUT /api/bookings/:id/cancel

---

## ✅ Host App - End-to-End Flow

### Flow: Become Host → Create Property → Manage Bookings

**Test Locally Before Sharing:**

### Step 1: Become a Host ⬜
```
1. [ ] From ProfileScreen, tap "Switch to Host"
2. [ ] BecomeHostScreen displays
3. [ ] Tap "Continue"
4. [ ] HostOnboardingScreen with checklist
5. [ ] Check "I understand!"
6. [ ] Tap "Let's go"
7. [ ] CreatePropertyScreen loads
```
**Files:** ✅ ProfileScreen.js, BecomeHostScreen.js, HostOnboardingScreen.js
**Status:** 100% Complete

### Step 2: Create Property (12 Steps) ⬜
```
Step 1-2: Basic Info
1. [ ] Enter property name
2. [ ] Enter position
3. [ ] Tap "Continue" → Data persists

Step 3-5: Contact
4. [ ] Enter phone
5. [ ] Enter email
6. [ ] Enter website
7. [ ] Tap "Continue" → Data persists

Step 6: Hotel Type
8. [ ] Select type from list
9. [ ] Tap "Continue"

Step 7: Location
10. [ ] Enter address
11. [ ] Tap "Continue"

Step 8: Main Photos
12. [ ] Upload 3-5 hotel photos
13. [ ] Thumbnails display
14. [ ] Tap "Continue"

Step 8a-8f: Category Photos
15. [ ] Upload amenity photos
16. [ ] Upload dining photos
17. [ ] Upload special features
18. [ ] Upload event space
19. [ ] Upload nearby attractions
20. [ ] Each category saves

Step 9: Room Selection
21. [ ] Tap room card → Modal opens
22. [ ] Adjust count with +/- buttons
23. [ ] Close modal → Count displays on card
24. [ ] Select multiple room types
25. [ ] Tap "Continue"

Step 10: Room Photos
26. [ ] Upload photos for each room type
27. [ ] Photos display correctly
28. [ ] Tap "Continue"

Step 11: Room Prices
29. [ ] Enter price for each room
30. [ ] Prices validate
31. [ ] Tap "Continue"

Step 12: Hotel Story
32. [ ] Enter optional fields
33. [ ] Tap "Continue"
34. [ ] Reach ConfirmPropertyScreen
```
**Files:** ✅ CreatePropertyScreen.js (all 12 steps)
**Backend:** POST /api/properties
**Status:** 100% Complete (UI), needs backend connection

### Step 3: Confirm & Submit ⬜
```
1. [ ] ConfirmPropertyScreen displays all data
2. [ ] All fields populated correctly
3. [ ] Can tap EDIT on any section
4. [ ] Tap "Confirm" → ReorderPhotosScreen
5. [ ] Drag photos to reorder
6. [ ] Tap "Done" → PropertyPreviewScreen
7. [ ] All info displays in preview
8. [ ] Tap "Create Profile"
9. [ ] Success modal appears
10. [ ] Property created in database
11. [ ] Property status: PENDING
```
**Files:** ✅ ConfirmPropertyScreen.js, ReorderPhotosScreen.js, PropertyPreviewScreen.js
**Backend:** POST /api/properties (needs to receive all data)
**Status:** UI Complete, needs backend integration

### Step 4: Property Approval ⬜
```
For now (without admin):
1. [ ] Property created with status: ACTIVE (auto-approve for testing)
2. [ ] Or manually update in database: UPDATE properties SET status = 'ACTIVE'
3. [ ] Profile shows as host
```
**Backend:** Update status in Prisma Studio or auto-approve
**Temporary:** Skip admin approval for testing

### Step 5: Host Dashboard ⬜
```
1. [ ] HostDashboardScreen loads
2. [ ] Property displays
3. [ ] Tabs work (Checked out, Currently, Future)
4. [ ] "View Bookings" button works
5. [ ] Bottom navigation works (Home, Chat, Calendar, Statistic)
```
**Files:** ✅ HostDashboardScreen.js
**Backend:** GET /api/host/dashboard
**Status:** UI 100% Complete, needs backend data

### Step 6: Manage Bookings ⬜
```
1. [ ] From dashboard, tap "View Bookings"
2. [ ] HostBookingsScreen displays
3. [ ] Shows Pending, Approved, Rejected sections
4. [ ] Tap pending booking → HostBookingRequestScreen
5. [ ] Timer counts down from 30:00
6. [ ] Guest details display
7. [ ] Room image shows

Accept Flow:
8. [ ] Tap "Accept"
9. [ ] HostBookingAcceptedScreen displays
10. [ ] Success animation
11. [ ] Booking status updates to CONFIRMED
12. [ ] Guest receives notification

Reject Flow:
8. [ ] Tap "Reject"
9. [ ] HostBookingDeclinedScreen displays
10. [ ] Select reason
11. [ ] Booking status updates to REJECTED
12. [ ] Guest receives notification
```
**Files:** ✅ HostBookingsScreen.js, HostBookingRequestScreen.js, etc.
**Backend:** GET /api/host/bookings, PUT /api/host/bookings/:id/accept, PUT /api/host/bookings/:id/reject
**Status:** UI 100% Complete, needs backend endpoints

### Step 7: Calendar ⬜
```
1. [ ] Tap Calendar in bottom nav
2. [ ] 12×7 grid displays
3. [ ] Date selector works (7 days)
4. [ ] Can select dates
5. [ ] Grid shows room availability:
   - Vacant (white)
   - Occupied (gray)
   - Reserved (dark blue)
6. [ ] Reservations list below
```
**Files:** ✅ HostCalendarScreen.js
**Backend:** GET /api/host/calendar, GET /api/availability
**Status:** UI 100% Complete, needs backend data

### Step 8: Statistics ⬜
```
1. [ ] Tap Statistic in bottom nav
2. [ ] Default tab: "Reviews"
3. [ ] Reviews display (if any exist)
4. [ ] Tap "Stats" tab:
   - Occupancy chart shows 75%
   - Chart colors correct (dark blue fill)
   - Stats row: rating, reviews, response time
   - Financial: earnings display
5. [ ] Tap "Opportunities" tab
6. [ ] Tips display
```
**Files:** ✅ HostStatisticsScreen.js
**Backend:** GET /api/host/statistics
**Status:** UI 100% Complete, needs backend data

---

## 🔧 What Needs Work Before Testing

### Backend Endpoints to Verify/Create:

#### Guest Endpoints:
- [ ] POST /api/send-otp ← Verify working
- [ ] POST /api/verify-otp ← Verify working
- [ ] GET /api/properties ← Verify returns data
- [ ] GET /api/properties/:id ← Verify returns details
- [ ] POST /api/bookings ← Verify creates booking
- [ ] POST /api/payments/initialize ← Paystack integration
- [ ] POST /api/payments/webhook/paystack ← Webhook handling
- [ ] GET /api/bookings ← User's bookings
- [ ] PUT /api/bookings/:id/cancel ← Cancel booking

#### Host Endpoints:
- [ ] POST /api/properties ← Create property (receive all 12 steps data)
- [ ] GET /api/host/dashboard ← Dashboard stats
- [ ] GET /api/host/bookings ← Host's property bookings
- [ ] PUT /api/host/bookings/:id/accept ← Accept booking
- [ ] PUT /api/host/bookings/:id/reject ← Reject booking
- [ ] GET /api/host/calendar ← Calendar availability
- [ ] GET /api/host/statistics ← Stats & analytics

### Frontend-Backend Integration:

#### CreatePropertyScreen → Backend:
```javascript
// Need to send all data from 12 steps:
const propertyData = {
  // Step 1-2
  propertyName,
  accountHolderPosition,

  // Step 3-5
  phoneNumber,
  hotelEmail,
  website,

  // Step 6
  hotelType,

  // Step 7
  location, // address

  // Step 8
  mainPhotos: [], // hotel photos

  // Step 8a-8f
  amenityPhotos: [],
  diningPhotos: [],
  specialFeaturePhotos: [],
  eventSpacePhotos: [],
  nearbyAttractionPhotos: [],

  // Step 9
  roomCounts: {
    standard: 2,
    deluxe: 3,
    // etc...
  },

  // Step 10
  roomMedia: {
    standard: [...photos],
    deluxe: [...photos],
  },

  // Step 11
  roomPrices: {
    standard: 15000,
    deluxe: 25000,
  },

  // Step 12
  designConcept,
  uniqueExperiences,
  customerService,
  hotelStory,
};

// POST to /api/properties
```

#### HostDashboardScreen → Backend:
```javascript
// Need to fetch:
GET /api/host/dashboard
// Returns:
{
  property: {...},
  checkedOutCount: 0,
  currentGuestsCount: 0,
  futureGuestsCount: 1,
  recentReviews: [...],
}
```

#### HostBookingsScreen → Backend:
```javascript
// Need to fetch:
GET /api/host/bookings
// Returns:
{
  pending: [...],
  approved: [...],
  rejected: [...],
}
```

---

## 🎯 Pre-Testing Checklist

### Must Work Locally:

**Guest Flow:**
- [ ] Can login with OTP
- [ ] Can see properties list
- [ ] Can view property details
- [ ] Can complete booking
- [ ] Payment processes (test mode)
- [ ] Booking appears in My Bookings

**Host Flow:**
- [ ] Can become a host
- [ ] Can complete all 12 property creation steps
- [ ] Data persists between steps
- [ ] Property submits to backend
- [ ] Host dashboard loads with property
- [ ] Can view bookings (if any exist)
- [ ] Calendar displays
- [ ] Statistics display

---

## 🚀 Testing Strategy

### Phase 1: Local Testing (You)
1. Start backend
2. Start frontend
3. Test guest flow end-to-end
4. Test host flow end-to-end
5. Fix any issues

### Phase 2: Backend Integration
1. Ensure all endpoints exist
2. Connect frontend to backend
3. Test data flow
4. Verify database operations

### Phase 3: Deploy Backend
1. Deploy backend to cloud (Heroku/Railway/Render)
2. Update frontend API_BASE to deployed URL
3. Test again with deployed backend

### Phase 4: Team Testing
1. Publish to Expo
2. Share with 2-3 testers
3. Fix critical bugs
4. Expand testing team

---

## 📝 Quick Test Script

Run this yourself before sharing:

```bash
# Terminal 1: Backend
cd averulo-backend
npm run dev

# Terminal 2: Frontend
npm start
# Press 'i' or 'a' to open app

# Test Guest:
1. Login with your email
2. Browse properties
3. Book a property
4. Complete payment (test card)
5. Check My Bookings

# Test Host:
1. Tap "Become a Host"
2. Complete all 12 steps
3. Submit property
4. Check host dashboard
5. Test navigation (Calendar, Stats, Bookings)
```

---

## ✅ Ready to Share When:

- [ ] Guest can complete full booking flow
- [ ] Payment processes successfully
- [ ] Booking appears in My Bookings
- [ ] Host can create property (all 12 steps)
- [ ] Property appears in host dashboard
- [ ] Host navigation works (Calendar, Stats)
- [ ] No crashes during normal use
- [ ] Backend deployed and accessible

---

**Current Status:**
- ✅ All UI screens complete and Figma-accurate
- ⚠️ Need to verify backend integration
- ⚠️ Need to test end-to-end locally first

**Next Step:** Test yourself locally, then share!
