# Testing on Physical Devices - Quick Setup

## 🚀 For Developers: Enable Testing

### 1. Start the Development Server

```bash
cd averulo-app
npm start
```

**You'll see:**
- QR code in terminal
- Local URL (e.g., `exp://192.168.1.5:8081`)
- Options menu (press 'i' for iOS, 'a' for Android)

### 2. Share with Testers

**Option A: QR Code (Recommended)**
- Show them the QR code in terminal
- They scan it with Expo Go

**Option B: URL**
- Copy the `exp://` URL from terminal
- Send to testers
- They paste in Expo Go

**Option C: Tunnel Mode** (if WiFi blocked)
```bash
npm start -- --tunnel
```
- Creates public URL
- Works across different networks
- Slower but more compatible

---

## 📱 For Testers: Connect Your Phone

### iPhone Setup

**Step 1: Install Expo Go**
1. Open App Store
2. Search "Expo Go"
3. Tap "Get" → Install
4. Open Expo Go

**Step 2: Connect**
- **Method 1** (Camera):
  1. Open Camera app
  2. Point at QR code
  3. Tap notification

- **Method 2** (Expo Go):
  1. Open Expo Go
  2. Tap "Scan QR Code"
  3. Scan the code

**Step 3: Wait**
- App will download (30-60 sec first time)
- Opens automatically when ready

---

### Android Setup

**Step 1: Install Expo Go**
1. Open Play Store
2. Search "Expo Go"
3. Tap "Install"
4. Open Expo Go

**Step 2: Connect**
- **Method 1** (Expo Go):
  1. Tap "Scan QR Code"
  2. Allow camera permission
  3. Scan the code

- **Method 2** (Manual):
  1. Tap "Enter URL manually"
  2. Paste the `exp://` URL
  3. Tap "Connect"

**Step 3: Wait**
- App will build (30-60 sec first time)
- Opens automatically when ready

---

## 🌐 Network Requirements

### Same WiFi Method (Fastest)

**Requirements:**
- ✅ Phone and computer on SAME WiFi network
- ✅ WiFi allows device-to-device communication
- ✅ No firewall blocking port 19000-19001

**Check WiFi:**
```bash
# On Mac/Linux
ifconfig | grep "inet "

# On Windows
ipconfig
```
Note the IP address (e.g., 192.168.1.5)

**Common WiFi Issues:**
- ❌ Corporate/school WiFi may block
- ❌ Guest WiFi isolates devices
- ❌ VPN may interfere

**Solutions:**
- Use home WiFi
- Use phone hotspot
- Use tunnel mode

---

### Tunnel Method (Any Network)

**When to use:**
- Different WiFi networks
- Corporate WiFi with restrictions
- Remote testing

**How to enable:**
```bash
npm start -- --tunnel
```

**Pros:**
- ✅ Works on any network
- ✅ Can share with remote testers
- ✅ Creates public URL

**Cons:**
- ⚠️ Slower performance
- ⚠️ Requires internet
- ⚠️ May have latency

---

## 📊 Testing Multiple Devices

### Test with Team

**Setup:**
1. Start dev server
2. Share QR code (screenshot or in Slack/email)
3. Each tester scans with their phone
4. All can test simultaneously

**Best Practice:**
- Test on both iPhone AND Android
- Test on different screen sizes
- Test on older devices (if available)

**Device Recommendations:**
- 1x Latest iPhone (iOS 17)
- 1x Older iPhone (iOS 15-16)
- 1x Latest Android (Android 13+)
- 1x Older Android (Android 11-12)

---

## 🔄 Reloading During Testing

### When Code Changes

**Auto-reload (Fast Refresh):**
- Most changes reload automatically
- No action needed from testers

**Manual reload:**
- **iPhone**: Shake device → Tap "Reload"
- **Android**: Shake device → Tap "Reload"
- **Or**: Ctrl+M → Reload (Android)
- **Or**: Cmd+D → Reload (iOS Simulator)

**Full restart:**
- Close Expo Go completely
- Reopen and scan QR again

---

## 🐛 Common Issues

### Issue: "Cannot connect to Metro"
**Cause:** Not on same WiFi
**Fix:**
1. Check WiFi on both devices
2. Try tunnel mode
3. Restart Metro bundler

### Issue: "Uncaught Error: Network request failed"
**Cause:** Backend not running
**Fix:**
```bash
cd averulo-backend
npm run dev
```

### Issue: "Unable to resolve module"
**Cause:** Dependencies not installed
**Fix:**
```bash
npm install
npm start -- --reset-cache
```

### Issue: Red error screen
**Cause:** Code error
**Fix:**
1. Read error message
2. Check terminal for details
3. Fix code
4. Auto-reloads

### Issue: App freezes/white screen
**Cause:** Various
**Fix:**
1. Shake device → Reload
2. Close Expo Go → Reopen
3. Clear cache (in Expo Go settings)

