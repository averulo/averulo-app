Averulo App – Developer Onboarding 🚀

Welcome to the Averulo App team!
Follow these steps to set up your environment and start contributing.

1. Clone the Repository

Clone the code to your machine:

git clone https://github.com/averulo/averulo-app.git
cd averulo-app

2. Install Dependencies

Make sure you have Node.js v18+ installed, then install packages:

npm install

3. Environment Variables

We don’t commit secrets.
Copy the example file:

cp .env.example .env

Then fill in .env with the actual values (shared privately by Kehinde):


API_BASE_URL=http://192.168.xxx.xxx:4000/api
PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
APP_ENV=development

4. Run the App with Expo

Start Metro bundler:

npx expo start

	•	Press i → run iOS simulator
	•	Press a → run Android emulator
	•	Scan the QR code with Expo Go app → run on your phone


5. iOS Development Build (for iPhones)

If you want to run directly on your iPhone:

npx expo run:ios

Steps:
	•	Plug your iPhone into your Mac
	•	Tap Trust This Computer on iPhone
	•	Open the project in Xcode → Signing & Capabilities → select your Apple ID (Personal Team)


6. Workflow
	•	Create branches like feature/login-screen
	•	Push your branch to GitHub
	•	Open a Pull Request into dev branch
	•	After review, changes get merged into main

7. Branch Protection

On GitHub → Settings → Branches → Branch protection rules:
	•	Protect main and dev
	•	✅ Require a pull request before merging
	•	✅ Require conversation resolution before merging



⸻

8. Troubleshooting
	•	Restart Metro bundler:

npx expo start -c

	•	Double-check .env values
	•	If still stuck → ping Kehinde

✅ That’s it — you’re onboarded and ready to build! 🎉
