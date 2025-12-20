# Complete App Testing Guide - Averulo
## For Non-Technical Testers on Physical Phones

---

## 📱 Setup (5 Minutes)

### Step 1: Install Expo Go on Your Phone

**iPhone Users:**
1. Open App Store
2. Search "Expo Go"
3. Install the app

**Android Users:**
1. Open Play Store
2. Search "Expo Go"
3. Install the app

### Step 2: Connect to the App

**Ask the developer to start the server:**
```bash
cd averulo-app
npm start
```

**On Your Phone:**
1. Make sure you're on the **same WiFi** as the developer's computer
2. Open **Expo Go** app
3. Scan the QR code shown in the terminal
4. Wait for app to load (30-60 seconds first time)

---

## 🗺️ Complete App Flow Map

```
SPLASH SCREEN
    ↓
LOGIN/SIGNUP
    ↓
    ├─→ GUEST FLOWS (Property Search & Booking)
    │   ├─ Browse Properties
    │   ├─ Search & Filter
    │   ├─ View Property Details
    │   ├─ Make Booking
    │   ├─ Payment
    │   ├─ View My Bookings
    │   ├─ Write Reviews
    │   └─ Profile & Settings
    │
    └─→ HOST FLOWS (Property Management)
        ├─ Become a Host
        ├─ Create Property (12 steps)
        ├─ Manage Properties
        ├─ View Bookings
        └─ View Reviews
```

---

## 📋 Testing Scenarios

### Choose Your Test Path:

1. **Quick Test (15 min)**: Test one complete booking flow
2. **Guest Full Test (30 min)**: Test all guest features
3. **Host Full Test (30 min)**: Test all host features
4. **Complete Test (60 min)**: Test entire app

---

## 🏃 QUICK TEST (15 Minutes)

Perfect for first-time testers or quick demos.

### Test: Complete Property Booking Flow

1. **Login** (1 min)
   - [ ] Enter email
   - [ ] Enter OTP code
   - [ ] Successfully login

2. **Browse & Search** (2 min)
   - [ ] See property list on home screen
   - [ ] Scroll through properties
   - [ ] Click on a property

3. **Property Details** (2 min)
   - [ ] View photos
   - [ ] Read description
   - [ ] Check amenities
   - [ ] See location on map
   - [ ] View room types

4. **Make Booking** (5 min)
   - [ ] Select dates (check-in/check-out)
   - [ ] Enter number of guests
   - [ ] Select room type
   - [ ] Review booking details
   - [ ] See total price calculation
   - [ ] Confirm booking

5. **Payment** (3 min)
   - [ ] View payment screen
   - [ ] See payment options
   - [ ] Complete payment (test mode)
   - [ ] See booking success screen

6. **View Booking** (2 min)
   - [ ] Go to "My Bookings"
   - [ ] See your booking listed
   - [ ] View booking details

**✅ Quick Test Complete!**

---

## 👤 GUEST FLOWS - FULL TEST (30 Minutes)

### Flow 1: Authentication (3 min)

#### A. Sign Up (New User)
- [ ] Launch app, see splash screen
- [ ] Tap "Sign Up"
- [ ] Enter email address
- [ ] Receive OTP (check console or email)
- [ ] Enter OTP
- [ ] Successfully create account
- [ ] See home screen

#### B. Login (Existing User)
- [ ] Tap "Login"
- [ ] Enter registered email
- [ ] Enter OTP
- [ ] Successfully login

---

### Flow 2: Browse Properties (5 min)

#### Home Screen
- [ ] See featured properties
- [ ] See property cards with:
  - [ ] Property image
  - [ ] Property name
  - [ ] Location
  - [ ] Price per night
  - [ ] Rating stars
- [ ] Scroll vertically to see more properties
- [ ] Pull down to refresh list

#### Search & Filter
- [ ] Tap search bar
- [ ] Enter location (e.g., "Lagos")
- [ ] See search results
- [ ] Apply filters:
  - [ ] Price range
  - [ ] Hotel type
  - [ ] Amenities (WiFi, Pool, etc.)
  - [ ] Star rating
