🚀 Averulo Backend – Developer Onboarding

Welcome to the Averulo Backend!
This guide helps you get the project running locally and test APIs with Postman.

1. Clone the repository

git clone https://github.com/averulo
cd averulo-backend

2. Install dependencies

npm install

3. Set up environment variables

Create a .env file at the project root. Minimum required keys:

# Server
PORT=4000
APP_ENV=development
CORS_ORIGIN=http://localhost:3000

# JWT
JWT_SECRET=dev-secret
JWT_EXPIRES_IN=7d

# Database
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/averulo"

# Paystack
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxx
PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxx

# SMTP (optional for OTP emails, else dev mode fallback is used)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=xxxxxxx
SMTP_PASS=xxxxxxx
EMAIL_FROM="Averulo <no-reply@averulo.local>"

⚠️  Important: never commit your real .env to GitHub.

4. Database setup

Run migrations with Prisma:

npx prisma migrate dev

Optional: generate Prisma client after changes:

npx prisma generate

5. Start the backend

npm run dev

Backend runs on:
👉 http://localhost:4000

Health check:

curl http://localhost:4000/api/test

6. Postman setup

We provide ready-made files in postman/ folder:
 • Averulo_Backend_API_Tests.postman_collection.json
 • Averulo_Local.postman_environment.json

Steps:
	1.	Open Postman.
	2.	Import both JSON files.
	3.	Switch to environment: Averulo – Local.
	4.	Run requests in order (Auth → Properties → Bookings → Payments).

⸻

7. Ngrok for Webhooks (Payments)

To test Paystack webhooks locally:\

ngrok http 4000

You’ll get a public URL like:

https://random-id.ngrok-free.app -> http://localhost:4000

Go to Paystack dashboard → set webhook URL to:

https://random-id.ngrok-free.app/api/payments/webhook/paystack

8. Current project status
	•	✅ Authentication & OTP
	•	✅ Properties CRUD
	•	✅ Bookings flow
	•	✅ Payments (Paystack)
	•	❌ Notifications (not implemented yet – coming soon)

9. Troubleshooting
	•	500 error on webhook → check ngrok is running.
	•	Prisma error → verify DATABASE_URL.
	•	OTP emails not sent → dev mode returns OTP in API response.

10. 
    kenny will  provide you:
	•	PAYSTACK_SECRET_KEY
	•	PAYSTACK_PUBLIC_KEY
	•	JWT_SECRET (keep it dev-secret)
	2.	They set up locally:
	•	DATABASE_URL (with their Postgres)
	•	PORT, APP_ENV, CORS_ORIGIN

    OTP will be returned in API response under devOtp.