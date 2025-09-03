# 🚀 Averulo App – Developer Onboarding

Welcome to the **Averulo App** team! 🎉  
Follow these steps to get your development environment set up.

---

## 1. Clone the Repository
```bash
git clone https://github.com/averulo/averulo-app.git
cd averulo-app
```

---

## 2. Install Dependencies
Make sure you have **Node.js v18+** installed. Then run:
```bash
npm install
```

---

## 3. Environment Variables
We don’t commit secrets.  

- Copy the example file:
```bash
cp .env.example .env
```

- Fill in `.env` with the actual values (shared privately by Kehinde):
```env
API_BASE_URL=http://192.168.xxx.xxx:4000/api
PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
APP_ENV=development
```

---

## 4. Run the App with Expo
```bash
npx expo start
```

- iOS Simulator → press `i`  
- Android Emulator → press `a`  
- Physical Phone → scan QR code with **Expo Go**  

---

## 5. iOS Development Build (for iPhones)
If you want to run directly on your iPhone:
```bash
npx expo run:ios
```

Make sure to:
- Plug your iPhone into your Mac  
- Tap **Trust This Computer** on iPhone  
- Open the project in **Xcode** → **Signing & Capabilities** → select your Apple ID (Personal Team)  

---

## 6. Workflow
- Create branches like `feature/login-screen`  
- Push your branch to GitHub  
- Open a Pull Request into `dev` branch  
- After review, changes get merged into `main`  

---

## 7. Troubleshooting
- If something breaks, restart Metro:
```bash
npx expo start -c
```
- Check `.env` values  
- If still stuck → ping **Kehinde**  

---

✅ That’s it — you’re onboarded and ready to build!  