### Issue: Photos won't upload
**Cause:** Permissions
**Fix:**
1. Go to phone Settings
2. Find Expo Go
3. Enable Photos permission
4. Restart app

---

## 💾 Backend Requirements

### If Testing Full Flow (with Backend)

**Start Backend:**
```bash
cd averulo-backend
npm install
npm run dev
```

**Backend runs on:** `http://localhost:3000`

**Check Backend Running:**
- Terminal shows "Server running on port 3000"
- Or visit `http://localhost:3000` in browser

**Backend Not Needed For:**
- UI testing
- Navigation testing
- Form validation
- Photo upload (stores locally)

**Backend Needed For:**
- Login/signup
- Booking creation
- Payment processing
- Data persistence

---

## 📝 Test Session Checklist

### Before Testing Session

**Developer:**
- [ ] Pull latest code
- [ ] Install dependencies (`npm install`)
- [ ] Start Metro bundler (`npm start`)
- [ ] Start backend (if needed)
- [ ] Test on your device first
- [ ] Share QR code with testers

**Testers:**
- [ ] Install Expo Go
- [ ] Connect to correct WiFi
- [ ] Charge phone
- [ ] Have photos ready (for upload tests)
- [ ] Clear some storage space

### During Testing

**Developer:**
- [ ] Monitor Metro bundler terminal
- [ ] Watch for errors in console
- [ ] Be available for questions
- [ ] Make quick fixes if needed

**Testers:**
- [ ] Follow testing guide
- [ ] Take screenshots of issues
- [ ] Note anything confusing
- [ ] Don't be afraid to break things!

### After Testing

**Developer:**
- [ ] Collect bug reports
- [ ] Review screenshots
- [ ] Prioritize fixes
- [ ] Thank testers!

**Testers:**
- [ ] Submit bug reports
- [ ] Share overall feedback
- [ ] Note what worked well
- [ ] Suggest improvements

---

## 🎯 Quick Test Commands

### For Developers

```bash
# Start with clean cache
npm start -- --reset-cache

# Start with tunnel
npm start -- --tunnel

# Start iOS simulator (Mac only)
npm start
# Then press 'i'

# Start Android emulator
npm start
# Then press 'a'

# Check what's running
lsof -i :19000  # Metro bundler
lsof -i :3000   # Backend (if separate)

# Kill Metro bundler
killall -9 node
```

---

## 📱 Simulators/Emulators (Alternative to Physical Phones)

### iOS Simulator (Mac Only)

**Setup:**
1. Install Xcode from App Store
2. Open Xcode → Preferences → Components
3. Install iOS simulator

**Run:**
```bash
npm start
# Press 'i' when ready
```

**Pros:**
- ✅ No phone needed
- ✅ Fast for testing
- ✅ Easy to screenshot

**Cons:**
- ❌ Mac only
- ❌ Not real device behavior
- ❌ Can't test camera, sensors

---

### Android Emulator

**Setup:**
1. Install Android Studio
2. Open AVD Manager
3. Create virtual device

**Run:**
```bash
npm start
# Press 'a' when ready
```

**Pros:**
- ✅ No phone needed
- ✅ Works on Mac/Windows/Linux
- ✅ Can test different Android versions

**Cons:**
- ❌ Slow on some computers
- ❌ Not real device behavior
- ❌ Uses lots of RAM

---

## 🔐 Security & Privacy

### For Testers

**Safe to Test:**
- ✅ Use fake/test data
- ✅ Use test email addresses
- ✅ Use test payment cards (provided)
- ✅ Use sample photos from internet

**Don't Use:**
- ❌ Real personal data
- ❌ Real credit cards
- ❌ Real passwords you use elsewhere
- ❌ Sensitive photos/documents

**Data Storage:**
- Data stored temporarily during testing
- Cleared when app closes
- Not sent to production servers (in test mode)

---

## ⚡ Performance Tips

### For Best Testing Experience

**On Phone:**
- Close other apps
- Have good WiFi signal
- Keep phone charged (>50%)
- Update Expo Go to latest version

**On Computer:**
- Close unnecessary apps
- Disable VPN (if possible)
- Keep charger plugged in
- Don't run multiple Metro instances

**General:**
- Test in good lighting (for camera features)
- Have stable internet
- Test in quiet place (for notifications)

---

## 📞 Support During Testing

### Get Help

**If you're stuck:**
1. Check this guide first
2. Try reloading the app
3. Check terminal for errors
4. Ask developer team

**Useful Info to Share:**
- Phone model (e.g., "iPhone 14")
- OS version (e.g., "iOS 17.1")
- Screenshot of issue
- What you were doing
- Error message (if any)

---

## ✅ Ready to Test!

**You're ready when:**
- ✅ Expo Go installed
- ✅ Connected to WiFi
- ✅ Scanned QR code
- ✅ App loaded successfully
- ✅ Can see home screen

**Now:**
1. Open **COMPLETE_APP_TESTING_GUIDE.md**
2. Choose a test scenario
3. Start testing!

---

**Happy Testing! 🎉**
