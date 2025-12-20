# Testing Quick Reference - One Page

## 📱 Setup (2 Minutes)

1. **Install Expo Go** (App Store or Play Store)
2. **Ask dev to start server** (`npm start`)
3. **Scan QR code** with Expo Go
4. **Wait 30-60 seconds** for app to load

**Must be on SAME WiFi as dev computer!**

---

## 🎯 What to Test

### Guest Flow (15 min)
```
Login → Browse → Property Details → Book → Pay → View Booking
```

### Host Flow (25 min)
```
Become Host → 12 Steps → Confirm → Preview → Success
```

---

## 🐛 Report Bugs

**Template:**
```
Screen: [name]
Did: [actions]
Expected: [should happen]
Got: [actually happened]
Screenshot: [attach]
```

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| Won't connect | Check WiFi, same network? |
| Can't scan QR | Open Expo Go → Scan QR Code |
| App crashes | Shake phone → Reload |
| Photos won't upload | Check permissions in Settings |
| Keyboard covers input | Bug - report it! |

---

## ✅ Testing Checklist

**Test ALL of these:**

### Navigation
- [ ] All screens load
- [ ] Back button works
- [ ] Tabs work
- [ ] Modal open/close

### Forms
- [ ] Can type in all inputs
- [ ] Required fields show errors
- [ ] Submit buttons work
- [ ] Keyboard shows/hides

### Media
- [ ] Photos upload
- [ ] Photos display
- [ ] Reorder photos works
- [ ] Photos save

### Booking
- [ ] Select dates
- [ ] Select guests
- [ ] Calculate price
- [ ] Payment flow
- [ ] Confirmation shows

### Host
- [ ] All 12 steps work
- [ ] Progress bar updates
- [ ] Can go back
- [ ] Can edit in review
- [ ] Success modal shows

---

## 📊 Test Priorities

**🔴 Must Test:**
- Login/signup
- Browse properties
- Complete booking
- Host property creation (12 steps)
- Photo upload & reorder

**🟡 Should Test:**
- Search & filters
- Property details
- My bookings
- Reviews
- Profile

**🟢 Nice to Test:**
- Settings
- Notifications
- Edge cases

---

## 💡 Tips

✅ **Do:**
- Use fake data
- Take screenshots of bugs
- Test like a real user
- Try to break things
- Note what's confusing

❌ **Don't:**
- Rush through
- Skip steps
- Use real payment cards
- Test on different WiFi

---

## 📞 Need Help?

**Ask developer if:**
- Can't connect
- App won't load
- Major crashes
- Confused about expected behavior

---

## 🚀 Quick Start Testing

**Fastest way to test:**

1. Open Expo Go
2. Scan QR code
3. Wait for app to load
4. Navigate to "Become a Host"
5. Complete all 12 steps (takes 20 min)
6. Report any issues

**Done! You've tested the main feature!**

---

## 📚 Full Guides

For detailed testing:
- **COMPLETE_APP_TESTING_GUIDE.md** - Full testing manual
- **TEST_DEVICE_SETUP.md** - Setup & troubleshooting
- **TESTING_GUIDE.md** - Original host flow guide

---

**Ready? Scan the QR code and start testing!** 🎉
