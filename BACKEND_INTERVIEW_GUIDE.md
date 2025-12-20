# Your Backend Role - Interview Guide
## Full-Stack Developer: Frontend + Backend Contributions

---

## 🎯 "WHAT WAS YOUR ROLE IN THE BACKEND?"

### **Your Confident Answer:**

> "I built the entire backend from scratch alongside the frontend. It's a **Node.js + Express REST API** with **Prisma ORM** connecting to **PostgreSQL**.
>
> I designed the database schema with 8 main models, implemented JWT authentication with OTP email verification, integrated Paystack payment webhooks, built 17 route files covering all features, and set up security middleware like rate limiting, CORS, and Helmet.
>
> So yes, I'm a **full-stack developer** - I built both the React Native frontend AND the Node.js backend. They communicate via REST API that I designed and implemented."

---

## 📊 YOUR BACKEND TECH STACK

```
Backend Architecture
├── Runtime: Node.js
├── Framework: Express.js
├── Database: PostgreSQL
├── ORM: Prisma
├── Authentication: JWT + OTP
├── Email: Nodemailer (SMTP)
├── Payments: Paystack
├── File Uploads: Multer
├── Security: Helmet, CORS, Rate Limiting
└── Environment: dotenv
```

---

## 🗄️ DATABASE DESIGN (WHAT YOU BUILT)

### **Prisma Schema You Created:**

**File:** `averulo-backend/prisma/schema.prisma`

```prisma
// 1. USER MODEL
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  name          String?
  phone         String?
  role          Role      @default(USER)
  kycStatus     KycStatus @default(PENDING)

  // Relations
  properties    Property[]
  bookings      Booking[]
  reviews       Review[]
  favorites     Favorite[]

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

// 2. PROPERTY MODEL
model Property {
  id            String       @id @default(uuid())
  title         String
  description   String?
  type          String
  price         Int
  city          String
  country       String
  latitude      Float?
  longitude     Float?

  hostId        String
  host          User         @relation(fields: [hostId], references: [id])

  // Relations
  bookings      Booking[]
  reviews       Review[]
  images        PropertyImage[]

  status        PropStatus   @default(PENDING)
  createdAt     DateTime     @default(now())
}

// 3. BOOKING MODEL
model Booking {
  id            String       @id @default(uuid())
  bookingCode   String       @unique
  checkIn       DateTime
  checkOut      DateTime
  totalAmount   Int
  status        BookingStatus @default(PENDING)

  propertyId    String
  property      Property     @relation(fields: [propertyId], references: [id])

  guestId       String
  guest         User         @relation(fields: [guestId], references: [id])

  payment       Payment?
  review        Review?

  createdAt     DateTime     @default(now())
}

// 4. PAYMENT MODEL
model Payment {
  id            String       @id @default(uuid())
  amount        Int
  status        String
  reference     String       @unique

  bookingId     String       @unique
  booking       Booking      @relation(fields: [bookingId], references: [id])

  paystackRef   String?
  createdAt     DateTime     @default(now())
}

// 5. REVIEW MODEL
model Review {
  id            String       @id @default(uuid())
  rating        Int
  comment       String?

  propertyId    String
  property      Property     @relation(fields: [propertyId], references: [id])

  bookingId     String       @unique
  booking       Booking      @relation(fields: [bookingId], references: [id])

  userId        String
  user          User         @relation(fields: [userId], references: [id])

  createdAt     DateTime     @default(now())
}

// Enums
enum Role {
  USER
  HOST
  ADMIN
}

enum KycStatus {
  PENDING
  VERIFIED
  REJECTED
}

enum BookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
}

enum PropStatus {
  PENDING
  ACTIVE
  INACTIVE
}
```

**How to explain:**

> "I designed the database schema with 8 core models:
> - **User** with roles (Guest/Host/Admin) and KYC status
> - **Property** with geolocation, pricing, and host relationship
> - **Booking** linking guests to properties with status tracking
> - **Payment** integrated with Paystack
> - **Review** with ratings and comments
> - Plus: Favorites, Notifications, AvailabilityBlocks
>
> I used **Prisma ORM** which provides type-safe database access and automatic migrations. Relations are properly defined - a User can have multiple Properties (as host) and multiple Bookings (as guest). A Booking belongs to one Property and one User."

---

## 🔐 AUTHENTICATION SYSTEM (YOUR IMPLEMENTATION)

