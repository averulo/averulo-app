# React Best Practices for Interview
## Essential Patterns & Common Practices

---

## 🎯 TOP 10 REACT BEST PRACTICES (MOST ASKED)

### 1️⃣ **Component Composition Over Inheritance**

❌ **WRONG:**
```javascript
class BaseButton extends React.Component {}
class PrimaryButton extends BaseButton {}
```

✅ **RIGHT (What you do):**
```javascript
function Button({ variant, children, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.button, variant === 'primary' && styles.primary]}
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  );
}

// Usage
<Button variant="primary" onPress={handleClick}>
  Submit
</Button>
```

**Interview answer:**
"React recommends composition over inheritance. I create flexible components with props instead of extending classes. This makes components more reusable and easier to maintain."

---

### 2️⃣ **Keep Components Small & Focused (Single Responsibility)**

❌ **BAD:**
```javascript
function MassiveScreen() {
  // 500 lines of code doing everything
  const [user, setUser] = useState();
  const [bookings, setBookings] = useState();
  const [payments, setPayments] = useState();
  // renders UI, handles API, manages state, etc.
}
```

✅ **GOOD (What you should do):**
```javascript
function BookingsScreen() {
  const { bookings } = useBookings(); // Custom hook

  return (
    <View>
      <BookingsList bookings={bookings} />
      <BookingFilters onFilter={handleFilter} />
    </View>
  );
}

function BookingsList({ bookings }) {
  return bookings.map(booking => (
    <BookingCard key={booking.id} booking={booking} />
  ));
}
```

**Interview answer:**
"I follow single responsibility principle - each component does one thing well. In my app, I broke down complex screens into smaller components like BookingCard, FilterChips, etc. Makes code maintainable and testable."

---

### 3️⃣ **Always Use Keys in Lists**

❌ **WRONG:**
```javascript
{items.map((item) => (
  <View>{item.name}</View>
))}
// OR
{items.map((item, index) => (
  <View key={index}>{item.name}</View>  // BAD!
))}
```

✅ **RIGHT:**
```javascript
{properties.map((property) => (
  <PropertyCard key={property.id} property={property} />
))}
```

**Interview answer:**
"Keys help React identify which items changed. I use unique IDs, never array indices because indices can cause bugs when items are added/removed/reordered. In my property list, I use property.id as the key."

**Why not index?**
- If you delete item at index 2, all items after it get new indices
- React thinks different items changed when they didn't
- Can cause state bugs with controlled inputs

---

### 4️⃣ **Avoid Inline Functions in Render (Performance)**

❌ **BAD:**
```javascript
{properties.map((property) => (
  <PropertyCard
    key={property.id}
    onPress={() => handlePress(property.id)}  // Creates new function every render!
  />
))}
```

✅ **GOOD:**
```javascript
function PropertyList({ properties, onSelectProperty }) {
  const handlePress = useCallback((id) => {
    onSelectProperty(id);
  }, [onSelectProperty]);

  return properties.map((property) => (
    <PropertyCard
      key={property.id}
      onPress={() => handlePress(property.id)}
    />
  ));
}
```

✅ **EVEN BETTER (Lift it to child):**
```javascript
function PropertyCard({ property, onPress }) {
  const handlePress = () => onPress(property.id);

  return (
    <TouchableOpacity onPress={handlePress}>
      <Text>{property.name}</Text>
    </TouchableOpacity>
  );
}
```

**Interview answer:**
"Inline functions in render create new function instances on every render, which can cause child components to re-render unnecessarily. I use useCallback or move the handler to the child component."

---

### 5️⃣ **Proper useEffect Dependencies**

❌ **DANGEROUS:**
```javascript
useEffect(() => {
  fetchUser(userId);
}, []); // userId not in dependencies - STALE CLOSURE BUG!
```

❌ **WASTEFUL:**
```javascript
useEffect(() => {
  fetchUser(userId);
}); // No array - runs on EVERY render!
```