- [ ] See filtered results
- [ ] Clear filters

---

### Flow 3: Property Details (7 min)

- [ ] Tap on any property card
- [ ] Navigate to Property Details screen

#### Check All Sections:
- [ ] **Photo Gallery**
  - [ ] Swipe through multiple photos
  - [ ] Photos load correctly
  - [ ] Full-screen photo view

- [ ] **Basic Info**
  - [ ] Property name
  - [ ] Location with map
  - [ ] Rating and reviews count
  - [ ] Price per night

- [ ] **About Section**
  - [ ] Read full description
  - [ ] Expand/collapse "read more"

- [ ] **Amenities**
  - [ ] See amenity icons
  - [ ] Tap "View All Amenities"
  - [ ] See complete amenities list
  - [ ] Go back

- [ ] **Room Types**
  - [ ] See available room types
  - [ ] See room photos
  - [ ] See room prices
  - [ ] See room capacity

- [ ] **Location**
  - [ ] See map with property pin
  - [ ] See address
  - [ ] Test map interactions (zoom, pan)

- [ ] **Reviews**
  - [ ] See guest reviews
  - [ ] See reviewer names and dates
  - [ ] See star ratings
  - [ ] Scroll through reviews

- [ ] **Bottom Actions**
  - [ ] See "Book Now" button
  - [ ] See price summary
  - [ ] Favorite/heart icon works

---

### Flow 4: Booking Process (10 min)

#### Step 1: Booking Details
- [ ] Tap "Book Now" on property
- [ ] Navigate to Booking Details screen

**Date Selection:**
- [ ] Tap check-in date
- [ ] See calendar popup
- [ ] Select check-in date
- [ ] Tap check-out date
- [ ] Select check-out date (must be after check-in)
- [ ] See number of nights calculated

**Guest Selection:**
- [ ] Tap "Number of Guests"
- [ ] Increase/decrease adults count
- [ ] Increase/decrease children count
- [ ] Confirm selection

**Room Selection:**
- [ ] See available room types
- [ ] Tap room type to select
- [ ] See room highlighted
- [ ] See price update

---

#### Step 2: Confirm Booking
- [ ] Tap "Continue" or "Confirm Booking"
- [ ] Navigate to Confirm Booking screen

**Review Details:**
- [ ] Property name and image
- [ ] Selected dates
- [ ] Number of nights
- [ ] Number of guests
- [ ] Room type selected

**Price Breakdown:**
- [ ] Base price (price × nights)
- [ ] Service fees
- [ ] Taxes
- [ ] **Total price**
- [ ] Verify calculations are correct

**Contact Information:**
- [ ] Enter guest name (if required)
- [ ] Enter phone number
- [ ] Enter special requests (optional)

- [ ] Tap "Proceed to Payment"

---

#### Step 3: Payment
- [ ] Navigate to Payment screen

**Payment Information:**
- [ ] See total amount
- [ ] See payment methods:
  - [ ] Card payment
  - [ ] Bank transfer
  - [ ] Paystack integration

**Test Payment:**
- [ ] Enter test card details (if in test mode)
- [ ] Or select test payment option
- [ ] Tap "Pay Now"
- [ ] See loading/processing state

**Payment Success:**
- [ ] See "Booking In Progress" screen (if applicable)
- [ ] Navigate to "Booking Success" screen
- [ ] See confirmation message
- [ ] See booking reference number
- [ ] See "View Booking" button
- [ ] See "Back to Home" button

---

### Flow 5: My Bookings (3 min)

- [ ] Navigate to "Bookings" tab
- [ ] See list of your bookings

**Booking List:**
- [ ] See booking cards with:
  - [ ] Property image
  - [ ] Property name
  - [ ] Check-in/check-out dates
  - [ ] Booking status (Pending/Confirmed/Cancelled)
  - [ ] Total price

