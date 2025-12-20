# Averulo MVP - Team Quick Start

**Repository:** https://github.com/averulo/averulo-app
**Status:** ✅ Ready for Testing
**Last Updated:** December 20, 2025

---

## 🎯 For Testers

### Get the App (2 minutes):
1. Install **Expo Go** app on your phone
   - iOS: https://apps.apple.com/app/expo-go/id982107779
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent

2. Get app link from team lead (or scan QR code)

3. Open in Expo Go → Start testing!

### Testing Guide:
📖 See **[TESTER_GUIDE.md](TESTER_GUIDE.md)** for step-by-step testing checklist

### Test Payment Card:
```
Card: 4084084084084081
CVV: 408
Expiry: 12/25
PIN: 0000
OTP: 123456
```

---

## 💻 For Developers

### Clone & Setup (5 minutes):
```bash
# Clone repository
git clone https://github.com/averulo/averulo-app.git
cd averulo-app

# Install frontend dependencies
npm install

# Setup backend
cd averulo-backend
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed

# Start backend (Terminal 1)
npm run dev

# Start frontend (Terminal 2 - from root)
cd ..
npm start
```

### Documentation:
- **Setup:** [DEVELOPER_SETUP.md](DEVELOPER_SETUP.md)
- **Testing:** [MVP_TESTING_GUIDE.md](MVP_TESTING_GUIDE.md)
- **Architecture:** [CLAUDE.md](CLAUDE.md)

---

## 📱 For Project Manager

### Current Status:
- ✅ **Host App:** 100% Figma-accurate (16 screens)
- ✅ **Backend API:** Fully functional
- ⚠️ **Guest App:** Needs end-to-end testing
- ⚠️ **Admin App:** Needs testing
- **Overall:** ~93% complete

### Priority Testing:
1. Login/OTP flow
2. Browse & book properties
3. Payment processing
4. Host onboarding (12 steps)
5. Host dashboard features

### Distribution:
📖 See **[SHARE_WITH_TESTERS.md](SHARE_WITH_TESTERS.md)** for distribution options

---

## 🚀 Quick Commands

### Publish to Expo (for testing):
```bash
npx expo publish
```

### Start Development:
```bash
# Backend
cd averulo-backend && npm run dev

# Frontend
npm start
```

### Build for Production:
```bash
# iOS
eas build --platform ios --profile preview

# Android
eas build --platform android --profile preview
```

---

## 📊 What Works

### ✅ Fully Tested & Working:
- User authentication (OTP)
- Host property creation (12 steps)
- Host dashboard
- Host calendar (12×7 grid)
- Host statistics (75% chart)
- Host booking management
- All host screens (100% Figma match)

### ⚠️ Needs Testing:
- Guest booking flow end-to-end
- Payment webhook
- Admin workflows
- KYC verification
- Email notifications

---

## 🐛 Report Issues

### Found a bug?
- **Testers:** Use format in [TESTER_GUIDE.md](TESTER_GUIDE.md)
- **Developers:** Create GitHub issue with:
  - Steps to reproduce
  - Expected vs actual behavior
  - Screenshots
  - Device/platform info

---

## 📞 Key Contacts

- **Project Lead:** [Your Name]
- **Backend:** [Backend Dev]
- **Frontend:** [Frontend Dev]
- **Testing:** [QA Lead]

---

## 🎉 Next Steps

1. **Team Meeting:** Review MVP status
2. **Distribute App:** Share with testing team
3. **Testing Sprint:** 3-5 days of testing
4. **Bug Fixes:** Address critical issues
5. **Production Deploy:** Prepare for launch

---

**Questions?** See documentation links above or contact team lead.

**Ready to test?** Start with [TESTER_GUIDE.md](TESTER_GUIDE.md)!

---

*Version: MVP v1.0*
*Commit: 59d8171*
*Branch: main*
