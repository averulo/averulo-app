# AVERULO - PROPERTY RENTAL MOBILE APPLICATION

**Type:** Full-Stack Mobile Application (Portfolio Project)
**Developer:** Omoyele Omotanwa
**Timeline:** [Start Date] - December 2025 (Active Development)
**Status:** MVP Complete, Testing Phase
**Platforms:** iOS & Android

---

## PROJECT OVERVIEW

Averulo is a comprehensive property rental platform connecting travelers with accommodation across Africa. The application enables users to browse, book, and manage property rentals while providing hosts with tools to list properties, manage bookings, and track earnings. The platform includes secure payment processing via Paystack, identity verification (KYC), real-time notifications, and a dual-mode interface allowing hosts to seamlessly switch between managing their properties and booking stays at other locations.

**Target Users:**
- Travelers seeking verified accommodations
- Property owners/hosts managing rental listings
- Platform administrators overseeing operations

---

## MY ROLE & RESPONSIBILITIES

As the **sole full-stack developer**, I was responsible for the entire application lifecycle:

- Designed and architected complete mobile application with 50+ screens
- Developed RESTful backend API with authentication, payments, and data management
- Implemented dual-role user system (Guest/Host modes with seamless switching)
- Integrated third-party services (Paystack payments, Expo notifications, Mapbox maps)
- Built comprehensive admin dashboard for platform management
- Designed and implemented KYC verification workflow with document upload
- Configured cloud deployment and over-the-air (OTA) update system
- Conducted user acceptance testing and implemented iterative improvements
- Created deployment pipeline for both iOS and Android platforms

---

## TECHNICAL STACK

### Frontend
- **Framework:** React Native (Expo SDK 54)
- **Navigation:** React Navigation v7 (Stack & Tab navigators)
- **State Management:** React Context API (useAuth, useNotifications)
- **UI Components:** Custom components with responsive design
- **Maps:** Mapbox Maps SDK for React Native
- **Notifications:** Expo Notifications with push notification support
- **Fonts:** Custom Manrope font family (8 weights)
- **Image Handling:** Expo Image Picker with compression

### Backend
- **Runtime:** Node.js with Express.js
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT with email OTP verification
- **Payment Processing:** Paystack API integration with webhook handling
- **Email Service:** Nodemailer with SMTP (SendGrid/Gmail)
- **File Upload:** Multer with cloud storage support (Cloudinary)
- **Security:** Helmet, CORS, rate limiting, input validation
- **API Architecture:** RESTful endpoints with role-based access control

### DevOps & Deployment
- **Frontend Hosting:** Expo Application Services (EAS)
- **Backend Hosting:** Render cloud platform
- **Database Hosting:** Render PostgreSQL
- **Build System:** EAS Build for native iOS/Android apps
- **Updates:** EAS Update for over-the-air deployments
- **Version Control:** Git with GitHub
- **Environment Management:** dotenv for configuration

---

## ARCHITECTURE & DESIGN PATTERNS

### Frontend Architecture
- **Component Structure:** Functional components with React Hooks
- **Navigation Pattern:** Nested navigation (Stack within Tabs)
- **State Management:** Global context providers with localStorage persistence
- **API Layer:** Centralized API client (lib/api.js) with fetch wrapper
- **Custom Hooks:** Reusable hooks for auth, notifications, pagination, data fetching

### Backend Architecture
- **MVC Pattern:** Separated routes, controllers, and database models
- **Middleware Chain:** Authentication → Role validation → Route handlers
- **Database Migrations:** Prisma schema with migration system
- **Error Handling:** Centralized error handling with appropriate HTTP status codes
- **Security Layers:** Input validation, SQL injection prevention, XSS protection

### Database Schema
- **Users:** Authentication, roles (USER/HOST/ADMIN), KYC status
- **Properties:** Listings with host relationships, status management
- **Bookings:** Reservation system with status tracking
- **Payments:** Transaction records with Paystack integration
- **Reviews:** Property ratings and feedback
- **Notifications:** User notification queue
- **Availability:** Property calendar management

---

## KEY FEATURES DEVELOPED

### 1. **Authentication System**
- Email-based OTP verification (6-digit code)
- JWT token management with secure storage
- Session persistence across app restarts
- Role-based access control (User/Host/Admin)
- Auto-logout on token expiration
- Development mode for testing without SMTP