**Booking Details:**
- [ ] Tap on a booking
- [ ] Navigate to Booking Details screen
- [ ] See complete booking information
- [ ] See booking ticket/QR code (if available)
- [ ] See cancel booking option (if applicable)

**Booking Ticket:**
- [ ] Tap "View Ticket"
- [ ] See digital ticket
- [ ] See QR code
- [ ] See all booking details

---

### Flow 6: Reviews (2 min)

**Write Review:**
- [ ] Navigate to completed booking
- [ ] Tap "Write Review"
- [ ] See review form:
  - [ ] Star rating (1-5 stars)
  - [ ] Review text area
  - [ ] Upload photos (optional)
- [ ] Select star rating
- [ ] Write review text
- [ ] Submit review
- [ ] See success message

**View Reviews:**
- [ ] Go back to property details
- [ ] See your review listed
- [ ] See review with your name and date

---

### Flow 7: Profile & Settings (3 min)

**Profile Screen:**
- [ ] Navigate to "Profile" tab
- [ ] See profile photo
- [ ] See name and email
- [ ] See "Edit Profile" button

**Edit Profile:**
- [ ] Tap "Edit Profile"
- [ ] Update name
- [ ] Update phone number
- [ ] Upload/change profile photo
- [ ] Save changes
- [ ] See updated profile

**Settings:**
- [ ] Navigate to Settings
- [ ] See notification settings
- [ ] Toggle notification options
- [ ] See language settings
- [ ] See privacy policy
- [ ] See terms of service
- [ ] See logout option

---

## 🏠 HOST FLOWS - FULL TEST (30 Minutes)

### Flow 1: Become a Host (25 min)

#### Entry Point
- [ ] Navigate to "Become a Host" section
- [ ] See host welcome screen

---

#### Screen 1: Welcome Screen (1 min)
- [ ] See illustration
- [ ] See "Become a Host in 5 min" title
- [ ] See description
- [ ] Tap "Continue" button
- [ ] Navigate to onboarding

---

#### Screen 2: Host Onboarding (1 min)
- [ ] See "Ready to Host?" title
- [ ] See requirements list:
  - [ ] Property photos
  - [ ] Documents
  - [ ] Valid ID
  - [ ] Property address
  - [ ] Room details
- [ ] See "How Hosting Works" steps
- [ ] Try tapping "Let's go" without checkbox
  - [ ] See alert
- [ ] Check "I understand!" checkbox
- [ ] Tap "Let's go"
- [ ] Navigate to property creation

---

#### Property Creation: 12 Steps (20 min)

Watch the **progress bar** increase with each step!

---

##### Step 1: Property Name (1 min)
- [ ] See progress bar at ~8%
- [ ] See question: "What is the Name of your hotel"
- [ ] Try continuing without text
  - [ ] See validation alert
- [ ] Enter hotel name: "Grand Sunset Hotel"
- [ ] Tap "Let's go"
- [ ] Progress bar increases

---

##### Step 2: Position (1 min)
- [ ] See progress bar at ~16%
- [ ] See "Skip" button
- [ ] Enter position: "General Manager"
- [ ] Tap "Continue"

---

##### Step 3: Select Roles (1 min)
- [ ] See progress bar at ~25%
- [ ] See 6 role cards:
  - [ ] General Manager
  - [ ] Receptionist
  - [ ] Hotel Manager
  - [ ] Housekeeping Manager
  - [ ] F&B Manager
  - [ ] Sales Manager
- [ ] Tap 2-3 roles to select
  - [ ] Cards change color when selected
- [ ] Tap again to deselect
- [ ] Tap "Continue"

---

##### Step 4: Contact Info (1 min)
- [ ] See progress bar at ~33%
- [ ] See 3 input fields
- [ ] Try continuing without filling
  - [ ] See validation alert
- [ ] Enter phone: "08012345678"
- [ ] Enter email: "hotel@grandsunset.com"
- [ ] Enter website: "www.grandsunset.com" (optional)
- [ ] Tap "Continue"

