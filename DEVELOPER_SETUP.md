# Developer Setup - For Testing Handoff

## Quick Setup for Demo/Testing

### Prerequisites
- Node.js installed (v14 or higher)
- npm or yarn
- Expo CLI (installed globally)

### 1. Start the Development Server

```bash
# Navigate to project
cd averulo-app

# Install dependencies (if not already installed)
npm install

# Start Expo development server
npm start
```

### 2. Share with Testers

Once the server starts, you'll see a QR code in the terminal. Testers can:

**Option A: Use their phone (Recommended for non-technical testers)**
1. Install Expo Go app on their phone
2. Scan the QR code
3. App will load on their phone

**Option B: Use simulator/emulator**
```bash
# For iOS (macOS only)
npm start
# Then press 'i' in terminal

# For Android
npm start
# Then press 'a' in terminal
```

### 3. Navigate to Host Flow

Once app loads:
1. Login/signup if needed
2. Navigate to "Become a Host" section
3. Follow the testing guide

---

## Troubleshooting for Developers

### Issue: Metro bundler errors
```bash
# Clear cache and restart
npm start -- --reset-cache
```

### Issue: Expo Go connection fails
- Ensure phone and computer on same WiFi
- Check firewall settings
- Try tunnel mode:
  ```bash
  npm start -- --tunnel
  ```

### Issue: iOS simulator not opening
```bash
# Open simulator manually
open -a Simulator
# Then press 'i' in terminal
```

### Issue: Android emulator not starting
```bash
# List available emulators
emulator -list-avds

# Start specific emulator
emulator -avd Pixel_4_API_30
```

---

## Backend Setup (if needed)

The host flow currently uses simulated API calls. To test with real backend:

```bash
# Navigate to backend
cd averulo-backend

# Install dependencies
npm install

# Start backend server
npm run dev
```

Backend will run on `http://localhost:3000`

---

## Test Accounts (if needed)

Create test accounts or use:
- **Email**: test@host.com
- **OTP**: (check backend console or use dev mode)

---

## Monitoring During Testing

### Watch for Console Logs
The app logs navigation events and actions:
```bash
# In the Metro bundler terminal, watch for:
"Submitting property data..."
"Navigating to step X"
```

### Check for Errors
Monitor terminal for:
- Network errors
- Component errors
- Navigation errors

---

## Demo Tips

1. **Pre-load sample images**: Have 5-10 hotel photos ready on test device
2. **Prepare test data**: Have hotel details ready to enter quickly
3. **Reset between tests**: Close and reopen app to start fresh
4. **Show progress bar**: Point out the progress indicator to testers
5. **Highlight reorder feature**: This is a key UX feature

---

## Quick Demo Script (5 minutes)

For quick stakeholder demos:

1. **Slide 1**: BecomeHost screen - "Start here"
2. **Slide 2**: Onboarding - "Requirements overview"
3. **Slide 3-5**: Skip to Step 8 (Media Upload) - "Photo upload and reorder"
4. **Slide 6**: Skip to Step 11 (Pricing) - "Room pricing with images"
5. **Slide 7**: Confirmation - "Review all data"
6. **Slide 8**: Preview - "Guest-facing view"
7. **Slide 9**: Success modal - "Completion"

---

## Files to Review Before Testing

Key implementation files:
- `/screens/host/BecomeHostScreen.js` - Entry point
- `/screens/host/HostOnboardingScreen.js` - Requirements
- `/screens/host/CreatePropertyScreen.js` - Main 12-step form (1,655 lines)
- `/screens/host/ReorderPhotosScreen.js` - Photo reordering
- `/screens/host/ConfirmPropertyScreen.js` - Review screen
- `/screens/host/PropertyPreviewScreen.js` - Final preview + modal
- `/App.js` - Navigation registration

---

## Data Flow (for debugging)

```javascript
// Step 12 completion -> Passes 23 fields
CreatePropertyScreen
  → ConfirmPropertyScreen (receives all data via route.params)
    → PropertyPreviewScreen (receives all data via route.params)
      → Success Modal (local state)
        → MainTabs (navigation.reset)
```

All data currently stored in:
- Local component state (CreatePropertyScreen)
- Passed via navigation params
- NOT persisted (will be lost on app restart)

---

## Known Limitations

1. **No backend integration yet**: Submission is simulated with 2-second delay
2. **No data persistence**: Data lost if app restarts during flow
3. **Photo storage**: Images only stored in memory (URIs)
4. **No draft saving**: Users must complete in one session

These can be implemented when connecting to real backend.

---

## Next Steps (Post-Testing)

After testing is complete:

1. **Collect feedback**: Gather tester reports
2. **Fix critical bugs**: Address blocking issues
3. **Backend integration**: Connect to real API endpoints
4. **Add persistence**: Implement draft saving
5. **Polish UX**: Refine based on feedback

---

## Testing Environment

Current setup:
- **Frontend**: React Native Expo
- **Navigation**: React Navigation v7
- **State**: Local component state (useState)
- **Images**: expo-image-picker
- **Backend**: Simulated (2s delay)

---

## Support During Testing

Be available to help testers with:
- App installation (Expo Go)
- QR code scanning
- WiFi connection issues
- App crashes/errors
- Questions about expected behavior

---

## Success Criteria

Testing is successful when testers can:
- ✅ Complete entire flow without assistance
- ✅ Upload and reorder photos
- ✅ Navigate back to edit information
- ✅ See confirmation and preview screens
- ✅ Complete flow and see success modal

---

## Emergency Fixes

If critical bug found during testing:

```bash
# Make fix in code
# Save file
# App will auto-reload via Fast Refresh
# If needed, manually reload:
# - Expo Go: Shake device → Reload
# - Simulator: Cmd+R (iOS) or RR (Android)
```

---

Good luck with testing! 🚀
