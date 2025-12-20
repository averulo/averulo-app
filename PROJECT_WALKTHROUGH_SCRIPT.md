# Project Walkthrough Script - Interview Ready
## How to Explain Your Averulo App with Confidence

---

## 🎯 "WALK ME THROUGH YOUR PROJECT"

### **Your Opening (30 seconds):**

> "I built **Averulo**, a full-stack property rental platform similar to Airbnb. It's a React Native mobile app with 47 screens, supporting three user roles: **Guests** who book properties, **Hosts** who list properties, and **Admins** who manage the platform.
>
> The frontend is React Native with Expo, using **Context API** for state management and **React Navigation** for routing. The backend is Node.js with Express and Prisma ORM connecting to PostgreSQL. I integrated **Paystack** for payments and implemented a complete **KYC verification** system.
>
> Key features include a 12-step property creation wizard for hosts, real-time search and filtering for guests, booking management, payment processing, and an admin dashboard with analytics."

**Then pause and let them ask follow-up questions.**

---

## 📱 "TELL ME ABOUT THE FEATURES"

### **Your Answer (1 minute):**

**Guest Features:**
- "Guests can browse properties with real-time search and location-based filtering"
- "They can view detailed property information including photos, amenities, pricing, and reviews"
- "Booking flow includes date selection, payment processing via Paystack, and booking confirmation"
- "After checkout, guests can leave reviews and ratings"

**Host Features:**
- "Hosts go through a 12-step property creation wizard"
- "They upload multiple photo categories: exterior, amenities, dining areas, special features"
- "They can reorder photos with a tap-to-swap interface I built"
- "Set room types, pricing, and write detailed property descriptions"
- "View their earnings and booking analytics"

**Admin Features:**
- "Dashboard shows total users, properties, bookings, and revenue"
- "KYC verification workflow to approve user identity documents"
- "Manage all bookings, payments, and properties"
- "Analytics and reporting features"

---

## 🎨 "EXPLAIN YOUR ARCHITECTURE"

### **Your Answer:**

**Frontend Architecture:**
```
React Native + Expo
├── 47 Screens (Stack + Tab Navigation)
├── State Management: Context API
│   ├── AuthContext (user, token, signIn/signOut)
│   ├── NotificationsContext
│   └── Custom Hooks (useAuth, useNotifications)
├── API Integration: Axios + REST API
├── Storage: AsyncStorage (persistent login)
└── UI: Custom components + Expo libraries
```

**Backend Architecture:**
```
Node.js + Express
├── REST API (17 route files)
├── Database: PostgreSQL via Prisma ORM
├── Authentication: JWT with OTP email verification
├── File Uploads: Multer (images, PDFs)
├── Payments: Paystack integration with webhooks
└── Security: Helmet, CORS, rate limiting
```

**Your talking points:**
- "I separated frontend and backend concerns cleanly"
- "Frontend talks to backend via REST API"
- "Context API manages global state like authentication"
- "Prisma ORM handles database operations with type safety"

---

## 🔧 "HOW DID YOU USE useEffect?"

### **EXAMPLE 1: Fetching Data on Mount**

**Show them this mental picture:**

**File:** `ExploreHomeScreen.js`

```javascript
const [properties, setProperties] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchProperties();
}, []); // Empty array = run once on mount

async function fetchProperties() {
  try {
    setLoading(true);
    const res = await fetch(`${API_BASE}/api/properties`);
    const data = await res.json();
    setProperties(data.items || []);
  } catch (err) {
    console.log('Error loading properties:', err);
  } finally {
    setLoading(false);
  }
}
```

**Explain it:**
> "In my ExploreHomeScreen, I use useEffect to fetch properties when the component mounts. The empty dependency array means it runs only once - like componentDidMount in class components. I set loading to true before the fetch, then false in finally block regardless of success or failure. This gives users immediate visual feedback."

---

### **EXAMPLE 2: Cleanup Function (Your Best Example!)**

**File:** `OtpScreen.js`

```javascript
const [timer, setTimer] = useState(120); // 2-minute countdown

useEffect(() => {
  const interval = setInterval(() => {
    setTimer((prev) => (prev > 0 ? prev - 1 : 0));
  }, 1000);

  // CLEANUP FUNCTION - prevents memory leak!
  return () => clearInterval(interval);
}, []); // Empty array = setup once, cleanup on unmount
```

**Explain it:**
> "In my OTP verification screen, I have a 2-minute countdown timer. I use setInterval in useEffect and return a cleanup function that clears the interval. This is crucial - without cleanup, the timer would keep running after the component unmounts, causing a memory leak. The return function runs automatically when the component unmounts."

