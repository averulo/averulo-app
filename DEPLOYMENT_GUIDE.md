# Averulo App Deployment Guide

## Current Status
- ✅ Android APK: Ready for testing
- ⏳ iOS TestFlight: Needs credentials setup
- ⏸️ Production SMTP: Not configured (using dev OTP)
- ⏸️ File Storage: Local (needs cloud migration)
- ⏸️ Push Notifications: Installed, needs configuration

---

## Phase 1: TestFlight Setup (iOS Testing) - DO THIS FIRST

### Prerequisites
1. Apple Developer Account ($99/year)
2. Xcode installed (on Mac)

### Steps:

#### 1. Create App Store Connect App
```bash
# Login to https://appstoreconnect.apple.com
# Click "My Apps" → "+" → "New App"
# Fill in:
#   - Platform: iOS
#   - Name: Averulo
#   - Primary Language: English
#   - Bundle ID: com.yele.averuloapp (already in app.json)
#   - SKU: averulo-app
```

#### 2. Build for TestFlight (Interactive)
```bash
# This will prompt for Apple account login
eas build --platform ios --profile production

# Follow prompts:
# - Login with Apple ID
# - Create distribution certificate
# - Create provisioning profile
# - Enable push notifications capability
```

#### 3. Submit to TestFlight
```bash
eas submit --platform ios --latest
```

#### 4. Add Testers
- Go to App Store Connect → TestFlight
- Add testers by email
- They'll receive invite link

**Timeline:** 1-2 hours for first build, then auto

---

## Phase 2: Configure Production Features

### A. Production SMTP (For Real OTP Emails)

#### Option 1: Gmail (Easiest)
1. Create Gmail app password:
   - Google Account → Security → 2-Step Verification → App passwords
   - Generate password for "Mail"

2. Update backend `.env`:
```bash
cd averulo-backend
echo "SMTP_USER=your-gmail@gmail.com" >> .env
echo "SMTP_PASS=your-app-password" >> .env
```

3. Restart backend:
```bash
npm run dev
```

#### Option 2: SendGrid (Recommended for Production)
```bash
# Sign up at https://sendgrid.com (free 100 emails/day)
# Get API key
echo "SMTP_USER=apikey" >> .env
echo "SMTP_PASS=your-sendgrid-api-key" >> .env
echo "SMTP_HOST=smtp.sendgrid.net" >> .env
echo "SMTP_PORT=587" >> .env
```

**When to do this:** Before App Store launch

---

### B. Cloud File Storage (For KYC Documents)

Currently files save to `averulo-backend/uploads/` (local folder).
**Problem:** Render cloud hosting deletes these on restart.

#### Option 1: Cloudinary (Easiest)
```bash
cd averulo-backend
npm install cloudinary multer-storage-cloudinary

# Sign up at https://cloudinary.com (free tier)
# Add to .env:
echo "CLOUDINARY_CLOUD_NAME=your-cloud-name" >> .env
echo "CLOUDINARY_API_KEY=your-api-key" >> .env
echo "CLOUDINARY_API_SECRET=your-api-secret" >> .env
```

Update `lib/upload.js`:
```javascript
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'averulo-kyc',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
  },
});

module.exports = multer({ storage });
```

#### Option 2: AWS S3 (More scalable)
- Requires AWS account
- More complex setup
- Better for large scale

**When to do this:** Before storing real KYC data (ASAP if testing KYC)

---

### C. Push Notifications Setup

#### 1. Configure Expo Notifications
Already installed! Just need to register users.

Update `App.js`:
```javascript
import { registerForPushNotificationsAsync, addNotificationListeners } from './lib/notifications';

// Inside App component:
useEffect(() => {
  registerForPushNotificationsAsync(userToken);
  return addNotificationListeners(navigation);
}, [userToken]);
```

#### 2. Backend - Add Notification Triggers

Add to `averulo-backend/routes/bookings.js`:
```javascript
const { sendPushNotification } = require('../lib/notify');

// After booking created:
await sendPushNotification(host.pushToken, {
  title: 'New Booking Request',
  body: `${user.name} wants to book ${property.name}`,
  data: { bookingId: booking.id },
});
```

**When to do this:** After TestFlight, before App Store launch

---

## Phase 3: Database Management

### Current Setup (Fine for Testing)
- **Database:** PostgreSQL on Render
- **Data:** KYC status, user profiles, bookings
- **Files:** Local storage (⚠️ will be lost on redeploy)

### Actions Needed:

#### Before Production:
1. **Backup Strategy:**
```bash
# Weekly backups
cd averulo-backend
npx prisma db pull > backup.sql
```

2. **Cloud Storage:** Migrate files to Cloudinary/S3 (see above)

3. **Production Database:** Consider upgrading Render plan or migrating to:
   - **Supabase** (free tier, PostgreSQL + file storage)
   - **AWS RDS** (paid, very reliable)
   - **Railway** (easier than Render)

#### KYC Data Handling:
```javascript
// Backend already supports:
// - Storing ID photos (InputNINScreen → /api/upload)
// - KYC status tracking (PENDING → VERIFIED → REJECTED)
// - Admin KYC dashboard (AdminKycDashboardScreen)

// Make sure to:
// 1. Store files in cloud (not local uploads/)
// 2. Encrypt sensitive data (NIN numbers)
// 3. Auto-delete rejected KYC docs after 30 days
```

---

## Testing Checklist

### With Current Setup (Dev OTP + Local Files):
- ✅ Android APK testing
- ✅ iOS Expo Go testing
- ✅ TestFlight testing (once set up)
- ✅ Core features (booking, payments, KYC flow)

### Before App Store Launch:
- ⏸️ Configure production SMTP
- ⏸️ Migrate to cloud file storage
- ⏸️ Set up push notifications
- ⏸️ Enable production database backups
- ⏸️ Test payment webhooks with real Paystack account
- ⏸️ Add privacy policy URL
- ⏸️ Add terms of service URL

---

## Recommended Timeline

### Week 1 (Now):
1. ✅ Set up iOS TestFlight → Get iOS users testing
2. ✅ Keep using dev OTP (alerts work fine for testing)
3. ⏸️ Migrate files to Cloudinary (if testing KYC)

### Week 2:
1. Gather tester feedback
2. Fix bugs from TestFlight
3. Configure push notifications

### Week 3:
1. Set up production SMTP (SendGrid)
2. Final testing with real emails
3. Prepare App Store assets

### Week 4:
1. Submit to App Store
2. Submit to Google Play
3. Monitor for issues

---

## Cost Estimate

### Free Tier:
- Expo (EAS updates): Free
- Cloudinary: Free (25GB storage, 25GB bandwidth)
- SendGrid: Free (100 emails/day)
- Render (database): Free (will sleep after inactivity)

### Paid:
- Apple Developer: $99/year (required)
- Google Play: $25 one-time
- Render database upgrade: $7/month (if needed)

**Total:** ~$100 for first year

---

## Quick Commands Reference

```bash
# Build Android APK
eas build --platform android --profile preview

# Build iOS for TestFlight
eas build --platform ios --profile production

# Publish OTA update (both platforms)
eas update --branch preview --message "Bug fixes"

# Check build status
eas build:list

# Submit to stores
eas submit --platform ios --latest
eas submit --platform android --latest
```

---

## Need Help?

1. **iOS build fails?** Run: `eas build --platform ios --profile production --clear-cache`
2. **Notifications not working?** Check: Project ID in lib/notifications.js matches app.json
3. **Files disappearing?** You need cloud storage (Cloudinary setup above)
4. **OTP not sending?** SMTP not configured (intentional in dev mode)

