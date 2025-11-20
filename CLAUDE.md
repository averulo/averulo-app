# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Averulo is a property rental platform built as a React Native Expo app with an Express/Prisma backend. The app allows users to browse properties, make bookings, process payments via Paystack, and includes admin/host dashboards for management.

## Repository Structure

This is a monorepo with two main parts:

- **Root**: React Native Expo frontend app
- **averulo-backend/**: Express.js REST API with Prisma ORM

### Frontend Architecture

- **Navigation**: React Navigation v7 with stack and bottom tab navigators
  - `App.js` defines the main navigation stack
  - `navigation/MainTabs.js` defines bottom tabs (Home, Explore, Booking, Chat)
  - `navigation/BookingStack.js` handles the booking flow
- **Screens**: 33+ screens in `/screens` directory
  - Authentication: `LoginScreen`, `OtpScreen`, `SignUpScreen`
  - Property browsing: `PropertiesListScreen`, `PropertyDetailsScreen`, `SearchScreen`
  - Booking flow: `ConfirmBookingScreen`, `PaymentScreen`, `BookingInProgressScreen`, `BookingSuccessScreen`
  - Admin: `AdminDashboardScreen`, `AdminBookingsScreen`, `AdminUsersScreen`, `AdminPropertiesScreen`, `AdminPaymentsScreen`, `AdminKycDashboardScreen`
  - KYC: `UserVerificationScreen`, `TakePhotoOfIDScreen`, `InputNINScreen`
- **State Management**: React Context API
  - `hooks/useAuth.js`: Global auth state (token, user, signIn/signOut)
  - `hooks/useNotifications.js`: Notification management
  - `hooks/usePaginatedFetch.js`: Reusable pagination hook
  - `hooks/useAdminSummary.js`: Admin dashboard data
- **API Client**: `lib/api.js` centralizes all backend API calls using fetch with `API_BASE` from Expo Constants
- **Components**: Small set of reusable UI components in `/components`

### Backend Architecture

Located in `averulo-backend/`:

- **Entry Point**: `index.js` (Express server)
- **Database**: PostgreSQL via Prisma ORM
  - Schema: `prisma/schema.prisma`
  - Models: User, Property, Booking, Review, Favorite, Notification, AvailabilityBlock, Payment
  - Enums: Role (USER/ADMIN/HOST), KycStatus (PENDING/VERIFIED/REJECTED), BookingStatus, PropStatus
- **Authentication**: JWT-based with OTP email verification
  - OTP flow: `/api/send-otp` → `/api/verify-otp` (returns JWT)
  - Middleware: `lib/auth.js` provides `auth(required)` and `requireRole(...roles)`
  - Tokens stored in AsyncStorage on frontend
- **Routes** (all under `/api`):
  - `routes/auth.js`: OTP login
  - `routes/properties.js`: Property CRUD, search, filtering
  - `routes/bookings.js`: Booking CRUD, pagination
  - `routes/payments.js`: Paystack integration, webhooks
  - `routes/reviews.js`: Property reviews
  - `routes/favorites.js`: User favorites
  - `routes/host.js`: Host dashboard & earnings
  - `routes/availability.js`: Property availability management
  - `routes/notifications.js`: User notifications
  - `routes/userRoutes.js`: User profile, KYC
  - `routes/admin.js`: Admin stats & analytics
  - `routes/admin/*.js`: 6 additional admin subroutes
- **Libraries**:
  - `lib/prisma.js`: Prisma client singleton
  - `lib/auth.js`: JWT middleware
  - `lib/mailer.js`: Nodemailer transporter
  - `lib/pagination.js`: Pagination utilities
  - `lib/pricing.js`: Booking price calculations
  - `lib/roles.js`: Role-based access control
  - `lib/upload.js`: File upload helpers
  - `lib/validate.js`: Request validation
  - `lib/notify.js`, `lib/notifications.js`: Push notifications
- **File Uploads**: Multer configured for images/PDFs (KYC documents), stored in `uploads/`
- **Webhooks**: Paystack webhook at `/api/payments/webhook/paystack` (uses raw body parser before JSON middleware)
- **Security**: Helmet, CORS, rate limiting (OTP endpoints), input validation

## Development Commands

### Frontend (Expo)
```bash
npm install                    # Install dependencies
npm start                      # Start Expo dev server
npm run dev:frontend           # Same as npm start
npm run android                # Open Android emulator
npm run ios                    # Open iOS simulator
npm run web                    # Open web browser
npm run lint                   # Run ESLint
```

### Backend (Node.js/Express)
```bash
cd averulo-backend
npm install                    # Install backend dependencies
npm run dev                    # Start backend with nodemon (watches index.js)
npm run seed                   # Seed database with test data
```

### Database (Prisma)
```bash
cd averulo-backend
npx prisma migrate dev         # Create and apply migration
npx prisma migrate deploy      # Apply migrations (production)
npx prisma generate            # Generate Prisma Client
npx prisma studio              # Open Prisma Studio GUI
npx prisma db push             # Push schema changes without migration (dev only)
npx prisma db seed             # Run seed script (prisma/seed.js)
```

## Key Implementation Details

### Authentication Flow
1. User enters email → frontend calls `sendOtp(email)` from `lib/api.js`
2. Backend generates 6-digit OTP, sends via email (or returns in response if dev mode)
3. User enters OTP → frontend calls `verifyOtp(email, otp)`
4. Backend validates OTP, creates/finds user, returns JWT token
5. Frontend stores token in AsyncStorage, calls `signIn(token)` from `useAuth` context
6. Subsequent API calls include `Authorization: Bearer <token>` header

### Protected Routes
- Backend: Use `auth(true)` middleware for authenticated endpoints
- For role-based access, chain `requireRole('ADMIN')` or `requireRole('HOST')` after `auth(true)`
- Frontend: Check `user` and `user.role` from `useAuth()` context to conditionally render admin/host features

### Booking Flow
1. User selects property → `PropertyDetailsScreen`
2. Enters dates, guests → `ConfirmBookingScreen` (calculates price via backend)
3. Reviews details → `PaymentScreen` (initializes Paystack payment)
4. Payment processing → `BookingInProgressScreen`
5. Success/failure → `BookingSuccessScreen` or error handling
6. Webhook confirms payment → backend updates booking status

### Payment Integration
- Provider: Paystack (Nigerian payment gateway)
- Webhook signature verification using HMAC SHA-512
- Webhook must be registered BEFORE `express.json()` middleware (uses `express.raw()`)
- Dev helpers at `/__dev/secret-meta`, `/__dev/hmac` for debugging webhooks

### Admin Features
- Admin role required for accessing admin routes
- Dashboard shows: total users, properties, bookings, revenue, reviews
- CSV/Excel export utilities in `utils/exportCsv.js`, `utils/exportExcel.js`
- KYC verification workflow for user identity documents
- Analytics endpoints: trends, top hosts, top properties

### Environment Configuration
- Frontend: Use Expo Constants (`expo-constants`) for configuration
- Backend: `.env` file with:
  - `DATABASE_URL`: PostgreSQL connection string
  - `JWT_SECRET`: Secret for signing tokens
  - `JWT_EXPIRES_IN`: Token expiration (default: 7d)
  - `SMTP_USER`, `SMTP_PASS`: Email credentials
  - `PAYSTACK_SECRET_KEY`: Paystack API key
  - `CORS_ORIGIN`: Comma-separated allowed origins
  - `NODE_ENV`: production/development
- Never commit `.env` files (use `.env.example` templates)

## Common Patterns

### API Calls from Frontend
```javascript
import { API_BASE } from '../lib/api';

const response = await fetch(`${API_BASE}/api/endpoint`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify(data),
});
```

### Prisma Queries
```javascript
import { prisma } from '../lib/prisma.js';

const user = await prisma.user.findUnique({ where: { id } });
const properties = await prisma.property.findMany({
  where: { status: 'ACTIVE' },
  include: { host: true },
});
```

### Navigation
```javascript
// Stack navigation
navigation.navigate('PropertyDetailsScreen', { propertyId: '123' });

// Tab navigation (from within MainTabs)
navigation.navigate('ExploreTab');

// Go back
navigation.goBack();
```

### Context Usage
```javascript
import { useAuth } from '../hooks/useAuth';

const { user, token, signIn, signOut, refreshUser } = useAuth();
```

## Important Notes

- Frontend and backend run as separate processes during development
- Backend must be running for frontend to work (API calls will fail otherwise)
- OTP emails require SMTP configuration; dev mode returns OTP in API response
- Paystack webhooks require HTTPS in production (use ngrok for local testing)
- All dates stored in UTC in database
- File uploads stored locally in `averulo-backend/uploads/` (consider cloud storage for production)
- Role hierarchy: ADMIN has full access, HOST can manage own properties, USER can book
- Prisma migrations should be created in development, then deployed to production
