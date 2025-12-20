# 🚀 Quick Start - Test Your MVP

## Option 1: Quick Test (Recommended)

### Step 1: Start Backend
```bash
# Open Terminal 1
cd averulo-backend
npm run dev
```

Wait for: `✓ Server running on port 3000`

### Step 2: Start Frontend
```bash
# Open Terminal 2 (new window)
cd ..  # Back to root
npm start
```

Wait for QR code to appear, then:
- Press `a` for Android
- Press `i` for iOS
- Press `w` for web
- Scan QR with Expo Go app

### Step 3: Start Testing!

Follow the checklist in [MVP_TESTING_GUIDE.md](MVP_TESTING_GUIDE.md)

---

## Option 2: Full Setup (First Time)

### 1. Backend Setup

```bash
cd averulo-backend

# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed

# Start server
npm run dev
```

### 2. Frontend Setup

```bash
# Return to root
cd ..

# Install dependencies
npm install

# Start Expo
npm start
```

---

## Quick Test Scenarios

### Test 1: Login (2 minutes)
1. Open app
2. Enter email: `test@example.com`
3. Check console for OTP
4. Enter OTP
5. ✓ Should reach Home screen

### Test 2: Browse Properties (1 minute)
1. Scroll property list
2. Tap any property
3. View details
4. ✓ Images and info display

### Test 3: Host Flow (5 minutes)
1. Go to Profile
2. Tap "Switch to Host"
3. Complete onboarding
4. Start property creation
5. Test room selection (tap cards)
6. ✓ Modal opens with counter

### Test 4: Host Dashboard (2 minutes)
1. Navigate to host dashboard
2. Check bottom navigation
3. Tap Calendar → View 12×7 grid
4. Tap Statistics → Check occupancy chart (75%)
5. ✓ All screens match Figma

---

## Environment Check

### Backend `.env` Required:
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
PAYSTACK_SECRET_KEY="sk_test_..."
CORS_ORIGIN="http://localhost:19006,exp://..."
NODE_ENV="development"
```

### Quick Health Check:

```bash
# Backend health
curl http://localhost:3000/health

# Database check
cd averulo-backend && npx prisma studio
```

---

## Troubleshooting

### Backend won't start?
```bash
cd averulo-backend
rm -rf node_modules package-lock.json
npm install
npx prisma generate
npm run dev
```

### Frontend won't start?
```bash
rm -rf node_modules package-lock.json
npm install
npm start -- --reset-cache
```

### Database issues?
```bash
cd averulo-backend
npx prisma migrate reset  # ⚠️ Deletes all data!
npx prisma db seed
```

### Metro bundler issues?
```bash
npm start -- --reset-cache
# Or:
watchman watch-del-all
npm start
```

---

## Test Checklist (Quick Version)

- [ ] Backend running on port 3000
- [ ] Frontend running on Expo
- [ ] Can login with OTP
- [ ] Properties load on home screen
- [ ] Can view property details
- [ ] Can create booking (test card)
- [ ] Host onboarding works
- [ ] Host property creation (12 steps)
- [ ] Host dashboard displays correctly
- [ ] Host calendar shows 12×7 grid
- [ ] Host statistics shows 75% chart
- [ ] All host screens match Figma

---

## Next Steps After Testing

### If Everything Works:
1. Review [MVP_TESTING_GUIDE.md](MVP_TESTING_GUIDE.md) for full tests
2. Test all user flows end-to-end
3. Test admin workflows
4. Verify Paystack payments
5. Check email notifications
6. Performance testing
7. Production deployment prep

### If Issues Found:
1. Document the issue
2. Check error logs (backend console)
3. Check React Native debugger
4. Review relevant screen files
5. Test API endpoints directly
6. Check database in Prisma Studio

---

## Demo Flow (Show to Client/Investor)

### 5-Minute Demo Script:

**Slide 1: Guest Experience (2 min)**
1. Open app → "Welcome to Averulo!"
2. Browse beautiful properties
3. Tap property → View details, photos, amenities
4. Book instantly → Select dates, guests
5. Secure payment with Paystack
6. Booking confirmation ✓

**Slide 2: Host Experience (2 min)**
1. Tap "Become a Host"
2. Quick onboarding (5 min promise)
3. Create property (show 12-step wizard)
4. Room selection (tap cards, modal counter)
5. Upload photos, set prices
6. Host dashboard:
   - Manage bookings
   - 12×7 calendar grid
   - Statistics with 75% occupancy chart
   - Accept/reject booking requests

**Slide 3: Admin Control (1 min)**
1. Admin dashboard with metrics
2. Approve properties
3. Verify KYC documents
4. Monitor payments
5. User management

---

## Success Metrics

### MVP is Working When:
✓ Users can register & login
✓ Properties display correctly
✓ Booking flow completes
✓ Payments process successfully
✓ Hosts can create properties
✓ Host dashboard fully functional
✓ Calendar shows accurate data
✓ Statistics chart displays correctly
✓ Admin can manage platform
✓ All screens match Figma design

---

**Ready to test?**
1. Start backend: `cd averulo-backend && npm run dev`
2. Start frontend: `npm start`
3. Open testing guide: [MVP_TESTING_GUIDE.md](MVP_TESTING_GUIDE.md)

**Good luck! 🚀**