### 2. **Dual-Mode User Interface**
- Seamless switching between Guest and Host modes
- Separate navigation stacks for each role
- Persistent role state across sessions
- Visual toggle button with swap icon
- Hosts can book as guests when traveling

### 3. **Property Management (Host Features)**
- Multi-step property creation wizard (12 screens)
- Rich property details (type, amenities, pricing, location)
- Photo upload with drag-to-reorder functionality
- Interactive map integration for property location selection
- Availability calendar management
- Property preview before publishing
- Real-time property statistics dashboard

### 4. **Booking System**
- Advanced property search with filters
- Date range selection with calendar UI
- Guest count specification
- Dynamic price calculation (nightly rates + fees)
- Booking confirmation workflow
- Real-time booking status tracking
- Host approval/decline functionality
- Booking history and management

### 5. **Payment Integration**
- Paystack payment gateway integration
- Secure payment initialization
- Webhook verification with HMAC signatures
- Payment status tracking
- Transaction history
- Automatic booking confirmation on payment
- Refund handling for cancelled bookings
- Admin payment dashboard with analytics

### 6. **KYC Verification System**
- Multi-step identity verification workflow
- Document upload (ID card, passport, NIN)
- Photo capture with device camera
- Admin review dashboard
- Status tracking (Pending/Verified/Rejected)
- Automated notifications on status changes
- Secure document storage

### 7. **Admin Dashboard**
- Comprehensive platform statistics
- User management (view, edit, delete, assign roles)
- Property oversight with approval workflow
- Booking monitoring and management
- Payment tracking and reconciliation
- KYC verification queue
- CSV/Excel export functionality
- Analytics and trend visualization

### 8. **Notification System**
- Push notification infrastructure
- In-app notification center
- Email notifications for critical events
- Notification preferences management
- Real-time booking alerts for hosts
- Payment confirmation notices
- KYC status updates

### 9. **Host Dashboard & Analytics**
- Earnings overview with visual charts
- Booking statistics (current/upcoming/past)
- Occupancy rate tracking (SVG circular charts)
- Property performance metrics
- Review management
- Calendar view of reservations
- Quick actions for booking management

### 10. **Search & Discovery**
- Location-based property search
- Filter by price, amenities, property type
- Interactive filters with live updates
- Property recommendations
- Featured deals and promotions
- "Your Matches" personalized suggestions
- Business traveler section

### 11. **User Profile Management**
- Profile editing (name, email, phone, DOB)
- Avatar management
- Settings and preferences
- Notification settings
- Switch to host account flow
- Profile completion tracking
- Account security options

### 12. **Review System**
- Post-booking review submission
- 5-star rating system
- Written feedback
- Host responses
- Review moderation (admin)
- Average rating calculation
- Review display on property listings

---

## TECHNICAL CHALLENGES SOLVED

### 1. **Challenge: Paystack Webhook Security**
**Problem:** Webhooks require raw body for HMAC signature verification, but Express JSON middleware parses body before webhook handler can access it.

**Solution:**
- Configured raw body parser specifically for webhook route
- Registered webhook route BEFORE `express.json()` middleware
- Implemented HMAC SHA-512 signature verification
- Created development helper endpoints for testing webhook signatures
- Added comprehensive logging for debugging webhook failures

```javascript
// Webhook BEFORE JSON parsing
app.post('/api/payments/webhook/paystack', express.raw({type: 'application/json'}), webhookHandler);
// Then JSON middleware for other routes
app.use(express.json());
```

### 2. **Challenge: Dual-Role Navigation System**
**Problem:** Users with HOST role need to access both guest features (booking other properties) and host features (managing their listings) without separate accounts.

**Solution:**
- Implemented context-aware navigation reset system
- Created dedicated navigation stacks for each mode
- Added visual toggle button in both interfaces
- Maintained user role persistence across mode switches
- Used `navigation.reset()` to prevent back button confusion
- Styled toggle with clear visual indicators (swap icon, border)

### 3. **Challenge: Over-The-Air Updates with Native Builds**
**Problem:** Need to push bug fixes and updates to users without requiring app store redownload.

**Solution:**
- Configured EAS Update system with runtime version policy
- Implemented automatic update check on app launch
- Added silent background update download
- Created preview channel for testing updates
- Separated native changes (require rebuild) from JS changes (OTA update)
- Added update completion logging for monitoring

### 4. **Challenge: Image Upload and Reordering**
**Problem:** Property listings require multiple photos with specific ordering, and mobile file handling is complex.

