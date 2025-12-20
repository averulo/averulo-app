# Testing Guide - Host Property Creation Flow

## For Non-Technical Testers

This guide will help you test the new host property creation feature in the Averulo app.

---

## Quick Start (3 Easy Steps)

### 1. Install Expo Go App
Download the **Expo Go** app on your phone:
- **iPhone**: [Download from App Store](https://apps.apple.com/app/expo-go/id982107779)
- **Android**: [Download from Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

### 2. Get the App Running
Ask a developer to:
1. Open Terminal/Command Prompt
2. Navigate to the project folder: `cd averulo-app`
3. Start the development server: `npm start`
4. Share the QR code that appears

### 3. Connect Your Phone
1. Open **Expo Go** app on your phone
2. Scan the QR code shown in the terminal
3. The app will load on your phone

**Note**: Your phone and the developer's computer must be on the same WiFi network.

---

## Alternative: Test on Computer

If you have access to the development computer, you can test directly:

### For macOS (iPhone Simulator):
```bash
cd averulo-app
npm start
# Press 'i' to open iOS simulator
```

### For Windows/Mac (Android Emulator):
```bash
cd averulo-app
npm start
# Press 'a' to open Android emulator
```

---

## Testing the Host Property Creation Flow

### Entry Point

**Where to Start**: Navigate to the "Become a Host" section in the app

### Complete Test Scenario (15-20 minutes)

Follow this step-by-step test script:

---

#### **Screen 1: Become a Host**
- [ ] See illustration image
- [ ] See title: "Become a Host in 5 min"
- [ ] See subtitle about joining
- [ ] Click **"Continue"** button

**Expected**: Navigate to onboarding screen

---

#### **Screen 2: Host Onboarding**
- [ ] See "Ready to Host?" title
- [ ] See list of requirements (photos, documents, ID, etc.)
- [ ] See "How Hosting Works" steps
- [ ] Try clicking **"Let's go"** without checking the box
  - **Expected**: Alert asking you to agree to terms
- [ ] Check the **"I understand!"** checkbox
- [ ] Click **"Let's go"**

**Expected**: Navigate to property creation (Step 1)

---

#### **Screen 3-14: Property Creation (12 Steps)**

Watch the **progress bar** at the top increase with each step.

##### **Step 1: Property Name**
- [ ] See question: "What is the Name of your hotel"
- [ ] Try clicking **"Let's go"** without entering text
  - **Expected**: Alert asking for hotel name
- [ ] Enter hotel name (e.g., "Sunset Hotel")
- [ ] Click **"Let's go"**

**Expected**: Progress bar at ~8%, move to Step 2

---

##### **Step 2: Account Holder Position**
- [ ] See question: "Position of the Primary account holder"
- [ ] See **"Skip"** button appears
- [ ] Try clicking without entering text
  - **Expected**: Alert asking for position
- [ ] Enter position (e.g., "General Manager")
- [ ] Click **"Continue"**

**Expected**: Progress bar at ~16%, move to Step 3

---

##### **Step 3: Select Roles**
- [ ] See question: "Select other account users"
- [ ] See 6 role cards (General Manager, Receptionist, etc.)
- [ ] Click on 2-3 roles to select them
  - **Expected**: Selected cards change color and border
- [ ] Click selected role again to deselect
  - **Expected**: Card returns to normal state
- [ ] Click **"Continue"**

**Expected**: Progress bar at ~25%, move to Step 4

---

##### **Step 4: Contact Information**
- [ ] See question: "Contact Info for the hotel"
- [ ] See 3 input fields:
  - Hotel Phone Number (required)
  - Hotel Email (required)
  - Website (optional)
- [ ] Try continuing without filling required fields
  - **Expected**: Alert for missing info
- [ ] Fill in phone: "0701234567"
- [ ] Fill in email: "sunset@hotel.com"
- [ ] Fill in website: "www.sunset.com" (optional)
- [ ] Click **"Continue"**

**Expected**: Progress bar at ~33%, move to Step 5

---

##### **Step 5: Hotel Type**
- [ ] See question: "Which of these best describes your hotel"
- [ ] See 4 hotel type options with radio buttons
- [ ] Try continuing without selection
  - **Expected**: Alert asking to select type
- [ ] Select one type (e.g., "Urban Boutique Hotel")
  - **Expected**: Radio button fills, background changes color
- [ ] Click **"Continue"**

**Expected**: Progress bar at ~41%, move to Step 6

---

##### **Step 6: Location**
- [ ] See question: "Where's your hotel located"
- [ ] See map placeholder
- [ ] See "Hotel Address" input field
- [ ] Try continuing without entering address
  - **Expected**: Alert asking for location
- [ ] Enter address (e.g., "123 Main Street, Lagos")
- [ ] Click **"Continue"**

**Expected**: Progress bar at ~50%, move to Step 7

---

##### **Step 7: Amenities**
- [ ] See question: "Select Amenities"
- [ ] See 7 amenity options with checkboxes
- [ ] See "Others +" button
- [ ] Select 3-4 amenities (e.g., WiFi, Pool, Parking)
  - **Expected**: Checkboxes show checkmark, background changes
- [ ] Click **"Continue"** (or **"Skip"** to skip this step)

**Expected**: Progress bar at ~58%, move to Step 8

---

##### **Step 8: Media Upload**
- [ ] See question: "Add different media of the hotel"
- [ ] See 7 media categories:
  1. Exterior videos
  2. Upload photos (Exterior)
  3. Amenities
  4. Dining Options
  5. Special Features
  6. Event Spaces
  7. Nearby Attractions

**For EACH category**, test:
- [ ] Click **"Upload photos"** button
  - **Expected**: Photo picker opens
- [ ] Select 2-3 photos from your device
  - **Expected**: Button shows "3 uploaded"
- [ ] See **reorder button** (three lines icon) appear
- [ ] Click reorder button
  - **Expected**: Navigate to reorder screen
- [ ] On reorder screen:
  - [ ] See first photo larger (main photo)
  - [ ] See other photos as thumbnails
  - [ ] Tap a thumbnail
    - **Expected**: Photo shows checkmark overlay
  - [ ] Tap another photo
    - **Expected**: Photos swap positions, checkmark clears
- [ ] Click **"Continue"** to return
- [ ] Click **"Continue"** on main screen

**Expected**: Progress bar at ~66%, move to Step 9

---

##### **Step 9: Room Selection**
- [ ] See question: "Choose the type of rooms you have and number"
- [ ] See 10 room type cards (Standard, Deluxe, Suite, etc.)
- [ ] For 2-3 room types:
  - [ ] Initially see room name with bed icon
  - [ ] Click the card
    - **Expected**: Counter section appears below
  - [ ] Click **"+"** button multiple times
    - **Expected**: Number increases, shows in both places
  - [ ] Click **"-"** button
    - **Expected**: Number decreases
- [ ] Click **"Continue"**

**Expected**: Progress bar at ~75%, move to Step 10

---

##### **Step 10: Room Media Upload**
- [ ] See question: "Let's add some media of each room type"
- [ ] See cards ONLY for room types you selected in Step 9
- [ ] For each room card:
  - [ ] See placeholder image area
  - [ ] See room name and count
  - [ ] Click **"Upload Media"**
    - **Expected**: Photo picker opens
  - [ ] Select 2-3 room photos
    - **Expected**: Upload count updates
  - [ ] Click **reorder button** (three lines)
    - **Expected**: Opens reorder screen with room photos
  - [ ] Test reorder (same as Step 8)
- [ ] Click **"Continue"**

**Expected**: Progress bar at ~83%, move to Step 11

---

##### **Step 11: Room Pricing**
- [ ] See question: "Add prices"
- [ ] See cards ONLY for selected room types
- [ ] For each room card:
  - [ ] See room photo preview (if uploaded in Step 10)
  - [ ] See room name
  - [ ] See price input with **$** symbol
  - [ ] Enter price (e.g., "150")
    - **Expected**: Number appears next to $ symbol
- [ ] Click **"Continue"**

**Expected**: Progress bar at ~91%, move to Step 12

---

##### **Step 12: Unique Details**
- [ ] See question: "What make your hotel unique"
- [ ] See 5 text input areas with questions:
  1. Design concept inspiration (with hint text)
  2. Unique experiences offered (with hint)
  3. Customer service approach (with hint)
  4. Hotel story/vision
  5. Other details

- [ ] Fill in at least 2-3 text areas with sample text
- [ ] Scroll to test all inputs are accessible
- [ ] Click **"Continue"**

**Expected**: Progress bar at 100%, navigate to Confirmation Screen

---

#### **Screen 15: Confirmation**
- [ ] See title: "Review Your Listing"
- [ ] See subtitle: "Please review your property details..."
- [ ] Verify all sections appear:
  - [ ] Basic Information (name, position, phone, email, website)
  - [ ] Property Type & Location
  - [ ] Amenities (shown as colored tags)
  - [ ] Property Media (shows photo/video counts)
  - [ ] Room Types & Pricing (shows rooms with counts and prices)
  - [ ] What Makes It Unique (shows text you entered)

- [ ] Click **"Edit"** on any section
  - **Expected**: Navigate back to that specific step
  - [ ] Make a change
  - [ ] Click Continue through to confirmation again

- [ ] See blue info box about 24-48 hour review
- [ ] Click **"Submit for Review"** button
  - **Expected**: Loading spinner appears for 2 seconds
  - **Expected**: Navigate to Preview screen

---

#### **Screen 16: Property Preview**
- [ ] See header: "Confirm"
- [ ] See title: "Check out your hotel!"
- [ ] Verify sections show correctly:
  - [ ] Main hotel image
  - [ ] Hotel name and 5-star rating
  - [ ] Amenities list (first 6 shown)
  - [ ] Click **"Show all amenities"** if more than 6
    - **Expected**: Expands to show all
  - [ ] About the place section
  - [ ] Hotel name, email, website inputs
  - [ ] Location with map placeholder
  - [ ] Type of hotel
  - [ ] Exterior Photos gallery
  - [ ] Interior Photos gallery
  - [ ] Dining photos
  - [ ] Spa/Wellness photos
  - [ ] Room type cards with:
    - [ ] 2 room images side-by-side
    - [ ] Room name and count
    - [ ] Price
    - [ ] "Back More" button

- [ ] Scroll through entire preview
- [ ] Click **"Create Profile"** button

**Expected**: Success modal appears

---

#### **Screen 17: Success Modal**
- [ ] See dark overlay
- [ ] See white modal card in center
- [ ] See large checkmark icon (dark blue circle)
- [ ] See message: "Pending approval, we'll update you shortly."
- [ ] Click **"Back to Profile"** button

**Expected**: Navigate to Home/Main screen, flow complete! 🎉

---

## What to Test For

### ✅ Functionality Checks
- [ ] All buttons respond to taps
- [ ] Text inputs accept text
- [ ] Photo picker opens and allows selection
- [ ] Navigation works (back button, continue button)
- [ ] Skip button appears on correct screens
- [ ] Progress bar increases with each step
- [ ] Validation alerts appear when required

### ✅ Visual Checks
- [ ] Text is readable (not too small/large)
- [ ] Colors match design (dark blue primary color)
- [ ] Images display correctly
- [ ] No text is cut off
- [ ] Buttons are properly aligned
- [ ] Spacing looks good

### ✅ User Experience
- [ ] Flow feels intuitive
- [ ] Loading states appear when needed
- [ ] Error messages are clear
- [ ] Can easily go back and edit
- [ ] Photo reordering is clear
- [ ] Forms are easy to fill

---

## Common Issues & Solutions

### Issue: QR Code doesn't work
**Solution**: Make sure phone and computer are on same WiFi

### Issue: App crashes when selecting photos
**Solution**: Check photo library permissions in phone settings

### Issue: "Skip" button not working
**Solution**: This is expected behavior - skip exits to main app

### Issue: Can't type in text fields
**Solution**: Tap directly on the input field, keyboard should appear

### Issue: Back button doesn't work on Step 1
**Solution**: This is expected - exits the property creation flow

---

## Reporting Issues

When you find a bug, please report:
1. **Screen name** (e.g., "Step 5: Hotel Type")
2. **What you did** (e.g., "Clicked continue without selecting")
3. **What happened** (e.g., "App crashed")
4. **What should happen** (e.g., "Should show alert")
5. **Screenshot** (if possible)

### Bug Report Template:
```
Screen: [Screen name]
Steps: [What you did]
Expected: [What should happen]
Actual: [What actually happened]
Screenshot: [Attach if available]
```

---

## Testing Checklist Summary

- [ ] Complete full flow from start to finish (15-20 min)
- [ ] Test all 12 property creation steps
- [ ] Upload photos and test reorder feature
- [ ] Test room selection and pricing
- [ ] Review confirmation screen
- [ ] Check preview screen displays correctly
- [ ] See success modal
- [ ] Test "back" navigation on a few steps
- [ ] Test "skip" functionality
- [ ] Try submitting without required fields
- [ ] Verify all images display
- [ ] Check text is readable throughout

---

## Quick Reference: Navigation Flow

```
BecomeHostScreen
  ↓ (Continue)
HostOnboardingScreen
  ↓ (Let's go)
CreatePropertyScreen
  ↓ Step 1: Property Name
  ↓ Step 2: Position
  ↓ Step 3: Roles
  ↓ Step 4: Contact
  ↓ Step 5: Hotel Type
  ↓ Step 6: Location
  ↓ Step 7: Amenities
  ↓ Step 8: Media Upload ⟷ ReorderPhotos
  ↓ Step 9: Room Selection
  ↓ Step 10: Room Media ⟷ ReorderPhotos
  ↓ Step 11: Room Pricing
  ↓ Step 12: Unique Details
  ↓ (Continue)
ConfirmPropertyScreen
  ↓ (Submit for Review)
PropertyPreviewScreen
  ↓ (Create Profile)
Success Modal
  ↓ (Back to Profile)
Home Screen ✅
```

---

## Estimated Testing Time

- **Quick Test** (happy path only): 10 minutes
- **Full Test** (all features): 20 minutes
- **Thorough Test** (with edge cases): 30 minutes

---

## Need Help?

Contact the development team if:
- You can't get the app running
- You're stuck on a screen
- You find a major bug
- You have questions about expected behavior

**Happy Testing! 🎉**
