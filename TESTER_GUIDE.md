# Averulo MVP - Tester Guide

**Welcome to the Averulo testing team! 🎉**

This guide will help you test the app effectively.

---

## 📱 Getting Started (5 minutes)

### Step 1: Install Expo Go
- **iOS:** App Store → Search "Expo Go" → Install
- **Android:** Play Store → Search "Expo Go" → Install

### Step 2: Open the App
- Scan the QR code provided by your team lead
- OR open the link in Expo Go app
- App will download and launch automatically

### Step 3: You're Ready!
Start testing using the checklist below.

---

## 💳 Test Credentials

### Payment Card (Paystack Test):
```
Card Number: 4084084084084081
CVV: 408
Expiry: Any future date (e.g., 12/25)
PIN: 0000
OTP: 123456
```

### Test Emails:
- `tester1@example.com`
- `tester2@example.com`
- Or use your own email

---

## ✅ Testing Checklist

### Test 1: Login & Registration (5 min) 🔴 PRIORITY
**Steps:**
1. [ ] Open app → Tap "Get Started" or "Login"
2. [ ] Enter your email
3. [ ] Tap "Send OTP"
4. [ ] Check your email for OTP code (or check team chat)
5. [ ] Enter OTP
6. [ ] Should reach Home screen

**✅ Success:** You're logged in and see property listings
**❌ Report if:** Can't receive OTP, can't login, app crashes

---

### Test 2: Browse Properties (3 min) 🔴 PRIORITY
**Steps:**
1. [ ] Scroll through property list on Home screen
2. [ ] Tap on any property card
3. [ ] View property details:
   - [ ] Photos display correctly
   - [ ] Price shows
   - [ ] Reviews visible
   - [ ] "Book Now" button present
4. [ ] Tap "View Amenities"
5. [ ] Go back, tap "About this place"
6. [ ] Navigate back to home

**✅ Success:** All property info displays, navigation smooth
**❌ Report if:** Images don't load, crashes, missing info

---

### Test 3: Book a Property (10 min) 🔴 PRIORITY
**Steps:**
1. [ ] From property details, tap "Book Now"
2. [ ] Select check-in date (any future date)
3. [ ] Select check-out date (at least 1 day after check-in)
4. [ ] Select number of guests (1-4)
5. [ ] Tap "Continue"
6. [ ] Review booking details and total price
7. [ ] Tap "Confirm & Pay"
8. [ ] Enter test payment card details:
   - Card: 4084084084084081
   - CVV: 408
   - Expiry: 12/25
9. [ ] Enter PIN: 0000
10. [ ] Enter OTP: 123456
11. [ ] Wait for confirmation
12. [ ] Should see "Booking Success" screen

**✅ Success:** Booking completes, see confirmation with reference number
**❌ Report if:** Payment fails, app crashes, no confirmation

---

### Test 4: View My Bookings (2 min) 🟡
**Steps:**
1. [ ] Navigate to "Bookings" tab (bottom navigation)
2. [ ] View your booking from Test 3
3. [ ] Tap on the booking
4. [ ] View all booking details
5. [ ] Tap "View Ticket" (if available)

**✅ Success:** Booking appears with correct details
**❌ Report if:** Booking missing, wrong details, crashes

---

### Test 5: Become a Host (5 min) 🔴 PRIORITY
**Steps:**
1. [ ] Navigate to Profile screen
2. [ ] Find and tap "Switch to Host" or "Become a Host" button
3. [ ] View "Become a Host in 5 min" screen
4. [ ] Tap "Continue"
5. [ ] Read onboarding checklist:
   - You have a property to rent
   - Your property meets safety standards
   - You can provide quality hospitality
6. [ ] Check "I understand!" checkbox
7. [ ] Tap "Let's go"
8. [ ] Should reach property creation screen

**✅ Success:** Onboarding flow smooth, reaches creation screen
**❌ Report if:** Button missing, can't continue, crashes

---

### Test 6: Create Property - Part 1 (10 min) 🔴 PRIORITY
**Steps (Steps 1-4):**
1. [ ] Enter hotel name: "Test Hotel Lagos"
2. [ ] Enter position: "Owner"
3. [ ] Tap "Continue"
4. [ ] Enter phone: "08012345678"
5. [ ] Enter email: "hotel@test.com"
6. [ ] Enter website: "testhotel.com" (optional)
7. [ ] Tap "Continue"
8. [ ] Select hotel type (any option)
9. [ ] Tap "Continue"
10. [ ] Enter full address: "123 Test Street, Lagos, Nigeria"
11. [ ] Tap "Continue"

**✅ Success:** All steps work, data saves between steps
**❌ Report if:** Can't enter data, can't continue, crashes

---

