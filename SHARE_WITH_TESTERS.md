# Share Averulo MVP with Testers

**Quick Guide for Distributing Your App to Your Testing Team**

---

## 🚀 Quickest Method: Expo Go (Recommended for Testing)

### Step 1: Publish to Expo
```bash
# From root directory
npx expo publish
```

This creates a shareable QR code and link.

### Step 2: Share with Testers

Send them:
1. **Expo Go app** download link:
   - iOS: https://apps.apple.com/app/expo-go/id982107779
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent

2. **Your published app link**: `exp://exp.host/@your-username/averulo-app`
   - OR the QR code from publish output

3. **Testing guide**: [TESTER_GUIDE.md](TESTER_GUIDE.md) (created below)

### Step 3: Testers Install
1. Install Expo Go
2. Scan QR code or open link in Expo Go
3. App loads and runs!

**✅ Pros:** Super fast, no app store needed, instant updates
**⚠️ Cons:** Requires Expo Go app, not full native experience

---

## 📱 Alternative Methods

### Option 2: Internal Distribution (iOS TestFlight)

**For iOS devices:**

```bash
# Build for iOS
eas build --platform ios --profile preview

# Or:
npx expo build:ios
```

Then:
1. Upload to TestFlight via App Store Connect
2. Invite testers by email
3. They install via TestFlight app

**Time:** ~30 min build + review time
**Limit:** 100 internal testers

### Option 3: Android APK (Direct Install)

**For Android devices:**

```bash
# Build APK
eas build --platform android --profile preview

# Or:
npx expo build:android -t apk
```

Then:
1. Download APK from build
2. Share APK file directly with testers
3. They install APK (need to enable "Unknown Sources")

**Time:** ~20 min build
**Limit:** Unlimited

### Option 4: Development Build

**Most native-like experience:**

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure
eas build:configure

# Build for both platforms
eas build --platform all --profile development
```

Testers install the development build once, then you can push updates over-the-air.

---

## 📋 What to Send Your Testers

### Email Template:

```
Subject: Averulo MVP - Testing Access

Hi Team,

We're ready for testing! Here's how to access the Averulo MVP:

📱 INSTALLATION:
1. Install Expo Go app:
   - iOS: https://apps.apple.com/app/expo-go/id982107779
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent

2. Open this link in Expo Go: [YOUR EXPO LINK]
   OR scan this QR code: [QR CODE IMAGE]

📖 TESTING GUIDE:
Please follow the testing checklist: [Link to TESTER_GUIDE.md]

🎯 PRIORITY TESTS:
1. Login with OTP
2. Browse properties
3. Create a booking (use test payment card)
4. Test "Become a Host" flow
5. Create a property (all 12 steps)

💳 TEST PAYMENT CARD:
Card: 4084084084084081
CVV: 408
Expiry: 12/25
PIN: 0000
OTP: 123456

📝 REPORT ISSUES:
- Screenshot the issue
- Note what you were trying to do
- Send to: [your email/slack/tool]

⏰ TESTING DEADLINE: [Date]

Thank you! 🙏

Best,
[Your Name]
```

---

## 🔧 Before Sharing - Final Checks

### 1. Backend Deployed
Your testers need a working backend. Options:

**Option A: Keep Local Backend Running**
```bash
cd averulo-backend
npm run dev
# Keep this running, use ngrok to expose it
```

**Option B: Deploy Backend to Cloud**
- Heroku (free tier)
- Railway
- Render
- DigitalOcean
- AWS/GCP/Azure

**Quick Heroku Deploy:**
```bash
cd averulo-backend
heroku create averulo-backend
git push heroku main
heroku config:set DATABASE_URL=xxx
heroku config:set JWT_SECRET=xxx
# etc...
```

### 2. Update API Base URL

In `lib/api.js`, update to your deployed backend:
```javascript
export const API_BASE = 'https://your-backend.herokuapp.com';
// or your ngrok URL
```

### 3. Environment Variables

Make sure `.env` has production values:
```env
DATABASE_URL="your-production-db"
JWT_SECRET="strong-secret-key"
PAYSTACK_SECRET_KEY="sk_live_..."  # or sk_test_ for testing
SMTP_USER="your-email@gmail.com"
SMTP_PASS="app-password"
```

### 4. Test Payment Mode

For testing, use Paystack TEST mode:
```env
PAYSTACK_SECRET_KEY="sk_test_..."
```

Testers use test cards. No real money charged.

---

## 📱 Publish Commands Cheat Sheet

### Expo Publish (Simplest)
```bash
npx expo publish
```

### EAS Build (Production-like)
```bash
# First time setup
npm install -g eas-cli
eas login
eas build:configure

# Build iOS preview
eas build --platform ios --profile preview

# Build Android APK
eas build --platform android --profile preview