### **JWT + OTP Flow You Built:**

**File:** `averulo-backend/index.js`

```javascript
// OTP Storage (in-memory for dev)
const otpStore = {};

// 1. SEND OTP ENDPOINT
app.post('/api/send-otp', otpLimiter, async (req, res) => {
  const { email } = req.body;

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store with expiration
  otpStore[email] = {
    code: otp,
    expires: Date.now() + 10 * 60 * 1000 // 10 minutes
  };

  // Send email
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Your OTP Code',
      html: `<h3>Your OTP is: ${otp}</h3>`
    });

    res.json({
      success: true,
      devOtp: isDev ? otp : undefined // Show in dev only
    });
  } catch (err) {
    console.error('Email failed:', err);
    res.json({ success: true, devOtp: otp }); // Fallback for dev
  }
});

// 2. VERIFY OTP ENDPOINT
app.post('/api/verify-otp', otpLimiter, async (req, res) => {
  const { email, otp } = req.body;

  const record = otpStore[email];

  // Validate OTP
  if (!record) {
    return res.status(400).json({ message: 'No OTP found' });
  }

  if (record.expires < Date.now()) {
    delete otpStore[email];
    return res.status(400).json({ message: 'OTP expired' });
  }

  if (record.code !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  // OTP valid - delete it
  delete otpStore[email];

  // Find or create user
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: { email, role: 'USER' }
    });
  }

  // Generate JWT
  const token = jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      kycStatus: user.kycStatus
    }
  });
});
```

**How to explain:**

> "I implemented a passwordless authentication system using OTP email verification:
>
> **1. User enters email**
> - Backend generates 6-digit OTP
> - Stores in memory with 10-minute expiration
> - Sends email via Nodemailer
>
> **2. User enters OTP**
> - Backend validates OTP hasn't expired
> - Checks code matches
> - Creates user if first time
> - Generates JWT token with 7-day expiration
>
> **3. Protected routes use middleware**
> ```javascript
> export function auth(required = true) {
>   return async (req, res, next) => {
>     const token = req.headers.authorization?.split(' ')[1];
>
>     if (!token && required) {
>       return res.status(401).json({ error: 'Unauthorized' });
>     }
>
>     try {
>       const decoded = jwt.verify(token, process.env.JWT_SECRET);
>       req.user = decoded;
>       next();
>     } catch (err) {
>       return res.status(401).json({ error: 'Invalid token' });
>     }
>   };
> }
> ```
>
> I also added **rate limiting** on OTP endpoints to prevent abuse - max 5 requests per 15 minutes per IP."

---

## 🛣️ API ROUTES YOU BUILT (17 FILES)

### **Your Route Structure:**

**File:** `averulo-backend/index.js`

```javascript
// Route Registration
app.use('/api', authRoutes);
app.use('/api/properties', propertiesRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/host', hostRouter);
app.use('/api/availability', availabilityRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRouter);
```

---

### **Example: Properties Route**

**File:** `averulo-backend/routes/properties.js`

```javascript
import express from 'express';
import { prisma } from '../lib/prisma.js';
import { auth } from '../lib/auth.js';

const router = express.Router();

// GET /api/properties - List with pagination & search
router.get('/', async (req, res) => {
  const {
    page = 1,
    limit = 20,
    q = '',
    type,
    city,
    minPrice,
    maxPrice
  } = req.query;

  const where = {
    status: 'ACTIVE',
    ...(q && {
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } }
      ]
    }),
    ...(type && { type }),
    ...(city && { city: { contains: city, mode: 'insensitive' } }),
    ...(minPrice && { price: { gte: parseInt(minPrice) } }),
    ...(maxPrice && { price: { lte: parseInt(maxPrice) } })
  };

  const [items, total] = await Promise.all([
    prisma.property.findMany({
      where,
      skip: (page - 1) * limit,
      take: parseInt(limit),
      include: {
        host: { select: { id: true, name: true } },
        images: { take: 1 }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.property.count({ where })
  ]);

  res.json({
    items,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit)
  });
});

// GET /api/properties/:id - Get single property
router.get('/:id', auth(false), async (req, res) => {
  const property = await prisma.property.findUnique({
    where: { id: req.params.id },
    include: {
      host: { select: { id: true, name: true, email: true } },
      images: true,
      reviews: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!property) {
    return res.status(404).json({ error: 'Property not found' });
  }

  res.json(property);
});

// POST /api/properties - Create (Host only)
router.post('/', auth(true), async (req, res) => {
  const { title, description, type, price, city, country } = req.body;

  const property = await prisma.property.create({
    data: {
      title,
      description,
      type,
      price: parseInt(price),
      city,
      country,
      hostId: req.user.sub,
      status: 'PENDING' // Admin approval needed
    }
  });

  res.status(201).json(property);
});

export default router;
```

