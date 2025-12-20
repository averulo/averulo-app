# React Interview Prep - Your Averulo App Experience
## Quick Reference for 1-Hour Interview Prep

---

## 🎯 YOUR TECH STACK (PROVEN IN PRODUCTION)

**What you built:** 47-screen property rental platform (Airbnb-like)
**Framework:** React Native + Expo
**State Management:** React Context API + Custom Hooks
**Backend Integration:** REST API with axios
**Navigation:** React Navigation v7

---

## 1️⃣ REACT HOOKS YOU'VE MASTERED

### ✅ useState - State Management

**What you know:**
```javascript
const [email, setEmail] = useState('');
const [loading, setLoading] = useState(false);
const [properties, setProperties] = useState([]);
```

**Interview talking points:**
- "I use useState for component-level state management"
- "In my app, I manage form inputs, loading states, and API data with useState"
- **Example from your code:** "In LoginScreen, I manage email, password, and focusedField states"

**Common questions:**
- **Q: When would you use useState vs useReducer?**
  - **A:** "I use useState for simple state like form inputs. For complex state with multiple sub-values or when next state depends on previous state, useReducer is better. In my app, I stuck with useState since each state was independent."

---

### ✅ useEffect - Side Effects & Lifecycle

**What you've done:**
```javascript
// Example 1: Fetch data on mount
useEffect(() => {
  fetchProperties();
}, []);

// Example 2: Cleanup & dependencies
useEffect(() => {
  const timer = setInterval(() => setTime(Date.now()), 1000);
  return () => clearInterval(timer); // Cleanup
}, []);

// Example 3: Run when dependency changes
useEffect(() => {
  if (searchQuery) {
    searchProperties(searchQuery);
  }
}, [searchQuery]);
```

**Interview talking points:**
- "I use useEffect for data fetching, subscriptions, and cleanup"
- "I understand the dependency array - empty [] runs once, [var] runs when var changes"
- **From your code:** "In OtpScreen, I used useEffect for countdown timer with cleanup, and auto-filled dev OTP on mount"

**Common questions:**
- **Q: What's the dependency array?**
  - **A:** "It tells React when to re-run the effect. Empty array = run once on mount. With dependencies, it runs when those values change. No array = runs after every render (rarely needed)."

- **Q: Why do we need cleanup functions?**
  - **A:** "To prevent memory leaks. I used it in my OTP countdown timer - clearInterval on unmount prevents the timer from running after component is destroyed."

---

### ✅ useRef - DOM Access & Persistent Values

**What you've used:**
```javascript
const inputRefs = useRef([]);

// Focus management in OTP screen
inputRefs.current[index + 1]?.focus();
```

**Interview talking points:**
- "useRef persists values between renders without causing re-renders"
- "I used it for managing focus in my 6-digit OTP input"
- **From your code:** "In OtpScreen, I have an array of refs to auto-focus the next input when user types a digit"

**Common questions:**
- **Q: useRef vs useState - when to use which?**
  - **A:** "useState triggers re-render when changed. useRef doesn't. I use useRef for DOM access (like focus) or storing values that shouldn't trigger re-renders (like timers or previous values)."

---

### ✅ useLayoutEffect - DOM Measurements

**What you've used:**
```javascript
useLayoutEffect(() => {
  navigation.setOptions({ headerShown: false });
}, []);
```

**Interview talking points:**
- "Similar to useEffect but fires synchronously after DOM mutations"
- "I used it for navigation config that needs to happen before paint"

---

### ✅ Custom Hooks - Reusable Logic

**What you built:**
```javascript
// hooks/useAuth.js
export function useAuth() {
  return useContext(AuthContext);
}

// Usage in components
const { user, token, signIn, signOut } = useAuth();
```

**Interview talking points:**
- "I created custom hooks to share logic between components"
- **Your custom hooks:**
  - `useAuth()` - Global authentication state
  - `useNotifications()` - Notification management
  - `usePaginatedFetch()` - Reusable pagination
  - `useAdminSummary()` - Admin dashboard data

**Common questions:**
- **Q: Why create custom hooks?**
  - **A:** "DRY principle - don't repeat yourself. My useAuth hook gives any component access to user data, login/logout functions without prop drilling. Used in 20+ screens."

---

## 2️⃣ CONTEXT API - YOUR STATE MANAGEMENT CHOICE

### ✅ What You Built

**File:** `hooks/useAuth.js`