**Solution:**
- Built custom drag-and-drop reorder interface
- Implemented Expo Image Picker with compression
- Created visual preview grid with delete functionality
- Stored order metadata with images
- Used Multer for backend file handling
- Prepared cloud storage migration path (Cloudinary)

### 5. **Challenge: OTP Development Without SMTP**
**Problem:** Testing OTP flow without configuring production email service during development.

**Solution:**
- Implemented dual-mode OTP system in backend
- Development mode returns OTP in API response
- Frontend displays OTP in alert for testing
- Production mode sends actual email
- Environment variable controls mode selection
- Zero code changes needed when switching modes

```javascript
// Backend returns devOtp in development
if (!process.env.SMTP_USER) {
  return res.json({ success: true, devOtp: otp });
}
// Frontend shows it
if (res.data.devOtp) {
  alert(`Dev OTP: ${res.data.devOtp}`);
}
```

### 6. **Challenge: Complex Nested Navigation**
**Problem:** App requires bottom tabs, stack navigation, and modal flows with different authentication states.

**Solution:**
- Designed hierarchical navigation structure:
  - Root Stack (auth check) → MainTabs / HostDashboard / Auth Screens
  - MainTabs → 4 tabs each with their own stack navigator
  - Booking Stack → Multi-step booking flow
- Used React Navigation v7 with TypeScript-safe navigation
- Implemented auth context to conditionally render routes
- Created custom navigation helpers for deep linking

### 7. **Challenge: Circular Chart Implementation**
**Problem:** Design required exact 75% circular occupancy chart, but React Native doesn't have built-in charting.

**Solution:**
- Used `react-native-svg` for precise SVG rendering
- Calculated strokeDasharray mathematically: `2 * π * r * 0.75`
- Overlaid background and progress circles
- Added centered text absolutely positioned
- Created reusable chart component
- Ensured pixel-perfect match to design mockup

```javascript
<Circle
  cx="110" cy="110" r="96"
  stroke="#3B82F6"
  strokeWidth="28"
  strokeDasharray={`${2 * Math.PI * 96 * 0.75} ${2 * Math.PI * 96}`}
/>
```

### 8. **Challenge: Date Handling Across Timezones**
**Problem:** Booking dates should be consistent regardless of user timezone.

**Solution:**
- Stored all dates in UTC in database
- Used ISO 8601 format for API communication
- Converted to local time only for display
- Implemented date validation on both frontend and backend
- Added timezone-aware date comparison logic
- Created date utility functions for consistency

---

## SKILLS DEMONSTRATED

### Mobile Development
- React Native cross-platform development
- Expo managed workflow and EAS services
- iOS and Android platform-specific handling
- Responsive UI design for multiple screen sizes
- Touch gesture handling and animations
- Native module integration (camera, maps, notifications)

### Backend Development
- RESTful API design and implementation
- Database schema design and optimization
- Authentication and authorization systems
- Payment gateway integration
- Webhook handling and verification
- File upload and storage management

### State Management
- React Context API for global state
- Custom hooks for reusable logic
- Async state handling
- Persistent storage (AsyncStorage)
- Form state management
- Real-time data synchronization

### Database & ORM
- PostgreSQL database design
- Prisma ORM with migrations
- Complex queries with joins and relations
- Database seeding and fixtures
- Transaction handling
- Index optimization

### Security
- JWT token-based authentication
- OTP implementation with rate limiting
- HMAC signature verification
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CORS configuration
- Role-based access control

### Third-Party Integrations
- Paystack payment processing
- Mapbox maps and geocoding
- Expo push notifications
- Email services (Nodemailer)
- Cloud storage (Cloudinary preparation)
- Social authentication readiness

### DevOps & Deployment
- Git version control
- Environment configuration management
- Cloud deployment (Render)
- CI/CD with EAS
- Database migrations
- Application monitoring and logging
- Error tracking and debugging