✅ **CORRECT:**
```javascript
useEffect(() => {
  fetchUser(userId);
}, [userId]); // Re-fetch when userId changes

// OR if function is stable
const fetchUser = useCallback((id) => {
  // fetch logic
}, []);

useEffect(() => {
  fetchUser(userId);
}, [userId, fetchUser]);
```

**Interview answer:**
"I always include all dependencies in the useEffect array. Missing dependencies cause stale closure bugs. Empty array means run once on mount. If I get the ESLint warning, I fix it, not disable it."

---

### 6️⃣ **Cleanup Side Effects**

❌ **MEMORY LEAK:**
```javascript
useEffect(() => {
  const timer = setInterval(() => {
    setCount(prev => prev + 1);
  }, 1000);
  // No cleanup - timer keeps running after unmount!
}, []);
```

✅ **CORRECT:**
```javascript
useEffect(() => {
  const timer = setInterval(() => {
    setCount(prev => prev + 1);
  }, 1000);

  return () => clearInterval(timer); // Cleanup!
}, []);
```

**Common cleanups:**
```javascript
useEffect(() => {
  // Subscriptions
  const unsubscribe = api.subscribe(handleUpdate);
  return () => unsubscribe();

  // Event listeners
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);

  // Abort fetch
  const controller = new AbortController();
  fetch(url, { signal: controller.signal });
  return () => controller.abort();
}, []);
```

**Interview answer:**
"I always cleanup side effects to prevent memory leaks. In my OTP screen, I cleanup the countdown timer on unmount. For API calls, I cancel pending requests. It's essential for performance and avoiding bugs."

---

### 7️⃣ **Avoid Prop Drilling - Use Context or Composition**

❌ **PROP DRILLING (BAD):**
```javascript
<App user={user}>
  <Dashboard user={user}>
    <Sidebar user={user}>
      <Profile user={user} />  // Passed through 4 levels!
    </Sidebar>
  </Dashboard>
</App>
```

✅ **CONTEXT API:**
```javascript
// Create context
const UserContext = createContext();

// Provider at top level
<UserContext.Provider value={user}>
  <App />
</UserContext.Provider>

// Use anywhere
function Profile() {
  const user = useContext(UserContext);
  return <Text>{user.name}</Text>;
}
```

✅ **OR COMPOSITION:**
```javascript
<Dashboard
  sidebar={<Sidebar profile={<Profile user={user} />} />}
/>
```

**Interview answer:**
"I avoid prop drilling by using Context API for global state like authentication. In my app, any component can access user data via useAuth() hook without passing props through every level. For component-specific data, I use composition."

---

### 8️⃣ **Conditional Rendering Patterns**

✅ **GOOD PATTERNS:**
```javascript
// 1. Ternary (either/or)
{loading ? <Spinner /> : <Content />}

// 2. && operator (show/hide)
{error && <ErrorMessage text={error} />}

// 3. Early return (cleaner for auth checks)
if (!user) return <LoginScreen />;
return <Dashboard />;

// 4. Switch for multiple conditions
{(() => {
  switch(status) {
    case 'loading': return <Spinner />;
    case 'error': return <Error />;
    case 'success': return <Content />;
  }
})()}
```

❌ **AVOID:**
```javascript
// Don't return null in JSX
{isVisible && component !== null && component}

// Better:
{isVisible && component}
```

---

### 9️⃣ **Controlled vs Uncontrolled Components**

✅ **CONTROLLED (Recommended - What you use):**
```javascript
const [email, setEmail] = useState('');

<TextInput
  value={email}           // React state is source of truth
  onChangeText={setEmail} // Update state on change
/>
```

❌ **UNCONTROLLED (Rarely needed):**
```javascript
const emailRef = useRef();

<input ref={emailRef} />  // DOM is source of truth
// Access with: emailRef.current.value
```

**Interview answer:**
"I use controlled components - React state is the single source of truth. Makes validation easier, enables real-time feedback, and integrates better with React's data flow. I only use uncontrolled for file inputs or when integrating with non-React code."

---

### 🔟 **Error Boundaries (Class Component Pattern)**