---

##### Step 5: Hotel Type (1 min)
- [ ] See progress bar at ~41%
- [ ] See 4 hotel types with radio buttons
- [ ] Try continuing without selection
  - [ ] See validation alert
- [ ] Select "Urban Boutique Hotel"
  - [ ] Radio fills, card highlights
- [ ] Tap "Continue"

---

##### Step 6: Location (1 min)
- [ ] See progress bar at ~50%
- [ ] See map placeholder
- [ ] See address input
- [ ] Enter address: "123 Victoria Island, Lagos"
- [ ] Tap "Continue"

---

##### Step 7: Amenities (1 min)
- [ ] See progress bar at ~58%
- [ ] See 7 amenities:
  - [ ] Free Wi-Fi
  - [ ] Pool
  - [ ] Fitness Center
  - [ ] Breakfast
  - [ ] Pet-Friendly
  - [ ] Car Park
  - [ ] 24/7 Security
- [ ] Select 4-5 amenities
  - [ ] Checkboxes fill, cards highlight
- [ ] See "Others +" button
- [ ] Tap "Continue" (or "Skip")

---

##### Step 8: Media Upload (3 min) 🔥 **KEY FEATURE**
- [ ] See progress bar at ~66%
- [ ] See 7 media categories

**For Each Category (test at least 3):**

**1. Exterior Videos:**
- [ ] Tap card
- [ ] Video picker opens
- [ ] Select 1-2 videos
- [ ] See "2 uploaded" text

**2. Exterior Photos:**
- [ ] Tap "Upload photos"
- [ ] Photo picker opens
- [ ] Select 3-5 photos from phone
- [ ] See "5 uploaded" text
- [ ] See **reorder button** (three horizontal lines) appear
- [ ] Tap reorder button

**Reorder Screen:**
- [ ] Navigate to reorder screen
- [ ] See first photo large (main photo) with blue border
- [ ] See other photos as thumbnails
- [ ] Tap a thumbnail
  - [ ] See checkmark overlay appear
  - [ ] Photo border highlights
- [ ] Tap another photo
  - [ ] Photos swap positions
  - [ ] Checkmark clears
- [ ] Tap "Continue" to return
- [ ] Photos saved in new order

**3-7. Other Categories:**
- [ ] Upload photos to at least 2 more categories
- [ ] Test reorder on one more category
- [ ] Tap "Continue" when done

---

##### Step 9: Room Selection (2 min)
- [ ] See progress bar at ~75%
- [ ] See 10 room type cards

**Test 3-4 Room Types:**
- [ ] See bed icon and room name
- [ ] Initially no counter visible
- [ ] Tap card once (or click the label area)
- [ ] Counter section appears below with:
  - [ ] "Number of room" label
  - [ ] Plus (+) button
  - [ ] Number display
  - [ ] Minus (-) button

**For each selected room:**
- [ ] Tap "+" button 3-4 times
  - [ ] Number increases
  - [ ] Count shows in room label too
- [ ] Tap "-" button once
  - [ ] Number decreases
- [ ] See both displays update

**Select rooms like:**
- [ ] Standard Room: 5
- [ ] Deluxe Room: 3
- [ ] Suite: 2

- [ ] Tap "Continue"

---

##### Step 10: Room Media Upload (2 min)
- [ ] See progress bar at ~83%
- [ ] See ONLY cards for rooms selected in Step 9
- [ ] Each card shows:
  - [ ] Placeholder image area
  - [ ] Bed icon
  - [ ] Room name and count

**For Each Room Type:**
- [ ] Tap "Upload Media" button
- [ ] Photo picker opens
- [ ] Select 2-3 room photos
- [ ] Button updates to show count
- [ ] **Reorder button** appears
- [ ] Tap reorder button
- [ ] Test reorder functionality (same as Step 8)

- [ ] Upload media for all room types
- [ ] Tap "Continue"

