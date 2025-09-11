🚀 Averulo Backend – Developer Onboarding

Welcome to the Averulo Backend!
This guide helps you get the project running locally and test APIs with Postman.

1. Clone the repository

git clone https://github.com/averulo
cd averulo-backend

2. Install dependencies

npm install

3.  Environment Variables

Create your own .env file in the project root by copying the provided template:

🔑 Keys Kenny will provide you
	•	JWT_SECRET=dev-secret
	•	PAYSTACK_SECRET_KEY=sk_test_xxxxx
	•	PAYSTACK_PUBLIC_KEY=pk_test_xxxxx

	•	You must configure these locally:
	•	DATABASE_URL (Postgres connection string)
	•	PORT, APP_ENV, CORS_ORIGIN

the backend will fall back to dev mode and return OTP directly in the API response (devOtp):

⚠️ Do not commit your real .env file to GitHub.


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

Inside the postman/ folder you’ll find:
	•	Averulo_Backend_API_Tests.postman_collection.json
	•	Averulo_Local.postman_environment.json

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
	•	✅ Notifications (email via SMTP – optional, requires SMTP_* config)

9. Troubleshooting
	•	500 error on webhook → check ngrok is running.
	•	Prisma error → verify DATABASE_URL.
	•	OTP emails not sent → dev mode returns OTP in API response.

devs  can test notifications, but only if they configure SMTP.