```javascript
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorScreen />;
    }
    return this.props.children;
  }
}

// Usage
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

**Interview answer:**
"Error boundaries catch errors in component trees. Currently only available as class components. I wrap my app root in an error boundary to prevent the entire app from crashing if one component fails."

---

## 🚀 PERFORMANCE BEST PRACTICES

### 1️⃣ **React.memo for Expensive Components**

```javascript
const ExpensiveComponent = React.memo(({ data }) => {
  // Only re-renders if 'data' prop changes
  return <ComplexVisualization data={data} />;
});
```

**When to use:**
- Component renders often with same props
- Component is expensive to render
- Parent re-renders frequently

---

### 2️⃣ **useCallback for Stable Function References**

```javascript
// Without useCallback - new function every render
const handleClick = () => doSomething();

// With useCallback - stable reference
const handleClick = useCallback(() => {
  doSomething();
}, [/* dependencies */]);
```

**When to use:**
- Passing callbacks to memoized child components
- Callback is a dependency of useEffect
- Callback creates other hooks/effects

---

### 3️⃣ **useMemo for Expensive Calculations**

```javascript
// Without useMemo - calculates every render
const expensiveValue = calculateSomething(data);

// With useMemo - only recalculates when data changes
const expensiveValue = useMemo(() => {
  return calculateSomething(data);
}, [data]);
```

**When to use:**
- Expensive calculations
- Object/array creation that's used as dependency
- Filtering/sorting large lists

---

### 4️⃣ **Lazy Loading Components**

```javascript
const AdminDashboard = React.lazy(() => import('./AdminDashboard'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <AdminDashboard />
    </Suspense>
  );
}
```

**Interview answer:**
"Code splitting with React.lazy reduces initial bundle size. I'd use it for admin features that most users never see. Suspense provides loading state while component loads."

---

## 📝 NAMING CONVENTIONS

### ✅ GOOD PRACTICES:

```javascript
// 1. Components: PascalCase
function PropertyCard() {}

// 2. Hooks: use prefix
function useAuth() {}
function useFetchData() {}

// 3. Event handlers: handle prefix
const handleClick = () => {};
const handleSubmit = () => {};

// 4. Boolean props/state: is/has prefix
const [isLoading, setIsLoading] = useState(false);
const [hasError, setHasError] = useState(false);

// 5. Constants: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_COUNT = 3;
```

---

## 🎨 COMPONENT STRUCTURE (Standard Order)

```javascript
function MyComponent({ prop1, prop2 }) {
  // 1. Hooks (always at top, same order every render)
  const [state, setState] = useState();
  const { contextValue } = useContext(MyContext);
  const navigate = useNavigation();

  // 2. Derived state/computed values
  const isValid = state && state.length > 0;

  // 3. Effects
  useEffect(() => {
    // side effects
  }, []);

  // 4. Event handlers
  const handleClick = () => {
    // handler logic
  };

  // 5. Early returns (if needed)
  if (loading) return <Spinner />;

  // 6. Main render
  return (
    <View>
      {/* JSX */}
    </View>
  );
}

// 7. Styles (if using StyleSheet)
const styles = StyleSheet.create({
  container: { flex: 1 }
});
```

---

## ⚠️ COMMON MISTAKES TO AVOID

### ❌ 1. Mutating State Directly
```javascript
// WRONG
state.push(newItem);
setState(state);

// RIGHT
setState([...state, newItem]);
```

### ❌ 2. Using Index as Key
```javascript
// WRONG
items.map((item, i) => <Item key={i} />)

// RIGHT
items.map(item => <Item key={item.id} />)
```

### ❌ 3. Forgetting useEffect Dependencies
```javascript
// WRONG
useEffect(() => {
  fetchData(userId);
}, []); // userId missing!

// RIGHT
useEffect(() => {
  fetchData(userId);
}, [userId]);
```

### ❌ 4. Not Cleaning Up Side Effects
```javascript
// WRONG
useEffect(() => {
  const timer = setInterval(tick, 1000);
}, []);