---

##### Step 11: Room Pricing (2 min)
- [ ] See progress bar at ~91%
- [ ] See ONLY cards for selected rooms

**For Each Room:**
- [ ] See room photo (if uploaded in Step 10)
  - [ ] OR placeholder icon if no photo
- [ ] See room name with colon
- [ ] See price input box with **$** symbol
- [ ] Tap input field
- [ ] Enter price (e.g., "150" for Standard, "250" for Deluxe)
- [ ] Number appears next to $ symbol

**Enter prices like:**
- [ ] Standard Room: $120
- [ ] Deluxe Room: $200
- [ ] Suite: $350

- [ ] Tap "Continue"

---

##### Step 12: Unique Details (2 min)
- [ ] See progress bar at ~100%
- [ ] See 5 text areas with questions

**Fill in at least 3:**

1. **Design Concept:**
   - [ ] See question + hint text
   - [ ] Tap text area
   - [ ] Enter text (e.g., "Modern minimalist design inspired by coastal living")

2. **Unique Experiences:**
   - [ ] Enter text (e.g., "Rooftop sunset yoga, local cooking classes")

3. **Customer Service:**
   - [ ] Enter text (e.g., "24/7 concierge, multilingual staff")

4. **Hotel Story:** (optional)
   - [ ] Enter text or skip

5. **Other Details:** (optional)
   - [ ] Enter text or skip

- [ ] Scroll to verify all inputs accessible
- [ ] Tap "Continue"
- [ ] Progress bar at 100%

---

#### Screen 3: Confirmation (2 min)
- [ ] Navigate to Confirmation screen
- [ ] See "Review Your Listing" title

**Verify All Sections Display:**

- [ ] **Basic Information**
  - [ ] Property name
  - [ ] Your position
  - [ ] Phone number
  - [ ] Email
  - [ ] Website (if entered)
  - [ ] "Edit" button

- [ ] **Property Type & Location**
  - [ ] Hotel type
  - [ ] Location address
  - [ ] "Edit" button

- [ ] **Amenities**
  - [ ] Shows as colored tags
  - [ ] All selected amenities visible
  - [ ] "Edit" button

- [ ] **Property Media**
  - [ ] Shows photo/video counts
  - [ ] "5 photos, 2 videos" format
  - [ ] "Edit" button

- [ ] **Room Types & Pricing**
  - [ ] Each room shows:
    - [ ] Room name
    - [ ] Count (e.g., "5 rooms")
    - [ ] Price (e.g., "$120")
  - [ ] "Edit" button

- [ ] **Unique Details**
  - [ ] Shows text entered
  - [ ] Truncated with "..." if long
  - [ ] "Edit" button

**Test Edit Function:**
- [ ] Tap "Edit" on any section
- [ ] Navigate back to that step
- [ ] Make a change
- [ ] Continue through to confirmation again
- [ ] See change reflected

**Blue Info Box:**
- [ ] See info icon
- [ ] See "24-48 hours" review message

**Submit:**
- [ ] Tap "Submit for Review" button
- [ ] See loading spinner (2 seconds)
- [ ] Navigate to preview screen

---

#### Screen 4: Property Preview (2 min)
- [ ] See "Confirm" header
- [ ] See "Check out your hotel!" title
- [ ] See subtitle

**Scroll Through Preview:**

- [ ] **Main Hotel Image**
  - [ ] Shows first exterior photo
  - [ ] Displays correctly

- [ ] **Hotel Info**
  - [ ] Location name, "5/5"
  - [ ] Five yellow stars

- [ ] **Description**
  - [ ] Shows design concept text
  - [ ] Truncated to 3 lines

- [ ] **Amenities Section**
  - [ ] Shows first 6 amenities with checkmarks
  - [ ] "Show all X amenities" link (if more than 6)
  - [ ] Tap to expand
    - [ ] All amenities show
    - [ ] "Show less" link appears

- [ ] **About the Place**
  - [ ] Full design concept text
  - [ ] "read more →" link