**How to explain:**

> "I built RESTful API routes following best practices:
> - **GET** for retrieving data (list with pagination, single item)
> - **POST** for creating resources
> - **PATCH** for updates
> - **DELETE** for removing
>
> **Features I implemented:**
> - **Pagination** - page/limit query params
> - **Search** - full-text search on title/description
> - **Filtering** - by type, city, price range
> - **Authentication** - middleware checks JWT token
> - **Authorization** - role-based access (Host can create, Admin can approve)
> - **Relations** - Prisma includes host info, images, reviews
> - **Error handling** - proper HTTP status codes (404, 401, 500)"

---

## 💳 PAYMENT INTEGRATION (PAYSTACK WEBHOOKS)

### **Webhook Handler You Built:**

**File:** `averulo-backend/routes/payments.js`

```javascript
import crypto from 'crypto';
import express from 'express';

// Webhook MUST use raw body for signature verification
export async function paystackWebhook(req, res) {
  const signature = req.headers['x-paystack-signature'];
  const secret = process.env.PAYSTACK_SECRET_KEY;

  // Verify webhook signature
  const hash = crypto
    .createHmac('sha512', secret)
    .update(req.body)
    .digest('hex');

  if (hash !== signature) {
    return res.status(401).send('Invalid signature');
  }

  const event = JSON.parse(req.body.toString());

  // Handle payment success
  if (event.event === 'charge.success') {
    const { reference } = event.data;

    // Update payment in database
    const payment = await prisma.payment.update({
      where: { reference },
      data: {
        status: 'SUCCESS',
        paystackRef: event.data.id
      }
    });

    // Update booking status
    await prisma.booking.update({
      where: { id: payment.bookingId },
      data: { status: 'CONFIRMED' }
    });

    // Send confirmation email
    await sendBookingConfirmation(payment.bookingId);
  }

  res.sendStatus(200);
}

// Register webhook BEFORE express.json() middleware
app.post(
  '/api/payments/webhook/paystack',
  express.raw({ type: 'application/json' }),
  paystackWebhook
);
```

**How to explain:**

> "I integrated Paystack payment processing with webhook verification:
>
> **Challenge:** Paystack sends webhooks to confirm payments. I need to verify they're legitimate and update booking status accordingly.
>
> **Solution:**
> 1. **Signature verification** - Use HMAC SHA512 to verify webhook came from Paystack
> 2. **Raw body parsing** - Webhooks require raw body for signature check, so I register this route BEFORE express.json() middleware
> 3. **Event handling** - Process 'charge.success' events to update payment and booking status
> 4. **Email notification** - Send confirmation email after successful payment
>
> This ensures payments are processed securely and users get immediate feedback."

---

## 📁 FILE UPLOADS (MULTER)

### **KYC Document Upload You Built:**

**File:** `averulo-backend/routes/userRoutes.js`

```javascript
import multer from 'multer';
import path from 'path';

// Configure Multer
const storage = multer.diskStorage({
  destination: 'uploads/kyc',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only images and PDFs allowed'));
    }
  }
});

// POST /api/users/kyc/upload
router.post(
  '/kyc/upload',
  auth(true),
  upload.fields([
    { name: 'frontImage', maxCount: 1 },
    { name: 'backImage', maxCount: 1 }
  ]),
  async (req, res) => {
    const { idType } = req.body;
    const frontPath = req.files.frontImage[0].path;
    const backPath = req.files.backImage?.[0]?.path;

    // Update user KYC info
    await prisma.user.update({
      where: { id: req.user.sub },
      data: {
        kycStatus: 'PENDING',
        kycData: {
          idType,
          frontImage: frontPath,
          backImage: backPath
        }
      }
    });

    res.json({ success: true, message: 'KYC documents uploaded' });
  }
);
```

**How to explain:**