### Software Engineering Practices
- Component-based architecture
- Separation of concerns
- DRY (Don't Repeat Yourself) principles
- Error handling strategies
- Code documentation
- Testing approach (manual UAT)
- Iterative development based on feedback

---

## DEVELOPMENT METRICS

- **Total Screens:** 50+ unique screens
- **Code Files:** 100+ files across frontend and backend
- **API Endpoints:** 40+ RESTful routes
- **Database Tables:** 10 core models with relationships
- **Development Time:** [X] months
- **Lines of Code:** ~15,000+ (estimated)
- **Third-Party Services:** 5 integrations
- **User Roles:** 3 distinct role types
- **Payment Methods:** Paystack (card, bank transfer, USSD)

---

## PROJECT OUTCOMES & LEARNINGS

### Key Achievements
✅ Successfully built full-stack mobile application from scratch
✅ Implemented secure payment processing with real payment gateway
✅ Created intuitive dual-role user experience
✅ Deployed working MVP to cloud infrastructure
✅ Configured automated deployment pipeline
✅ Integrated multiple third-party services
✅ Designed scalable database schema
✅ Implemented comprehensive admin dashboard

### Technical Growth
- Mastered React Native ecosystem and Expo workflow
- Gained deep understanding of payment gateway integration
- Learned PostgreSQL database design and Prisma ORM
- Developed expertise in JWT authentication systems
- Understood webhook security and verification
- Practiced cloud deployment and DevOps fundamentals
- Improved debugging and problem-solving skills

### Challenges Overcome
- Navigated complex navigation patterns in React Navigation
- Solved cross-platform compatibility issues
- Managed state across multiple navigation contexts
- Implemented secure webhook verification
- Handled asynchronous operations and race conditions
- Debugged production issues with cloud-deployed backend

---

## FUTURE ENHANCEMENTS

### Planned Features
1. **Real-time Chat:** In-app messaging between guests and hosts
2. **Advanced Search:** Filters for more amenities, instant booking, flexible dates
3. **Favorite Properties:** Save and organize preferred listings
4. **Social Features:** Share properties, invite friends, referral program
5. **Multi-currency Support:** Dynamic pricing in local currencies
6. **Calendar Integration:** Sync bookings with Google/Apple Calendar
7. **Analytics Dashboard:** Advanced metrics and revenue forecasting
8. **Automated Pricing:** Dynamic pricing based on demand
9. **Property Verification:** Badge system for verified properties
10. **Mobile Wallet:** In-app balance for faster transactions

### Technical Improvements
- Implement automated testing (Jest, React Native Testing Library)
- Add error monitoring (Sentry integration)
- Optimize database queries with caching (Redis)
- Implement GraphQL for efficient data fetching
- Add offline mode support
- Migrate to cloud file storage (completed setup)
- Implement background job queue for notifications
- Add API rate limiting per user
- Implement data backup strategy

---

## EVIDENCE & DEMONSTRATION

### Screenshots Portfolio
**See attached screenshots demonstrating:**

1. **Authentication Flow** (3 images)
   - Login screen with email input
   - OTP verification screen with timer
   - Welcome screen after successful login

2. **Guest Features** (5 images)
   - Home screen with property recommendations
   - Property search with filters
   - Property details with image gallery
   - Booking confirmation screen
   - Payment integration screen

3. **Host Dashboard** (4 images)
   - Host overview with earnings
   - Property management screen
   - Booking requests interface
   - Statistics with circular charts

4. **Admin Panel** (3 images)
   - Admin dashboard with metrics
   - User management table
   - KYC verification queue

5. **Additional Features** (5 images)
   - Profile management screen
   - Notification center
   - Property creation wizard
   - Calendar view with bookings
   - Review submission form

### Repository Information
- **GitHub:** [Link to repository if public]
- **Documentation:** Complete README with setup instructions
- **API Documentation:** Endpoint documentation in Postman collection

### Live Demo
- **Android APK:** Available for download and testing
- **Demo Video:** [YouTube link showcasing key features]
- **Backend API:** Deployed at averulo-backend.onrender.com

---

## CONTACT & MORE INFORMATION

**Developer:** Omoyele Omotanwa
**Email:** [Your Email]
**LinkedIn:** [Your LinkedIn]
**Portfolio:** [Your Portfolio Website]
**GitHub:** [Your GitHub Profile]

---

## TECHNICAL NOTES

### Development Setup
```bash
# Frontend
npm install
npx expo start

# Backend
cd averulo-backend
npm install
npx prisma migrate dev
npm run dev
```

### Deployment Commands
```bash
# Build Android APK
eas build --platform android --profile preview

# Build iOS (requires Apple Developer account)
eas build --platform ios --profile production

# Publish OTA update
eas update --branch preview --message "Update message"
```

### Environment Variables Required
**Frontend:** API_BASE_URL
**Backend:** DATABASE_URL, JWT_SECRET, PAYSTACK_SECRET_KEY, SMTP credentials

---

**Project Status:** Active Development
**Last Updated:** December 2025
**License:** Proprietary (Portfolio Project)
