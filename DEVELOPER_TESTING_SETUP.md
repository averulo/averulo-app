# Developer Guide: Setting Up Testing for Your Team
## No Repo Cloning Required for Testers!

---

## 🎯 Overview

**Good News:** Testers don't need to clone the repo or install anything except Expo Go!

**How It Works:**
1. You run the dev server on your computer
2. Expo creates a QR code
3. Testers scan it with Expo Go app
4. App loads on their phones from your server

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Start Your Server

```bash
cd averulo-app
npm start
```

**You'll see:**
```
Metro waiting on exp://192.168.1.5:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

[QR CODE DISPLAYED HERE]

› Press a │ open Android
› Press i │ open iOS simulator
```

### Step 2: Share with Testers

**Option A: Same Office/Location**
- Show them your screen with the QR code
- They scan it directly

**Option B: Send Screenshot**
- Screenshot the QR code
- Send via Slack/Email/WhatsApp
- They scan the screenshot

**Option C: Remote Team (Tunnel Mode)**
```bash
npm start -- --tunnel
```
- Creates public URL that works anywhere
- Share the QR code or `exp://` URL
- Slightly slower but works across different networks

---

## 📱 Tester Requirements (Super Simple!)

### What Testers Need:
1. ✅ **Smartphone** (iOS or Android)
2. ✅ **Expo Go app** (FREE from App Store/Play Store)
3. ✅ **Same WiFi** as you (or use tunnel mode)

### What Testers DON'T Need:
- ❌ Clone the repo
- ❌ Install Node.js
- ❌ Run terminal commands
- ❌ Install dependencies
- ❌ Set up development environment
- ❌ Know how to code

**Literally just: Install app → Scan code → Test!**

---

## 🌐 Network Options

### Option 1: Same WiFi (Recommended - Fastest)

**Best For:**
- Office testing
- Team in same location
- Local QA

**Setup:**
```bash
npm start
```

**Requirements:**
- Tester's phone on SAME WiFi network
- WiFi allows device-to-device communication
- Firewall not blocking ports 19000-19001

**Pros:**
- ⚡ Very fast
- 🔒 Secure (local network)
- 💯 Reliable

**Cons:**
- 📍 Must be same location
- 🌐 Doesn't work on guest/corporate WiFi sometimes

---

### Option 2: Tunnel Mode (Works Anywhere)

**Best For:**
- Remote testers
- Different locations
- Corporate WiFi with restrictions

**Setup:**
```bash
npm start -- --tunnel
```

**You'll see:**
```
› Tunnel ready.
› exp://abc-123.username.exp.direct:80

[QR CODE]
```

**Share:**
- The QR code, OR
- The `exp://` URL (they can paste in Expo Go)

**Pros:**
- 🌍 Works anywhere in the world
- 🔓 Bypasses network restrictions
- 👥 Easy for distributed teams

**Cons:**
- 🐌 Slower (routes through Expo servers)
- 🌐 Requires internet
- ⏱️ May have latency

---

### Option 3: Phone Hotspot (Backup)

**If WiFi won't work:**

1. Turn on phone hotspot on your phone
2. Connect your computer to hotspot
3. Connect tester's phone to same hotspot
4. `npm start` as normal
5. They scan QR code

**Works when:**
- Office WiFi blocks device communication
- No WiFi available
- Quick emergency testing

---

## 👥 Testing with Multiple People

### All at Once (Recommended)

**Setup:**
```bash
npm start
```

**Share:**
- One QR code to everyone
- Or screenshot and send to group chat

**Result:**
- Everyone scans same code
- All test simultaneously
- Changes you make update for everyone

**Capacity:**
- Tested with 50+ concurrent users
- No practical limit for small teams

---

### One at a Time

Sometimes you want to:
- Guide each tester personally
- Debug issues individually
- Collect feedback in sessions

**Still same QR code** - just schedule testing slots!

---

## 🔄 During Testing

### Making Changes