**Why this is your BEST example:**
- Shows you understand cleanup
- Real production code solving a real problem
- Demonstrates memory leak prevention
- They LOVE hearing about cleanup functions!

---

### **EXAMPLE 3: Dependencies Array**

**File:** `OtpScreen.js`

```javascript
const [code, setCode] = useState(['', '', '', '', '', '']);

// Auto-fill dev OTP in development
useEffect(() => {
  if (devOtp && __DEV__) {
    const arr = devOtp.split('').slice(0, 6);
    setCode(arr);
    console.log('🧩 Auto-filled dev OTP:', arr.join(''));
  }
}, [devOtp]); // Re-run when devOtp changes
```

**Explain it:**
> "I have another useEffect that auto-fills the OTP in development mode. It includes 'devOtp' in the dependency array, so it re-runs whenever devOtp changes. This is important - if I left the array empty, it would only run on mount and miss updates. If I forgot the array entirely, it would run on every render, causing infinite loops."

---

### **EXAMPLE 4: Conditional Effects**

**File:** `PropertiesListScreen.js`

```javascript
const [search, setSearch] = useState('');
const [properties, setProperties] = useState([]);

useEffect(() => {
  loadProperties();
}, [search]); // Re-fetch when search changes

async function loadProperties() {
  const url = `${API_BASE}/api/properties?q=${search}`;
  const res = await fetch(url);
  const data = await res.json();
  setProperties(data.items);
}
```

**Explain it:**
> "In my property search screen, useEffect runs whenever the search query changes. When the user types, it triggers a new API call to fetch filtered results. The search dependency tells React 'run this effect again when search changes.' This gives real-time search functionality."

---

## 🔐 "EXPLAIN YOUR STATE MANAGEMENT"

### **Context API Pattern:**

**File:** `hooks/useAuth.js`