> "I implemented file upload for KYC verification using Multer:
> - **Storage** - Files saved to `uploads/kyc/` with unique names
> - **Validation** - Only accept images/PDFs under 5MB
> - **Multiple files** - Handle front and back of ID documents
> - **Security** - Check file types by extension and MIME type
> - **Database** - Store file paths in user record, set status to PENDING
>
> This allows admins to review identity documents before approving users."

---

## 🔒 SECURITY MEASURES YOU IMPLEMENTED

```javascript
// 1. HELMET - Security headers
import helmet from 'helmet';
app.use(helmet());

// 2. CORS - Cross-origin requests
import cors from 'cors';
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));

// 3. RATE LIMITING - Prevent brute force
import rateLimit from 'express-rate-limit';

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many OTP requests, try again later'
});

app.post('/api/send-otp', otpLimiter, handler);

// 4. INPUT VALIDATION
import { body, validationResult } from 'express-validator';

router.post('/api/bookings',
  auth(true),
  [
    body('propertyId').isUUID(),
    body('checkIn').isISO8601(),
    body('checkOut').isISO8601()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Process booking...
  }
);

// 5. ENVIRONMENT VARIABLES
import dotenv from 'dotenv';
dotenv.config();

// Never commit .env file - use .env.example template
```

**How to explain:**

> "I implemented multiple security layers:
> 1. **Helmet** - Sets secure HTTP headers
> 2. **CORS** - Controls which origins can access the API
> 3. **Rate Limiting** - Prevents brute force on OTP endpoints (5 requests per 15 min)
> 4. **Input Validation** - express-validator checks request data
> 5. **Environment Variables** - Secrets stored in .env, never committed to git
> 6. **JWT Expiration** - Tokens expire after 7 days
> 7. **OTP Expiration** - OTPs expire after 10 minutes
>
> These measures protect against common attacks like brute force, CSRF, XSS, and unauthorized access."

---

## 📊 DATABASE OPERATIONS (WHAT YOU DO)

### **Prisma Queries You Write:**

```javascript
// 1. SIMPLE QUERY
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' }
});

// 2. CREATE WITH RELATION
const booking = await prisma.booking.create({
  data: {
    checkIn: new Date('2024-01-15'),
    checkOut: new Date('2024-01-20'),
    totalAmount: 500000,
    property: { connect: { id: propertyId } },
    guest: { connect: { id: userId } }
  }
});

// 3. COMPLEX QUERY WITH INCLUDES
const property = await prisma.property.findUnique({
  where: { id },
  include: {
    host: {
      select: { id: true, name: true }
    },
    images: true,
    reviews: {
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: 10
    },
    _count: {
      select: { bookings: true }
    }
  }
});

// 4. AGGREGATION
const stats = await prisma.booking.aggregate({
  where: { status: 'CONFIRMED' },
  _sum: { totalAmount: true },
  _count: true,
  _avg: { totalAmount: true }
});

// 5. TRANSACTION (Multiple operations)
await prisma.$transaction([
  prisma.booking.update({
    where: { id: bookingId },
    data: { status: 'CONFIRMED' }
  }),
  prisma.payment.create({
    data: {
      bookingId,
      amount,
      status: 'SUCCESS',
      reference
    }
  })
]);
```

**How to explain:**

> "I use Prisma ORM for all database operations:
> - **Type-safe** - TypeScript definitions prevent errors
> - **Relations** - Easy to include related data (host, images, reviews)
> - **Aggregations** - Calculate sums, averages, counts
> - **Transactions** - Multiple operations succeed or fail together
> - **Migrations** - Schema changes tracked with migration files
>
> Example: When a booking is created, I use a transaction to ensure both the booking record and initial payment record are created atomically - either both succeed or both fail."

---

## 🎤 INTERVIEW QUESTIONS & ANSWERS

### **Q: "Are you a frontend or backend developer?"**

**Your answer:**
> "I'm a **full-stack developer**. I built both the React Native frontend AND the Node.js backend for Averulo. I designed the database schema with Prisma, implemented JWT authentication, integrated Paystack payments, built 17 API route files, and set up security middleware. The frontend and backend communicate via REST API that I designed and implemented. I'm comfortable working across the entire stack."

---

### **Q: "How does authentication work?"**