### Test 6: Create Property - Part 2 (10 min) 🔴 PRIORITY
**Steps (Steps 5-8: Photo Upload):**
1. [ ] Upload 3-5 main hotel photos
2. [ ] Tap "Continue"
3. [ ] Upload Amenity photos (pool, gym, etc.)
4. [ ] Upload Dining photos
5. [ ] Upload Special Feature photos
6. [ ] Upload Event Space photos
7. [ ] Upload Nearby Attraction photos
8. [ ] Tap "Continue" for each category

**✅ Success:** Photos upload successfully, thumbnails show
**❌ Report if:** Can't upload, crashes, photos don't show

---

### Test 6: Create Property - Part 3 (10 min) 🔴 PRIORITY
**Steps (Steps 9-11: Rooms & Pricing):**
1. [ ] **Room Selection Screen:**
   - [ ] Tap "Standard Room" card
   - [ ] Bottom modal opens with counter
   - [ ] Tap + button to increase count to 2
   - [ ] Tap outside modal to close
   - [ ] Tap "Deluxe Room" card
   - [ ] Set count to 3
   - [ ] Tap "Continue"

2. [ ] **Room Photos:**
   - [ ] Upload 3-5 photos for Standard Room
   - [ ] Upload 3-5 photos for Deluxe Room
   - [ ] Tap "Continue"

3. [ ] **Room Pricing:**
   - [ ] Enter price for Standard Room: "15000"
   - [ ] Enter price for Deluxe Room: "25000"
   - [ ] Tap "Continue"

**✅ Success:** Room selection modal works, all data saves
**❌ Report if:** Modal doesn't open, can't select rooms, crashes

---

### Test 6: Create Property - Part 4 (5 min) 🔴 PRIORITY
**Steps (Step 12: Hotel Story):**
1. [ ] Enter design inspiration (optional)
2. [ ] Enter unique experiences (optional)
3. [ ] Enter customer service approach (optional)
4. [ ] Enter hotel story (optional)
5. [ ] Tap "Continue"
6. [ ] Review all information on Confirmation screen
7. [ ] Check all fields display correctly
8. [ ] Tap "Confirm"
9. [ ] Reorder photos if needed (drag & drop)
10. [ ] Tap "Done"
11. [ ] Review final preview
12. [ ] Tap "Create Profile"
13. [ ] Should see success message

**✅ Success:** All 12 steps complete, property submitted
**❌ Report if:** Can't complete, data lost, crashes

---

### Test 7: Host Dashboard (5 min) 🟡
**Steps:**
1. [ ] After admin approves, tap approval banner
2. [ ] View "Congratulations!" welcome screen
3. [ ] Tap "Continue"
4. [ ] View Host Dashboard:
   - [ ] Property card displays
   - [ ] Tabs work (Checked out, Currently guests, Future guest)
   - [ ] "View Bookings" button works
5. [ ] Test bottom navigation:
   - [ ] Tap Chat → ChatScreen
   - [ ] Tap Calendar → Calendar view
   - [ ] Tap Statistic → Statistics screen
   - [ ] Tap Home → Back to dashboard

**✅ Success:** All screens load, navigation smooth
**❌ Report if:** Crashes, screens don't load, navigation broken

---

### Test 8: Host Calendar (3 min) 🟡
**Steps:**
1. [ ] From host dashboard, tap Calendar icon
2. [ ] View calendar grid (12 rooms × 7 days)
3. [ ] Tap different dates in date selector
4. [ ] Active date highlights in dark blue
5. [ ] Check color coding:
   - White with border = Vacant
   - Light gray = Occupied
   - Dark blue = Reserved
6. [ ] View reservations list below grid
7. [ ] Scroll through guest cards

**✅ Success:** Grid displays correctly, colors accurate, dates selectable
**❌ Report if:** Grid broken, wrong colors, crashes

---

### Test 9: Host Statistics (3 min) 🟡
**Steps:**
1. [ ] From host dashboard, tap Statistic icon
2. [ ] View Statistics screen with 3 tabs
3. [ ] Check default tab is "Reviews"
4. [ ] Tap "Stats" tab:
   - [ ] View occupancy chart (semi-circle showing 75%)
   - [ ] Check chart colors: light blue background, dark blue fill
   - [ ] View stats row: 3★ rating, 3 reviews, 1hrs response
   - [ ] View financial section: $644,653
5. [ ] Tap "Opportunities" tab
6. [ ] Tap back to "Reviews" tab

**✅ Success:** All tabs work, chart displays correctly, data shows
**❌ Report if:** Chart wrong, tabs broken, crashes

---