```javascript
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const signIn = async (token) => {
    await AsyncStorage.setItem('token', token);
    setToken(token);
    // Fetch user data...
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
```

**Interview talking points:**
- "I used Context API for global state - authentication across 47 screens"
- "Avoided prop drilling - any component can access auth state with useAuth()"
- "Combined with AsyncStorage for persistent login"

**Common questions:**
- **Q: Context API vs Redux?**
  - **A:** "Context API is built into React, simpler for moderate complexity. Redux adds middleware, dev tools, better performance for large apps. For my 47-screen app with auth + notifications, Context was sufficient. I'd consider Redux if we needed time-travel debugging or complex async logic."

- **Q: Context re-render issues?**
  - **A:** "Yes, all consumers re-render when context value changes. I mitigated this by splitting contexts (AuthContext separate from NotificationsContext) and using memo() for expensive components."

---

## 3️⃣ COMPONENT PATTERNS YOU USE

### ✅ Functional Components (Your Standard)

```javascript
export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    // Login logic
  };

  return (
    <SafeAreaView>
      <TextInput value={email} onChangeText={setEmail} />
      <TouchableOpacity onPress={handleLogin}>
        <Text>Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
```

**Interview talking points:**
- "I use modern functional components with hooks throughout my app"
- "All 47 screens are functional components - cleaner, less boilerplate"

---

### ✅ Props & Children Pattern

```javascript
// Reusable component example
function FilterChip({ label, active, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.activeChip]}
      onPress={onPress}
    >
      <Text>{label}</Text>
    </TouchableOpacity>
  );
}

// Usage
<FilterChip label="All" active={true} onPress={handleFilter} />
```

**Interview talking points:**
- "I create reusable components with props for flexibility"
- **From your code:** "DateRangePicker component used across multiple booking screens"

---

### ✅ Conditional Rendering

```javascript
{loading ? (
  <ActivityIndicator color={PRIMARY} />
) : (
  <FlatList data={properties} renderItem={renderItem} />
)}

{user.role === 'ADMIN' && (
  <AdminDashboardLink />
)}
```

**Interview talking points:**
- "I use conditional rendering for loading states, auth checks, role-based UI"
- "Ternary operators for either/or, && operator for show/hide"

---

## 4️⃣ PERFORMANCE OPTIMIZATION

### ✅ What You've Implemented

**1. Callback Dependencies:**
```javascript
const handleSearch = useCallback((query) => {
  fetchResults(query);
}, [fetchResults]);
```

**2. Preventing Unnecessary Re-renders:**
```javascript
// Only re-fetch when search changes, not on every render
useEffect(() => {
  loadProperties();
}, [search]);
```

**Interview talking points:**
- "I manage dependencies carefully to prevent unnecessary re-renders"
- "Used cleanup functions in useEffect to cancel pending requests/timers"

**Common questions:**
- **Q: How do you optimize React performance?**
  - **A:** "Several ways I've used:
    1. Proper useEffect dependencies to avoid unnecessary calls
    2. Split large components into smaller ones
    3. Used React.memo for components that re-render frequently
    4. Debounced search inputs
    5. Pagination for large lists"

---

## 5️⃣ FORM HANDLING (YOUR EXPERTISE)

### ✅ Controlled Components

```javascript
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

<TextInput
  value={email}
  onChangeText={setEmail}
  placeholder="Email"
/>
```

**Interview talking points:**
- "I use controlled components - React state as single source of truth"
- "Built complex multi-step forms (12-step host property creation)"

### ✅ Form Validation

```javascript
const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
const canSubmit = isValidEmail(email) && password.length >= 6;

<TouchableOpacity
  disabled={!canSubmit}
  style={{ opacity: canSubmit ? 1 : 0.5 }}
>
```

**Interview talking points:**
- "Real-time validation with visual feedback"
- "Disabled submit button until all fields valid"

---

## 6️⃣ API INTEGRATION (REAL-WORLD EXPERIENCE)

### ✅ Your Pattern

```javascript
const handleLogin = async () => {
  try {
    setLoading(true);
    const res = await axios.post(`${API_BASE}/api/send-otp`, { email });

    if (res.data.success) {
      navigation.navigate('OtpScreen', { email });
    } else {
      alert(res.data.message);
    }
  } catch (err) {
    console.error('Login error:', err);
    alert('Network error');
  } finally {
    setLoading(false);
  }
};
```

**Interview talking points:**
- "I handle async operations with try/catch blocks"
- "Loading states for better UX"
- "Error handling with user-friendly messages"

