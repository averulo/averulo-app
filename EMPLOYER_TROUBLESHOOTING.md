# 🔧 Troubleshooting - Averulo App Not Loading

## Issue: QR Code Scanned But App Won't Load

This happens because the app needs 2 connections:
1. **Expo Dev Server** (to load the app code)
2. **Backend API** (to fetch data)

Your employer is not on your WiFi, so they can't reach your Expo dev server.

---

## ✅ SOLUTION: Use EAS Build (Recommended)

This creates a **standalone app** that doesn't need the Expo dev server.

### Step 1: Create Android Preview Build

```bash
# This takes ~15-20 minutes
eas build --platform android --profile preview
```

### Step 2: Share the Download Link

After build completes, EAS will give you a download link like:
```
https://expo.dev/artifacts/eas/[build-id].apk
```

Send this link to your employer - they can install it directly on Android!

---

## 🚀 ALTERNATIVE: Video Demo (Fastest)

If you need something RIGHT NOW:

### Record Screen Demo (5 minutes):

**On Mac:**
```bash
# QuickTime → File → New Screen Recording
# Then upload to Loom.com (free)
```

**On iPhone:**
- Settings → Control Center → Add Screen Recording
- Swipe down → Tap record button
- Navigate through app
- Stop recording
- Share video

**Upload to:**
- Loom (loom.com) - Get shareable link
- YouTube (unlisted)
- Google Drive

---

## 🌐 ALTERNATIVE: Deploy to Web

Deploy a web version (some features won't work, but good for overview):

```bash
# Build for web
npx expo export:web

# Deploy to Netlify
# 1. Go to netlify.com/drop
# 2. Drag the 'web-build' folder
# 3. Get live URL instantly
```

⚠️ **Note:** Camera/native features won't work on web, but navigation and UI will.

---

## 💡 ALTERNATIVE: Use Appetize.io

Upload your app to Appetize for browser-based testing:

1. Build APK: `eas build --platform android --profile preview`
2. Upload to appetize.io
3. Get shareable browser link
4. Employer tests in browser (no phone needed!)

---

## 📧 Updated Email to Send

```
Hi [Employer],

The QR code approach requires same network. Here's a better option:

🤖 ANDROID DIRECT INSTALL:
Download and install: [APK link from EAS build]
(No Expo Go needed - works like regular app)

OR

🎥 VIDEO DEMO:
Watch full walkthrough: [Loom/YouTube link]

OR

🌐 WEB VERSION:
Test in browser: [Netlify link]
(Note: Some native features limited on web)

🔗 GitHub Repo: [your link]

Happy to schedule a live screen-share demo anytime!

Best,
[Your Name]
```

---

## ⚡ Quick Action Plan

**Right Now (5 min):**
1. Record a screen demo of the app
2. Upload to Loom.com
3. Send link to employer

**Tomorrow (20 min):**
1. Run: `eas build --platform android --profile preview`
2. Wait for build to complete
3. Send download link

**This Weekend:**
1. Deploy web version
2. Create proper README
3. Clean up code for review

---

## 📞 If They're Available Now

Offer a **live screen share** demo:
- Zoom/Google Meet/Teams
- Share your screen
- Walk through the app
- Answer questions in real-time

This is often the best option for impressing employers!