### Test 10: Host Booking Management (5 min) 🟡
**Steps:**
1. [ ] From host dashboard, tap "View Bookings"
2. [ ] View three sections: Pending, Approved, Rejected
3. [ ] Tap a Pending booking
4. [ ] View booking request screen:
   - [ ] Guest details display
   - [ ] Room image shows correctly
   - [ ] Timer counts down from 30:00
5. [ ] Tap "Accept":
   - [ ] See success screen with checkmark
   - [ ] See guest details
   - [ ] Room image displays
6. [ ] OR tap "Reject":
   - [ ] See decline screen
   - [ ] Select rejection reason
   - [ ] Tap reason card to select

**✅ Success:** Booking flow works, images display, navigation smooth
**❌ Report if:** Timer broken, can't accept/reject, images missing

---

### Test 11: Search Properties (3 min) 🟢
**Steps:**
1. [ ] On Home screen, tap search bar
2. [ ] Enter location: "Lagos"
3. [ ] Select dates
4. [ ] Select guests
5. [ ] Tap "Search"
6. [ ] View filtered results
7. [ ] Apply price filter
8. [ ] Apply rating filter

**✅ Success:** Search works, filters apply correctly
**❌ Report if:** No results, filters broken, crashes

---

### Test 12: Write Review (3 min) 🟢
**Steps:**
1. [ ] Navigate to "Bookings" tab
2. [ ] Find a completed booking
3. [ ] Tap "Write Review"
4. [ ] Select star rating (1-5)
5. [ ] Enter review text
6. [ ] Tap "Submit"
7. [ ] View confirmation

**✅ Success:** Review submits, appears on property page
**❌ Report if:** Can't submit, rating doesn't save, crashes

---

### Test 13: Profile & Settings (2 min) 🟢
**Steps:**
1. [ ] Navigate to Profile screen
2. [ ] Tap "Edit Profile"
3. [ ] Update name/photo
4. [ ] Save changes
5. [ ] Navigate to Settings
6. [ ] Check notification settings
7. [ ] Check privacy settings

**✅ Success:** Profile updates save, settings load
**❌ Report if:** Can't save, settings broken, crashes

---

### Test 14: Chat/Messages (2 min) 🟢
**Steps:**
1. [ ] Navigate to Chat tab (guest or host)
2. [ ] View messages list
3. [ ] Tap a conversation
4. [ ] View chat interface
5. [ ] Type test message
6. [ ] Send message

**✅ Success:** Chat loads, messages display
**❌ Report if:** Messages don't load, can't send, crashes

---

## 🐛 How to Report Issues

### When you find a bug:
1. **Take a screenshot** (or screen recording if possible)
2. **Note what you were doing** - Which test? Which step?
3. **Note what happened** - Error message? Crash? Wrong display?
4. **Note your device** - iPhone 12, Android Samsung S21, etc.
5. **Send to team** - Use the reporting channel provided

### Bug Report Template:
```
Test: [Test 3: Book a Property]
Step: [Step 8 - Enter payment card]
Issue: App crashes when I tap Pay button
Expected: Should process payment
Device: iPhone 13, iOS 17.2
Screenshot: [attached]
Time: Dec 20, 2:30 PM
```

---

## ⏰ Testing Timeline

**Estimated Time per Test:**
- 🔴 Priority (Tests 1-6): ~60 minutes total
- 🟡 Important (Tests 7-10): ~20 minutes total
- 🟢 Secondary (Tests 11-14): ~15 minutes total

**Total:** ~90 minutes for comprehensive testing

**Recommended Approach:**
- Day 1: Do all Priority tests (🔴)
- Day 2: Do Important tests (🟡)
- Day 3: Do Secondary tests (🟢)

---

## 🎯 Focus Areas

### Most Critical (Must Work):
1. ✅ Login
2. ✅ Browse properties
3. ✅ Complete booking with payment
4. ✅ Host onboarding
5. ✅ Create property (all 12 steps)
6. ✅ Host dashboard

### Important (Should Work):
7. Host calendar
8. Host statistics
9. Booking management
10. Search & filters

### Nice to Have (Can have minor issues):
11. Reviews
12. Profile
13. Chat
14. Settings

---

## 💡 Testing Tips

1. **Take your time** - Don't rush through
2. **Test on poor connection** - Try with WiFi off/on
3. **Try to break it** - Enter weird data, tap rapidly, go back/forward
4. **Test edge cases** - Very long text, special characters
5. **Different scenarios** - Book same property twice, cancel bookings
6. **Check all screens** - Don't skip navigation
7. **Report everything** - Even small visual glitches

---

## 🎉 You're All Set!

Start with **Test 1 (Login)** and work your way down the checklist.

**Questions?** Contact your team lead.

**Found a bug?** Report it immediately!

**Thank you for helping us test Averulo!** 🙏

---

*Testing Guide v1.0*
*Last Updated: 2025-12-20*