- [ ] **Contact Information**
  - [ ] Hotel name in box
  - [ ] Hotel email in box
  - [ ] Website in box

- [ ] **Location**
  - [ ] Map placeholder
  - [ ] Address in box

- [ ] **Type of Hotel**
  - [ ] Shows selected type

- [ ] **Photo Galleries**
  - [ ] Exterior Photos section
    - [ ] Shows up to 3 photos
  - [ ] Interior Photos (if uploaded)
  - [ ] Dining photos (if uploaded)
  - [ ] Spa/Wellness photos (if uploaded)

- [ ] **Room Type Cards**
  - [ ] Each room shows:
    - [ ] 2 photos side-by-side (if uploaded)
    - [ ] Room name
    - [ ] Count (e.g., "5 rooms")
    - [ ] Price (e.g., "$120")
    - [ ] "Back More" button (dark blue)

**Create Profile:**
- [ ] Scroll to bottom
- [ ] See "Create Profile" button (fixed at bottom)
- [ ] Tap "Create Profile"

---

#### Screen 5: Success Modal (1 min)
- [ ] See dark overlay (semi-transparent)
- [ ] See white modal card centered

**Modal Content:**
- [ ] See large checkmark icon
  - [ ] White checkmark
  - [ ] Dark blue circle background
- [ ] See message: "Pending approval, we'll update you shortly."
- [ ] See "Back to Profile" button (dark blue)

**Complete Flow:**
- [ ] Tap "Back to Profile"
- [ ] Modal closes
- [ ] Navigate to Home/Main screen
- [ ] **🎉 Host property creation flow COMPLETE!**

---

### Flow 2: Host Dashboard (5 min)

**View Properties:**
- [ ] Navigate to host dashboard
- [ ] See list of submitted properties
- [ ] See property status (Pending/Approved/Rejected)

**Manage Bookings:**
- [ ] See bookings for your properties
- [ ] View booking details
- [ ] Accept/reject bookings (if applicable)

**View Reviews:**
- [ ] See reviews for your properties
- [ ] Read guest feedback
- [ ] Respond to reviews (if applicable)

---

## 👮 ADMIN FLOWS (If Testing Admin Features)

### Admin Dashboard (5 min)

**KYC Verification:**
- [ ] Navigate to Admin KYC Dashboard
- [ ] See pending KYC submissions
- [ ] View user documents
- [ ] Approve/reject submissions

**User Management:**
- [ ] View all users
- [ ] See user details
- [ ] Manage user roles

**Property Management:**
- [ ] View all properties
- [ ] Approve/reject new properties
- [ ] Edit property details

**Booking Management:**
- [ ] View all bookings
- [ ] See booking statistics
- [ ] Manage cancellations

**Payment Management:**
- [ ] View payment history
- [ ] See revenue analytics
- [ ] Export reports

---

## ✅ COMPLETE TESTING CHECKLIST

### Pre-Test Setup
- [ ] Install Expo Go app on phone
- [ ] Connect to same WiFi as dev computer
- [ ] Scan QR code
- [ ] App loads successfully
- [ ] Have 10-15 photos ready on phone for testing

### Authentication
- [ ] Sign up works
- [ ] Login works
- [ ] OTP delivery works
- [ ] Logout works

### Guest Features
- [ ] Browse properties
- [ ] Search properties
- [ ] Filter properties
- [ ] View property details
- [ ] View amenities
- [ ] View location on map
- [ ] View reviews
- [ ] Select dates
- [ ] Select guests
- [ ] Select room type
- [ ] Calculate price correctly
- [ ] Confirm booking
- [ ] Payment process
- [ ] View bookings
- [ ] View booking ticket
- [ ] Write review
- [ ] Upload review photos
- [ ] Edit profile
- [ ] Update profile photo