**Common questions:**
- **Q: How do you handle API calls in React?**
  - **A:** "I use axios with async/await in useEffect or event handlers. I centralized API config in lib/api.js for reusability. Always handle loading states, errors, and cleanup."

---

## 7️⃣ NAVIGATION (REACT NAVIGATION)

### ✅ What You Built

**Stack Navigation:**
```javascript
<Stack.Navigator>
  <Stack.Screen name="Login" component={LoginScreen} />
  <Stack.Screen name="OtpScreen" component={OtpScreen} />
  <Stack.Screen name="MainTabs" component={MainTabs} />
</Stack.Navigator>
```

**Tab Navigation:**
```javascript
<Tab.Navigator>
  <Tab.Screen name="Home" component={HomeScreen} />
  <Tab.Screen name="Explore" component={ExploreScreen} />
  <Tab.Screen name="Bookings" component={BookingsScreen} />
</Tab.Navigator>
```

**Passing Data:**
```javascript
// Navigate with params
navigation.navigate('PropertyDetails', { id: property.id });

// Receive params
const { id } = route.params;
```

**Interview talking points:**
- "Used React Navigation for 47-screen app"
- "Stack + Tab navigators for nested navigation"
- "Deep linking support with URL scheme"

---

## 8️⃣ KEY REACT CONCEPTS

### ✅ Component Lifecycle (Hooks Equivalent)

**Your mental model:**
```javascript
useEffect(() => {
  // componentDidMount - runs once
  fetchData();

  return () => {
    // componentWillUnmount - cleanup
    cancelRequest();
  };
}, []); // Empty array = mount only

useEffect(() => {
  // componentDidUpdate - runs when deps change
  updateData();
}, [searchQuery]);
```

---

### ✅ One-Way Data Flow

**What you understand:**
- "Props flow down from parent to child"
- "Child components can't directly modify parent state"
- "Use callbacks to communicate up: `onPress={() => parentFunction()}`"

**Example from your code:**
```javascript
// Parent
const [selected, setSelected] = useState(null);

<FilterChip
  label="All"
  active={selected === 'all'}
  onPress={() => setSelected('all')}
/>

// Child receives props, calls callback
function FilterChip({ label, active, onPress }) {
  return <TouchableOpacity onPress={onPress}>...</TouchableOpacity>
}
```

---

## 9️⃣ COMMON INTERVIEW QUESTIONS

### Q1: "Tell me about your React experience"

**Your answer:**
"I've built a production-level property rental platform with 47 screens using React Native and React Navigation. I implemented authentication with Context API, created custom hooks for shared logic, and integrated with a REST API. The app includes complex features like multi-step forms (12-step property creation), real-time search, payment integration, and role-based access control. I'm comfortable with modern React patterns - hooks, functional components, and performance optimization."

---

### Q2: "What's the Virtual DOM?"

**Your answer:**
"The Virtual DOM is React's lightweight copy of the actual DOM. When state changes, React creates a new virtual DOM tree, compares it with the previous one (diffing), and updates only what changed in the real DOM. This makes React fast because DOM manipulation is expensive. In my app, when I update a state like `setEmail('new@email.com')`, React efficiently updates just that input field, not the entire screen."

---

### Q3: "Props vs State?"

**Your answer:**
"Props are read-only data passed from parent to child - like function arguments. State is mutable data managed within a component. In my app, I pass property data as props to PropertyCard components, but manage user input in state. Props create reusable components, state manages dynamic behavior."

---

### Q4: "How do you handle side effects?"

**Your answer:**
"I use useEffect for side effects - API calls, subscriptions, timers, DOM manipulation. Key is managing the dependency array correctly. In my OTP screen, I used useEffect to start a countdown timer on mount and cleanup on unmount to prevent memory leaks. I also use it to fetch data when search query changes."

---

### Q5: "Redux vs Context API?"

**Your answer:**
"I chose Context API for my app because it's built-in, simpler for moderate complexity, and sufficient for auth state across 47 screens. Redux would add value for time-travel debugging, complex middleware, or very frequent state updates. Context API worked well for my use case - authentication, notifications, and user preferences. If the app grew to need more complex state orchestration, I'd consider Redux."

---

### Q6: "How do you prevent re-renders?"

**Your answer:**
"Several strategies I've used:
1. Proper useEffect dependencies - only re-run when necessary
2. Split contexts - separate auth from notifications to reduce consumers
3. React.memo for components that receive same props
4. useCallback to memoize functions
5. Lift state up only when necessary, keep it local when possible
In my app, I split large screens into smaller components to isolate re-renders."