```javascript
// 1. Create Context
const AuthContext = createContext(null);

// 2. Create Provider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, check for saved token
  useEffect(() => {
    loadStoredAuth();
  }, []);

  async function loadStoredAuth() {
    const savedToken = await AsyncStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      await fetchUserData(savedToken);
    }
    setLoading(false);
  }

  const signIn = async (newToken) => {
    await AsyncStorage.setItem('token', newToken);
    setToken(newToken);
    await fetchUserData(newToken);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Create Custom Hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

**How to explain it:**

> "I use Context API for global authentication state. Here's how it works:
>
> **1. AuthProvider wraps the entire app in App.js**
> - Manages user, token, and loading state
> - Persists token to AsyncStorage for persistent login
> - Provides signIn and signOut functions
>
> **2. Any component can access auth with useAuth() hook**
> - No prop drilling through 10+ components
> - Clean, simple: `const { user, signIn, signOut } = useAuth()`
>
> **3. I use useEffect in the provider to restore auth on app launch**
> - Checks AsyncStorage for saved token
> - If found, fetches user data automatically
>
> This pattern is used across all 47 screens. For example, in my LoginScreen, after OTP verification, I call `signIn(token)` which updates global state and all components react automatically."

---

## 📝 "WALK ME THROUGH A COMPLEX FEATURE"

### **Choose: 12-Step Property Creation**

**Your explanation:**

> "Let me walk you through the host property creation flow - it's my most complex feature.
>
> **The Challenge:**
> Hosts need to provide extensive property information: basic details, location, amenities, multiple photo categories, room types with individual pricing, and unique selling points. That's a lot of data to collect without overwhelming users.
>
> **My Solution:**
> I built a 12-step wizard with one focused task per step.
>
> **Technical Implementation:**
>
> **1. State Management:**
> ```javascript
> const [step, setStep] = useState(1);
> const [propertyName, setPropertyName] = useState('');
> const [propertyType, setPropertyType] = useState('');
> const [location, setLocation] = useState('');
> const [amenities, setAmenities] = useState([]);
> const [exteriorPhotos, setExteriorPhotos] = useState([]);
> // ... 20+ state variables
> ```
>
> **2. Progress Tracking:**
> ```javascript
> const progress = (step / 12) * 100;
> ```
> Visual progress bar shows users how far they've come.
>
> **3. Step Navigation:**
> ```javascript
> const handleNext = () => {
>   if (validateCurrentStep()) {
>     setStep(step + 1);
>   }
> };
>
> const handleBack = () => {
>   setStep(step - 1);
> };
> ```
>
> **4. Photo Upload (Step 8):**
> Uses expo-image-picker:
> ```javascript
> const pickImage = async () => {
>   const result = await ImagePicker.launchImageLibraryAsync({
>     mediaTypes: ImagePicker.MediaTypeOptions.Images,
>     allowsMultipleSelection: true,
>     quality: 0.8,
>   });
>
>   if (!result.canceled) {
>     setExteriorPhotos([...exteriorPhotos, ...result.assets]);
>   }
> };
> ```
>
> **5. Photo Reordering (Step 11):**
> Built a tap-to-swap interface:
> - User taps first photo (stores index)
> - Taps second photo (swaps positions)
> - Visual feedback with blue border
>
> ```javascript
> const handlePhotoPress = (index) => {
>   if (selectedPhoto === null) {
>     setSelectedPhoto(index);
>   } else {
>     // Swap logic
>     const newList = [...photoList];
>     [newList[selectedPhoto], newList[index]] =
>       [newList[index], newList[selectedPhoto]];
>     setPhotoList(newList);
>     setSelectedPhoto(null);
>   }
> };
> ```
>
> **6. Data Passing:**
> At the end, all data is passed to confirmation screen via route params:
> ```javascript
> navigation.navigate('ConfirmPropertyScreen', {
>   propertyName,
>   propertyType,
>   location,
>   amenities,
>   photos: {
>     exterior: exteriorPhotos,
>     amenities: amenityPhotos,
>     // ... more categories
>   },
>   rooms: roomCounts,
>   pricing: roomPrices,
>   // ... all 20+ data fields
> });
> ```
>
> **The Result:**
> - User-friendly: One task per screen
> - Visual progress tracking
> - Data validation at each step
> - Smooth navigation with back button support
> - Complete property profile in 12 easy steps"

---

## 🚀 "EXPLAIN YOUR API INTEGRATION"

**Your explanation:**

> "I centralized all API calls in `lib/api.js` for consistency and reusability.
>
> **Configuration:**
> ```javascript
> import Constants from 'expo-constants';
> export const API_BASE = Constants.expoConfig.extra.apiUrl;
> ```
> This pulls the API URL from app.json, making it easy to switch between dev/prod environments.
>
> **Example API Function:**
> ```javascript
> export async function getProperty(id, token) {
>   const res = await fetch(`${API_BASE}/api/properties/${id}`, {
>     headers: token ? { Authorization: `Bearer ${token}` } : undefined,
>   });
>
>   if (!res.ok) {
>     throw new Error(`HTTP ${res.status}`);
>   }
>
>   return res.json();
> }
> ```
>
> **Usage in Components:**
> ```javascript
> useEffect(() => {
>   const loadProperty = async () => {
>     try {
>       setLoading(true);
>       const data = await getProperty(propertyId, token);
>       setProperty(data);
>     } catch (err) {
>       console.error('Failed to load property:', err);
>       setError(err.message);
>     } finally {
>       setLoading(false);
>     }
>   };
>
>   loadProperty();
> }, [propertyId]);
> ```
>
> **Key Patterns:**
> - Always wrap in try/catch
> - Show loading state during fetch
> - Handle errors gracefully
> - Update state in finally block
> - Include auth token when needed"

---

## 🔑 "HOW DID YOU HANDLE AUTHENTICATION?"

**Your explanation:**

> "I implemented a JWT-based authentication system with OTP email verification.
>
> **The Flow:**
>
> **1. User enters email (LoginScreen)**
> ```javascript
> const handleLogin = async () => {
>   const res = await axios.post(`${API_BASE}/api/send-otp`, { email });
>
>   if (res.data.success) {
>     // Navigate to OTP screen
>     navigation.navigate('OtpScreen', {
>       email,
>       devOtp: res.data.devOtp // For development
>     });
>   }
> };
> ```
>
> **2. Backend generates 6-digit OTP and emails it**
>
> **3. User enters OTP (OtpScreen)**
> - I built a custom 6-digit input with auto-focus
> - Each digit is a separate TextInput
> - useRef array manages focus between inputs
>
> ```javascript
> const handleChange = (text, index) => {
>   if (/^\d?$/.test(text)) {
>     const newCode = [...code];
>     newCode[index] = text;
>     setCode(newCode);
>
>     // Auto-focus next input
>     if (text && index < 5) {
>       inputRefs.current[index + 1]?.focus();
>     }
>   }
> };
> ```
>
> **4. Verify OTP and get JWT**
> ```javascript
> const handleVerify = async () => {
>   const otp = code.join('');
>   const res = await axios.post(`${API_BASE}/api/verify-otp`, { email, otp });
>
>   const { token, user } = res.data;
>
>   // Update global auth state
>   await signIn(token);
>
>   // Route based on KYC status
>   if (user.kycStatus === 'VERIFIED') {
>     navigation.navigate('MainTabs');
>   } else {
>     navigation.navigate('UserVerification');
>   }
> };
> ```
>
> **5. Token Persistence**
> - Token stored in AsyncStorage
> - On app launch, AuthProvider checks for saved token
> - Automatically restores session
>
> **Security Features:**
> - JWT tokens with expiration
> - Tokens sent in Authorization header
> - OTP expires after 10 minutes
> - Rate limiting on OTP endpoints"

---

## 💪 "WHAT WAS THE BIGGEST CHALLENGE?"

**Choose one of these:**

### **Option 1: Navigation Complexity**

> "Managing navigation in a 47-screen app with three user roles was challenging. I needed:
> - Stack navigation for linear flows (login → OTP → dashboard)
> - Tab navigation for main sections
> - Nested navigators (tabs inside stack)
> - Role-based screen access
>
> **Solution:**
> I structured it hierarchically:
> ```
> Stack Navigator (Root)
> ├── Auth Screens (Login, OTP, Signup)
> ├── MainTabs (After auth)
> │   ├── Home Tab
> │   ├── Explore Tab
> │   ├── Bookings Tab
> │   └── Profile Tab
> ├── Property Details Stack
> ├── Booking Flow Stack
> └── Host Screens Stack
> ```
>
> I used React Navigation's reset method for auth transitions:
> ```javascript
> navigation.reset({
>   index: 0,
>   routes: [{ name: 'MainTabs' }],
> });
> ```
>
> This clears the navigation history so users can't back-button to login after authenticating."

---

### **Option 2: State Synchronization**

> "Keeping UI in sync with server state was tricky. For example, when a user books a property, I need to:
> 1. Update booking list
> 2. Update property availability
> 3. Reduce room count
> 4. Show confirmation
> 5. Update user's booking history
>
> **Solution:**
> I implemented a refresh pattern:
> ```javascript
> const { refreshUser } = useAuth();
>
> const handleBooking = async () => {
>   const res = await createBooking(propertyId, checkIn, checkOut, token);
>
>   if (res.success) {
>     // Refresh user data to get updated bookings
>     await refreshUser();
>
>     navigation.navigate('BookingSuccess', { booking: res.booking });
>   }
> };
> ```
>
> This ensures the UI always reflects server truth without complex local state management."

---

## ⚡ QUICK RESPONSE TEMPLATES

### **"What's useState?"**
> "useState is a React hook for managing component-level state. In my LoginScreen, I use it for email, password, and loading states. It returns current state and an updater function. When state changes, React re-renders the component."

### **"What's useEffect?"**
> "useEffect handles side effects - operations that interact with the outside world like API calls, timers, or subscriptions. I use it in my screens to fetch data on mount, with proper cleanup to prevent memory leaks. The dependency array controls when it runs."

### **"What's useContext?"**
> "useContext accesses React Context values. I created an AuthContext for global user state. Any component can call useAuth() to get user data, token, and auth functions without prop drilling."

### **"What's useRef?"**
> "useRef creates a mutable reference that persists between renders without causing re-renders. I used it in my OTP screen to manage focus between 6 input fields - storing refs in an array to programmatically focus the next input."

### **"How do you handle forms?"**
> "I use controlled components - React state is the single source of truth. Every input has value from state and onChange updates state. I validate in real-time and disable submit until form is valid. Example: my login form checks email format and password length before enabling the button."

---

## 🎯 YOUR CONFIDENT CLOSING

**When they ask "Any questions for us?"**

Say:
> "Yes, a few:
> 1. What React patterns does your team prefer? I'm comfortable with Context API and custom hooks, curious if you use Redux or other state management.
> 2. How do you handle code reviews? I'm eager to learn from senior developers.
> 3. What's the typical project complexity - is it similar to my 47-screen app, or larger scale?"

---

## ✅ FINAL CHECKLIST

Before interview, mentally run through:

- [ ] Can explain useEffect with cleanup (OTP timer)
- [ ] Can explain Context API (useAuth)
- [ ] Can describe a complex feature (12-step wizard)
- [ ] Can explain API integration pattern
- [ ] Can discuss authentication flow
- [ ] Know your app's scope (47 screens, 3 roles)
- [ ] Can explain useState, useEffect, useContext, useRef
- [ ] Have a challenge story ready

---

## 💪 CONFIDENCE STATEMENT

**Read this before the interview:**

"I built a production-grade 47-screen property rental platform. I implemented complex features like multi-step forms, authentication flows, payment integration, and state management. I understand React hooks deeply because I've used them to solve real problems. I'm ready to explain my code, my decisions, and my learning process. I've got this!"

---

## 🚀 YOU'RE READY!

**Remember:**
- Speak about YOUR actual code
- Use specific examples from Averulo
- Show enthusiasm - you built something real!
- It's okay to say "I'd need to research that, but my approach would be..."

**Go crush that interview! 💪🔥**