### Host Features
- [ ] Access become host screen
- [ ] Complete onboarding
- [ ] Step 1: Property name
- [ ] Step 2: Position
- [ ] Step 3: Roles selection
- [ ] Step 4: Contact info
- [ ] Step 5: Hotel type
- [ ] Step 6: Location
- [ ] Step 7: Amenities
- [ ] Step 8: Media upload (all 7 categories)
- [ ] Photo reorder functionality
- [ ] Step 9: Room selection
- [ ] Step 10: Room media
- [ ] Step 11: Room pricing
- [ ] Step 12: Unique details
- [ ] Confirmation screen
- [ ] Edit functionality
- [ ] Preview screen
- [ ] Success modal
- [ ] View host dashboard
- [ ] Manage properties

### UI/UX
- [ ] All text readable
- [ ] Images load correctly
- [ ] Buttons respond to taps
- [ ] Inputs accept text
- [ ] Keyboard appears/dismisses properly
- [ ] Scrolling smooth
- [ ] Navigation smooth
- [ ] Back button works
- [ ] Progress bar updates
- [ ] Loading states show
- [ ] Error messages clear
- [ ] Success messages show
- [ ] Modals display correctly

### Edge Cases
- [ ] Try without internet (see error handling)
- [ ] Try with slow internet
- [ ] Try submitting empty forms
- [ ] Try invalid email formats
- [ ] Try selecting past dates
- [ ] Try uploading large images
- [ ] Try uploading 20+ photos
- [ ] Rapidly tap buttons (no crashes)
- [ ] Background/foreground app (state preserved)
- [ ] Rotate phone (if applicable)

---

## 🐛 BUG REPORTING

### When You Find a Bug

**Take These Steps:**
1. **Screenshot** the error screen
2. **Note** exactly what you did
3. **Write** what you expected
4. **Record** what actually happened

**Use This Template:**

```
BUG REPORT #[number]

Flow: [Guest/Host/Admin]
Screen: [Screen name]
Device: [iPhone 12 / Samsung Galaxy S21]

Steps to Reproduce:
1. [Action 1]
2. [Action 2]
3. [Action 3]

Expected Result:
[What should happen]

Actual Result:
[What actually happened]

Screenshot: [Attach]

Additional Notes:
[Any other observations]
```

### Bug Severity Levels

**🔴 Critical (Report Immediately):**
- App crashes
- Cannot complete core flows
- Data loss
- Payment errors

**🟡 High (Report Soon):**
- Features don't work
- Wrong information displayed
- Navigation broken

**🟢 Medium (Note and Report):**
- UI glitches
- Typos
- Minor visual issues

**⚪ Low (Optional):**
- Suggestions
- Nice-to-have features

---

## 📊 TESTING METRICS

Track your testing progress:

### Time Estimates
- **Quick Test**: 15 minutes
- **Guest Full Test**: 30 minutes
- **Host Full Test**: 30 minutes
- **Complete Test**: 60 minutes
- **Edge Cases**: +15 minutes

### Coverage Goals
- [ ] Test 100% of main flows
- [ ] Test 80% of secondary features
- [ ] Test 50% of edge cases
- [ ] Find at least 5 minor issues
- [ ] Complete 2 full end-to-end flows

---

## 🎯 TESTING SCENARIOS

### Scenario 1: First-Time Guest
**Goal:** Book a property for a weekend trip

1. Sign up for new account
2. Browse properties
3. Use search to find Lagos properties
4. Filter for "Pool" amenity
5. Select a property
6. Book for next weekend (2 nights)
7. Select Deluxe room
8. Complete payment
9. View booking confirmation

**Time:** 15 minutes

---

### Scenario 2: Returning Guest
**Goal:** Rebook favorite property and write review

1. Login
2. Go to My Bookings
3. Find past booking
4. Write review for completed stay
5. Upload photos with review
6. Book same property again
7. Check booking list

**Time:** 10 minutes

---

### Scenario 3: New Host
**Goal:** List your first property

1. Navigate to Become Host
2. Complete all 12 steps
3. Upload photos for all categories
4. Add 3 room types with pricing
5. Submit for review
6. Verify confirmation