---

### Q7: "Class vs Functional components?"

**Your answer:**
"I use functional components exclusively - they're modern React standard. Simpler syntax, better performance, and hooks provide all lifecycle methods. My entire 47-screen app is functional components. I understand class components from older code I've seen, but hooks are more powerful and cleaner."

---

## 🔟 YOUR PROJECT HIGHLIGHTS TO MENTION

**When they ask "Tell me about a project":**

### Averulo Property Rental Platform

**Overview:**
"I built a full-stack property rental platform similar to Airbnb - 47 screens with React Native."

**Key Features:**
- ✅ Guest booking flow (browse, search, book, pay)
- ✅ Host property creation (12-step wizard)
- ✅ Admin dashboard with analytics
- ✅ KYC verification system
- ✅ Real-time search & filters
- ✅ Payment integration (Paystack)
- ✅ Reviews & ratings system

**Technical Decisions:**
- "Used Context API for auth state across 47 screens"
- "Created custom hooks (useAuth, useNotifications) for shared logic"
- "Implemented pagination for large data sets"
- "Built reusable components (DateRangePicker, FilterChips)"
- "Optimized forms with validation and loading states"

**Challenges Solved:**
- "Managed complex navigation with nested Stack + Tab navigators"
- "Handled image uploads with expo-image-picker"
- "Implemented role-based access (Guest/Host/Admin)"
- "Integrated with REST API using axios with proper error handling"

---

## 🎯 QUICK WINS TO MENTION

### Your Strengths:
1. ✅ **Modern React** - Hooks, functional components
2. ✅ **Production experience** - 47-screen app in production
3. ✅ **Custom hooks** - Wrote reusable hooks
4. ✅ **State management** - Context API for global state
5. ✅ **API integration** - REST API with axios
6. ✅ **Navigation** - React Navigation (Stack + Tabs)
7. ✅ **Forms** - Complex multi-step forms
8. ✅ **Performance** - Proper useEffect dependencies, cleanup functions

---

## 🚫 WHAT TO AVOID SAYING

❌ "I don't know Redux" → ✅ "I used Context API, understand Redux concepts"
❌ "I just copy code" → ✅ "I understand the patterns and adapt them"
❌ "React Native = React" → ✅ "Similar concepts, different rendering targets"
❌ "I struggle with hooks" → ✅ "I've built complex features with hooks"

---

## ⚡ LAST-MINUTE REVIEW (10 MIN BEFORE INTERVIEW)

### The 5 Things to Remember:

1. **useState** - Manage component state
2. **useEffect** - Handle side effects (API calls, timers)
3. **useContext** - Global state (your auth system)
4. **Custom Hooks** - Reusable logic (useAuth, useNotifications)
5. **Component Props** - Pass data down, callbacks up

### Your Killer Line:
"I built a 47-screen production property rental platform using React Native with Context API for state management, custom hooks for shared logic, and React Navigation for multi-level navigation. The app includes complex features like 12-step forms, payment integration, and role-based access control."

---

## 📝 CHEAT SHEET

```javascript
// 1. COMPONENT STRUCTURE
import { useState, useEffect } from 'react';

function MyComponent() {
  // 2. STATE
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 3. CONTEXT
  const { user } = useAuth();

  // 4. EFFECTS
  useEffect(() => {
    fetchData();
    return () => cleanup(); // Always cleanup!
  }, [dependency]);

  // 5. HANDLERS
  const handleClick = async () => {
    setLoading(true);
    try {
      await api.call();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 6. RENDER
  return (
    <View>
      {loading ? <Spinner /> : <Data />}
    </View>
  );
}
```

---

## 🎤 PRACTICE ANSWER TEMPLATES

**"Walk me through your thought process for [feature]"**
Template:
1. "First, I identified the requirements..."
2. "Then I chose [technology] because..."
3. "I implemented it by..."
4. "The challenge was [X], which I solved by..."
5. "The result was..."

---

## 💪 CONFIDENCE BOOSTERS

You've:
- ✅ Built 47 production screens
- ✅ Used 5+ React hooks in production
- ✅ Created custom hooks
- ✅ Implemented global state management
- ✅ Integrated with REST APIs
- ✅ Built complex forms
- ✅ Handled authentication flows
- ✅ Created reusable components

**You're ready! Good luck! 🚀**