# Build both
eas build --platform all --profile preview
```

### Classic Expo Build
```bash
# iOS
npx expo build:ios -t simulator  # For simulator
npx expo build:ios -t archive    # For TestFlight

# Android
npx expo build:android -t apk    # APK file
npx expo build:android -t app-bundle  # For Play Store
```

---

## 👥 Tester Setup Guide

### For Testers: 3 Steps to Get Started

**Step 1: Install Expo Go**
- iOS: App Store → "Expo Go"
- Android: Play Store → "Expo Go"

**Step 2: Open the App**
- Scan QR code provided
- OR open link in Expo Go
- App downloads and launches

**Step 3: Start Testing**
- Follow testing guide
- Report any issues

**That's it!** No complicated setup.

---

## 🐛 Troubleshooting for Testers

### "App won't load"
- Check internet connection
- Make sure using latest Expo Go version
- Try force-quit and reopen

### "Server error / Cannot connect"
- Backend might be down
- Ask admin to check backend status

### "Payment fails"
- Using test card correctly?
- Card: 4084084084084081
- PIN: 0000, OTP: 123456

### "Can't login"
- Check email for OTP code
- Try different email
- Contact admin if persists

---

## 📊 Collecting Feedback

### Recommended Tools:
1. **Google Forms** - Simple feedback forms
2. **Notion** - Bug tracking database
3. **Slack Channel** - Real-time feedback
4. **TestFlight Feedback** - If using TestFlight
5. **Screenshot + Voice Notes** - Quick reports

### Feedback Template:
```
Bug Report:
- What were you trying to do?
- What happened?
- What should have happened?
- Screenshot/video
- Device: iOS/Android, version
- Time: [timestamp]
```

---

## 🔄 Updating the App

### Push Updates to Testers:

**For Expo Go:**
```bash
# Make your changes
# Then publish again
npx expo publish
```

Testers just reload the app (shake device → Reload)

**For Development Builds:**
```bash
# Push OTA update
eas update --branch preview
```

**For TestFlight/APK:**
Must rebuild and redistribute:
```bash
eas build --platform all --profile preview
```

---

## ✅ Pre-Distribution Checklist

Before sharing with testers:

**Backend:**
- [ ] Backend deployed and accessible
- [ ] Database migrations run
- [ ] Seed data loaded (test properties)
- [ ] Environment variables set
- [ ] CORS allows your app domain
- [ ] Paystack test mode active

**Frontend:**
- [ ] API_BASE points to deployed backend
- [ ] App builds without errors
- [ ] Test login works
- [ ] Sample properties display
- [ ] Payment test card works
- [ ] Host onboarding loads

**Documentation:**
- [ ] Tester guide written
- [ ] Test credentials shared
- [ ] Known issues documented
- [ ] Feedback collection method ready

**Communication:**
- [ ] Testers invited
- [ ] Installation instructions sent
- [ ] Testing deadline communicated
- [ ] Support channel established

---

## 🎯 Testing Priorities for Team

### Priority 1 (Critical - Must Work):
1. ✅ Login/OTP flow
2. ✅ Browse properties
3. ✅ Book a property
4. ✅ Payment processing
5. ✅ Become a host
6. ✅ Create property (12 steps)
7. ✅ Host dashboard

### Priority 2 (Important):
8. Property search
9. My bookings
10. Write reviews
11. Host booking management
12. Host calendar
13. Host statistics

### Priority 3 (Secondary):
14. Profile editing
15. KYC upload
16. Notifications
17. Chat/messaging
18. Settings

---

## 📞 Quick Commands Reference

```bash
# Publish to Expo (recommended)
npx expo publish

# Build iOS preview
eas build --platform ios --profile preview

# Build Android APK
eas build --platform android --profile preview

# Update deployed backend
git push heroku main

# Check build status
eas build:list

# View logs
npx expo logs

# Clear cache
npx expo start --clear
```

---

## 🚀 Recommended: Expo Publish Flow

**Best for rapid testing with your team:**

```bash
# 1. Make sure backend is accessible
cd averulo-backend
npm run dev
# Use ngrok: ngrok http 3000
# Update lib/api.js with ngrok URL

# 2. Publish to Expo
cd ..
npx expo publish

# 3. Share QR code + testing guide with team

# 4. Collect feedback

# 5. Fix issues and republish
npx expo publish
```

**Testers just reload the app to get updates!**

---

## 📱 Final Step: Share These Files

Send your testers:
1. **Installation link/QR code** (from expo publish)
2. **[TESTER_GUIDE.md](TESTER_GUIDE.md)** (testing checklist)
3. **Test credentials** (payment cards, test emails)
4. **Your contact** for support

---

**Ready to share?**

```bash
npx expo publish
```

Then send the link to your team! 🎉

---

*Last Updated: 2025-12-20*
*Method: Expo Publish (Recommended)*