**When you save code:**
- ✅ Fast Refresh auto-reloads on tester phones
- ✅ They don't need to do anything
- ✅ Changes appear in ~2 seconds

**If something breaks:**
- Testers can shake phone → Reload
- Or you can restart server

### Monitoring

**Watch terminal for:**
- Errors (red text)
- Warnings (yellow text)
- Console logs
- Network requests

**Useful logs:**
```bash
# You'll see when someone connects
› Opening exp://192.168.1.5:8081 on iPhone 14

# You'll see errors
ERROR: Cannot read property 'name' of undefined
```

---

## 📊 Testing Session Checklist

### Before Session

**Developer Checklist:**
- [ ] Pull latest code (`git pull`)
- [ ] Install dependencies (`npm install`)
- [ ] Test on your device first
- [ ] Start server (`npm start`)
- [ ] Start backend if needed (`cd averulo-backend && npm run dev`)
- [ ] Prepare QR code to share
- [ ] Have testing guide ready (TESTER_SIMPLE_GUIDE.md)

**Send to Testers:**
1. TESTER_SIMPLE_GUIDE.md (the simple one!)
2. QR code (screenshot)
3. WiFi name (if same location)
4. Your contact (for questions)

---

### During Session

**You Should:**
- [ ] Keep terminal visible (watch for errors)
- [ ] Keep server running (don't close terminal)
- [ ] Be available for questions
- [ ] Take notes of reported issues
- [ ] Fix critical bugs if possible

**You Can:**
- [ ] Make code changes (auto-updates for testers)
- [ ] Add console.logs for debugging
- [ ] Push quick fixes

---

### After Session

**Collect:**
- [ ] Bug reports
- [ ] Screenshots
- [ ] Feedback notes
- [ ] Feature requests

**Then:**
- [ ] Prioritize bugs
- [ ] Create issues in tracker
- [ ] Plan fixes
- [ ] Thank testers!

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to Metro bundler"

**Cause:** Not on same WiFi

**Solutions:**
1. ✅ Verify both on same network
2. ✅ Use tunnel mode: `npm start -- --tunnel`
3. ✅ Restart Metro: `Ctrl+C` then `npm start`
4. ✅ Clear cache: `npm start -- --reset-cache`

---

### Issue: QR code won't scan

**Cause:** Various

**Solutions:**
1. ✅ Take screenshot → send to tester → they scan screenshot
2. ✅ Send `exp://` URL → they paste in Expo Go manually
3. ✅ Try tunnel mode
4. ✅ Check QR code isn't cut off in terminal

---

### Issue: App loads but shows errors

**Cause:** Code issues or missing dependencies

**Solutions:**
1. ✅ Check terminal for error details
2. ✅ Run `npm install` again
3. ✅ Clear cache: `npm start -- --reset-cache`
4. ✅ Check you're on correct branch

---

### Issue: Changes not appearing

**Cause:** Fast Refresh failed

**Solutions:**
1. ✅ Tester shakes phone → Reload
2. ✅ Save file again (trigger refresh)
3. ✅ Restart Metro bundler
4. ✅ Full refresh: `r` in terminal

---

### Issue: App super slow

**Cause:** Tunnel mode latency or large assets

**Solutions:**
1. ✅ Use same WiFi instead of tunnel
2. ✅ Optimize images
3. ✅ Check network speed
4. ✅ Close other apps on computer

---

## 💾 Backend Requirements

### If Backend Needed:

**Terminal 1 (Frontend):**
```bash
cd averulo-app
npm start
```

**Terminal 2 (Backend):**
```bash
cd averulo-backend
npm run dev
```

**Make sure:**
- Backend running on `http://localhost:3000`
- Frontend can reach backend
- Update `.env` if needed

---

### If No Backend:

Many UI/UX features can be tested without backend:
- ✅ Navigation
- ✅ Form validation
- ✅ UI interactions
- ✅ Photo upload (stored locally)
- ✅ Most of host flow

Backend needed for:
- ❌ Login/signup
- ❌ Actual bookings
- ❌ Payment processing
- ❌ Data persistence

---

## 📱 Testing on iOS Simulator (Mac Only)

**Instead of physical phones:**

```bash
npm start
# Press 'i' when ready
```

**Pros:**
- No phone needed
- Easy screenshots
- Fast testing

**Cons:**
- Mac only
- Not real device behavior
- Can't test camera/sensors

---

## 🤖 Testing on Android Emulator

**Instead of physical phones:**

```bash
npm start
# Press 'a' when ready
```

**Pros:**
- No phone needed
- Works on Windows/Mac/Linux
- Can test different Android versions

**Cons:**
- Slow on some computers
- Uses lots of RAM
- Not real device behavior

---

## 🔐 Security Notes

### Safe for Testing:
- ✅ Local network (same WiFi)
- ✅ Tunnel mode (encrypted)
- ✅ Test data only

### Remind Testers:
- Use fake data only
- Don't use real payment cards
- Test environment only

---

## 📞 Support Templates

### Email to Testers

```
Subject: Test the New Averulo App!

Hi [Team],

Please help test our new property rental app! It's super easy:

1. Install "Expo Go" app (free from App Store/Play Store)
2. Connect to [WiFi Name]
3. Scan the QR code attached
4. Start testing!

Guide: [Attach TESTER_SIMPLE_GUIDE.md]

Available for questions: [Your hours]
Contact: [Your contact info]

Thanks!
```

---

### Slack Message Template

```
🎉 New App Testing - Help Needed!

Ready to test our app? Here's how:
1️⃣ Install "Expo Go" app on your phone
2️⃣ Scan this QR code 👇
[Attach QR screenshot]
3️⃣ Follow testing guide: [Link to TESTER_SIMPLE_GUIDE.md]

📍 Same WiFi: [Network Name]
⏰ Testing window: [Time]
❓ Questions: DM me!

Thanks for helping! 🙏
```

---

## ✅ Pre-Flight Checklist

Before starting testing session:

**Code:**
- [ ] Latest code pulled
- [ ] Dependencies installed
- [ ] No console errors
- [ ] Tested yourself first

**Server:**
- [ ] Metro bundler running
- [ ] Backend running (if needed)
- [ ] No port conflicts
- [ ] Firewall not blocking

**Testers:**
- [ ] Have guide (TESTER_SIMPLE_GUIDE.md)
- [ ] Have QR code
- [ ] Know WiFi network
- [ ] Expo Go installed (verified)

**You:**
- [ ] Available for questions
- [ ] Computer charged
- [ ] Phone charged (for your testing)
- [ ] Note-taking ready

---

## 🎯 Success Criteria

Testing session successful when:
- ✅ All testers could connect
- ✅ App loaded on their phones
- ✅ Most features worked
- ✅ Bugs documented
- ✅ Feedback collected

---

## 📊 Recommended Testing Schedule

### Week 1: Internal Testing
- You + 1-2 team members
- Fix obvious bugs
- Verify all flows work

### Week 2: Small Group
- 5-10 testers
- Mixed iOS/Android
- Collect detailed feedback

### Week 3: Larger Group
- 20+ testers
- Stress test
- Final polish

---

## 💡 Pro Tips

1. **Start Small**: Test with 1-2 people first
2. **Have Guide Ready**: Send TESTER_SIMPLE_GUIDE.md in advance
3. **Use Tunnel for Remote**: Don't fight with WiFi
4. **Monitor Terminal**: Catch errors early
5. **Take Screenshots**: Of QR code, errors, everything
6. **Set Time Limit**: 60-90 min max per session
7. **Have Backup Plan**: Simulator ready if QR fails
8. **Thank Testers**: They're helping you!

---

## 🚀 You're Ready!

**To start testing:**
1. Run `npm start`
2. Share QR code
3. Share TESTER_SIMPLE_GUIDE.md
4. Watch them test!

**That's it! No repo cloning, no complex setup!**

---

**Questions? Check TESTING_OVERVIEW.md for full documentation!**

**Happy Testing! 🎉**