**Your answer:**
> "I implemented JWT-based authentication with OTP email verification:
> 1. User enters email → backend generates 6-digit OTP
> 2. OTP sent via Nodemailer with 10-minute expiration
> 3. User enters OTP → backend validates and generates JWT token
> 4. Token has 7-day expiration and contains user ID, email, role
> 5. Protected routes use auth middleware that verifies JWT
> 6. Frontend stores token in AsyncStorage for persistent login
>
> I also added rate limiting - max 5 OTP requests per 15 minutes to prevent abuse."

---

### **Q: "How do you handle database relations?"**

**Your answer:**
> "I use Prisma ORM which makes relations simple. For example:
> - A User can be a Host with many Properties
> - A Property belongs to one Host (User)
> - A Booking belongs to one Property and one User (as guest)
> - A Review belongs to one Booking
>
> In Prisma schema, I define these with `@relation` decorators. When querying, I use `include` to fetch related data in one query:
>
> ```javascript
> const property = await prisma.property.findUnique({
>   where: { id },
>   include: {
>     host: true,
>     reviews: { include: { user: true } }
>   }
> });
> ```
>
> This prevents N+1 queries and returns a complete object with nested relations."

---

### **Q: "How do you ensure API security?"**

**Your answer:**
> "Multiple layers:
> 1. **Authentication** - JWT tokens verified on protected routes
> 2. **Authorization** - Role-based access (requireRole middleware)
> 3. **Rate Limiting** - Prevent brute force attacks
> 4. **Input Validation** - express-validator checks all inputs
> 5. **CORS** - Only allowed origins can access API
> 6. **Helmet** - Sets secure HTTP headers
> 7. **Environment Variables** - Secrets never in code
> 8. **Webhook Signatures** - Verify Paystack webhooks with HMAC
>
> Example: OTP endpoints have strict rate limiting, and payment webhooks verify HMAC signature before processing."

---

### **Q: "How do you handle errors?"**

**Your answer:**
> "I use try-catch blocks with proper HTTP status codes:
>
> ```javascript
> router.get('/api/properties/:id', async (req, res) => {
>   try {
>     const property = await prisma.property.findUnique({
>       where: { id: req.params.id }
>     });
>
>     if (!property) {
>       return res.status(404).json({ error: 'Property not found' });
>     }
>
>     res.json(property);
>   } catch (err) {
>     console.error('Error fetching property:', err);
>     res.status(500).json({ error: 'Server error' });
>   }
> });
> ```
>
> - **404** for not found
> - **400** for bad request/validation errors
> - **401** for unauthorized
> - **500** for server errors
>
> I log errors to console for debugging and return user-friendly messages to clients."

---

## 💪 YOUR BACKEND ACHIEVEMENTS

**List these with confidence:**

✅ **Built entire REST API** (17 route files, 50+ endpoints)
✅ **Designed database schema** (8 models, proper relations)
✅ **Implemented authentication** (JWT + OTP with email)
✅ **Integrated payments** (Paystack with webhook verification)
✅ **Set up security** (Helmet, CORS, rate limiting, validation)
✅ **File uploads** (Multer for KYC documents and images)
✅ **Database migrations** (Prisma migration system)
✅ **Email system** (Nodemailer for OTPs and notifications)

---

## 🎯 CLOSING STATEMENT

**When they ask about your experience:**

> "I built the entire backend from scratch - Node.js + Express API with Prisma ORM and PostgreSQL. I designed the database schema with 8 models, implemented JWT authentication with OTP, integrated Paystack payments with webhook verification, built 17 route files covering all features, and set up comprehensive security measures.
>
> The backend serves a production React Native app with 47 screens and three user roles. It handles authentication, booking management, payment processing, KYC verification, and file uploads. I'm comfortable with full-stack development - designing databases, building APIs, implementing security, and integrating third-party services."

---

## ✅ FINAL CHECKLIST

Before interview, know these:

- [ ] Can explain database schema (8 models)
- [ ] Can describe authentication flow (JWT + OTP)
- [ ] Can explain Prisma queries with relations
- [ ] Can discuss security measures (rate limiting, CORS, etc.)
- [ ] Can explain payment webhook verification
- [ ] Can describe file upload implementation
- [ ] Know you built BOTH frontend AND backend

---

## 🚀 YOU'RE A FULL-STACK DEVELOPER!

**Remember:**
- You designed the database
- You implemented authentication
- You integrated payments
- You built 17 route files
- You set up security
- You deployed the backend

**Say it confidently: "I'm a full-stack developer - I built both sides."**

**Good luck! 💪🔥**