**Time:** 25 minutes

---

### Scenario 4: Property Manager
**Goal:** Update existing property

1. Login as host
2. View properties
3. Edit property details
4. Update room prices
5. Add new photos
6. Save changes

**Time:** 10 minutes

---

## 💡 TESTING TIPS

### For Best Results:

1. **Use Real Phone Gestures**
   - Swipe naturally
   - Tap like a normal user
   - Use phone keyboard

2. **Test Like a Real User**
   - Don't rush
   - Read the text
   - Look at the details
   - Use realistic data

3. **Test Different Scenarios**
   - Happy path (everything works)
   - Sad path (things go wrong)
   - Edge cases (unusual inputs)

4. **Test on Multiple Devices** (If Possible)
   - iPhone vs Android
   - Small screen vs large screen
   - Older devices vs newer

5. **Note Performance**
   - Is it fast?
   - Any lag or stuttering?
   - Images load quickly?

### Common Test Data

**Hotels:**
- "Grand Sunset Resort"
- "Luxury Beach Hotel"
- "Urban Business Center"

**Locations:**
- "123 Victoria Island, Lagos"
- "456 Lekki Phase 1, Lagos"
- "789 Ikoyi, Lagos"

**Emails:**
- "test.guest@example.com"
- "test.host@example.com"
- "admin@example.com"

**Phone Numbers:**
- "08012345678"
- "08098765432"

---

## 🆘 TROUBLESHOOTING

### Issue: QR code won't scan
**Solution:**
- Make sure phone on same WiFi
- Ask dev to restart server
- Try typing URL manually in Expo Go

### Issue: App won't load
**Solution:**
- Check WiFi connection
- Close and reopen Expo Go
- Ask dev to check terminal for errors

### Issue: Photos won't upload
**Solution:**
- Check photo permissions in phone settings
- Try smaller photos
- Restart app

### Issue: Keyboard covers input
**Solution:**
- Scroll down to see input
- This might be a bug - report it!

### Issue: App crashes
**Solution:**
- Restart Expo Go
- Reload app (shake phone → Reload)
- Report the crash with steps to reproduce

### Issue: Can't type in field
**Solution:**
- Tap directly on input field
- Check if keyboard appears
- Try different input field
- Report if problem persists

---

## ✨ SUCCESS CRITERIA

### Testing is successful when:

✅ **Completeness**
- All major flows tested
- Most features work correctly
- Known bugs documented

✅ **User Experience**
- App feels intuitive
- Navigation makes sense
- Forms easy to fill
- Errors are clear

✅ **Performance**
- App loads quickly
- No crashes in normal use
- Images display properly
- Animations smooth

✅ **Functionality**
- Can complete bookings
- Can create properties
- Payment works
- Data saves correctly

---

## 📱 DEVICE TESTING MATRIX

Test on different devices if possible:

| Device Type | Screen Size | OS | Priority |
|-------------|-------------|-----|----------|
| iPhone 14 Pro | Large | iOS 17 | High |
| iPhone SE | Small | iOS 16 | Medium |
| Samsung S23 | Large | Android 13 | High |
| Google Pixel | Medium | Android 12 | Medium |
| Older iPhone | Small | iOS 15 | Low |
| Older Android | Medium | Android 11 | Low |

---

## 🎬 FINAL NOTES

### Before You Start Testing:
1. Read this guide fully
2. Install Expo Go
3. Connect to WiFi
4. Have photos ready
5. Charge your phone!

### During Testing:
1. Follow the flows in order
2. Take notes as you go
3. Screenshot any issues
4. Don't skip steps
5. Test like a real user

### After Testing:
1. Submit bug reports
2. Share feedback
3. Note what worked well
4. Suggest improvements
5. Thank you! 🙏

---

**Ready to Test? Let's Go! 🚀**

**Questions?** Ask the development team!

**Happy Testing! 🎉**
