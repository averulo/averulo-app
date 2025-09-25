import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from './hooks/useAuth';
import LoginScreen from './screens/LoginScreen';
import SplashScreen from './screens/SplashScreen';
import WelcomeScreen from './screens/WelcomeScreen';
// ... import other screens

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { token, loading } = useAuth();

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        <>
          {/* Authenticated flow */}
        </>
      ) : (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          {/* more screens */}
        </>
      )}
    </Stack.Navigator>
  );
}