// RIGHT
useEffect(() => {
  const timer = setInterval(tick, 1000);
  return () => clearInterval(timer);
}, []);
```

### ❌ 5. Unnecessary Re-renders
```javascript
// WRONG - creates new object every render
<Component style={{ margin: 10 }} />

// RIGHT - stable reference
const styles = { margin: 10 };
<Component style={styles} />
```

---

## 🎤 INTERVIEW SOUNDBITES

### "What are React best practices?"

**Your answer:**
"Key practices I follow include:
1. **Component composition** over inheritance
2. **Small, focused components** following single responsibility
3. **Proper hook dependencies** to avoid stale closures
4. **Cleanup side effects** to prevent memory leaks
5. **Controlled components** for forms
6. **Context API** to avoid prop drilling
7. **Performance optimization** with memo, useCallback, useMemo when needed
8. **Unique keys** in lists, never indices

In my 47-screen app, I applied these patterns consistently - like using Context for auth state, cleaning up timers in useEffect, and breaking complex screens into reusable components."

---

### "How do you optimize React performance?"

**Your answer:**
"Several strategies:
1. **Proper useEffect dependencies** - only re-run when necessary
2. **React.memo** for components that render frequently with same props
3. **useCallback/useMemo** to prevent unnecessary re-renders
4. **Code splitting** with React.lazy for large routes
5. **Avoid inline objects/functions** in render
6. **Keep components small** - easier for React to optimize
7. **Virtualization** for long lists (FlatList in React Native)

In my app, I optimized by splitting contexts (auth separate from notifications), using proper dependencies, and breaking large screens into smaller components."

---

### "What's your component structure approach?"

**Your answer:**
"I follow a consistent structure:
1. **Hooks first** - always same order
2. **Derived values** next
3. **Effects** for side effects
4. **Event handlers**
5. **Early returns** for edge cases
6. **Main render** last

I keep components small (single responsibility), use composition over prop drilling, and extract complex logic into custom hooks. This makes code predictable and maintainable."

---

## 🔥 ADVANCED PATTERNS (Bonus Points)

### 1️⃣ **Render Props Pattern**
```javascript
<DataProvider>
  {({ data, loading }) => (
    loading ? <Spinner /> : <List data={data} />
  )}
</DataProvider>
```

### 2️⃣ **Higher-Order Components (HOC)**
```javascript
function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { user } = useAuth();
    if (!user) return <LoginScreen />;
    return <Component {...props} />;
  };
}

export default withAuth(DashboardScreen);
```

### 3️⃣ **Compound Components**
```javascript
<Tabs>
  <TabList>
    <Tab>Tab 1</Tab>
    <Tab>Tab 2</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>Content 1</TabPanel>
    <TabPanel>Content 2</TabPanel>
  </TabPanels>
</Tabs>
```

---

## ✅ QUICK CHECKLIST FOR YOUR CODE

Before interview, mentally check your code follows these:

- [ ] All components are functional (no classes)?
- [ ] useEffect has correct dependencies?
- [ ] Side effects have cleanup functions?
- [ ] Lists use unique keys (not indices)?
- [ ] No prop drilling (using Context where needed)?
- [ ] Components are small and focused?
- [ ] State is never mutated directly?
- [ ] Forms use controlled components?
- [ ] Loading and error states handled?
- [ ] Async operations wrapped in try/catch?

---

## 💪 CONFIDENCE BUILDER

**You're already doing most of these!**

In your Averulo app:
✅ Functional components throughout
✅ Custom hooks (useAuth, useNotifications)
✅ Context API for global state
✅ Proper useEffect with cleanup (OTP timer)
✅ Small, focused components
✅ Controlled forms with validation
✅ Error handling in async operations

**You know these patterns because you've USED them!**

---

## 🎯 FINAL TIPS

1. **Show confidence** - "In my app, I used..."
2. **Use specific examples** - Reference your 47-screen app
3. **Explain WHY** - Not just what, but why you chose that approach
4. **Admit what you don't know** - But show willingness to learn
5. **Connect to fundamentals** - Link patterns back to React core concepts

**You've got this! 🚀**
