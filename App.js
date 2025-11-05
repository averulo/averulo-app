import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './hooks/useAuth';
import { NotificationsProvider } from './hooks/useNotifications';

import MainTabs from './navigation/MainTabs';

// Screens
import AddPhoneScreen from './screens/AddPhoneScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import InputNINScreen from './screens/InputNINScreen';
import LoginScreen from './screens/LoginScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import OtpScreen from './screens/OtpScreen';
import PaymentHistoryScreen from './screens/PaymentHistoryScreen'; // ✅ Add this import
import PropertiesListScreen from './screens/PropertiesListScreen';
import SignUpScreen from './screens/SignUpScreen';
import SplashScreen from './screens/SplashScreen';
import TakePhotoOfIDScreen from './screens/TakePhotoOfIDScreen';
import TakePhotoOfPassportScreen from './screens/TakePhotoOfPassportScreen';
import UserVerificationScreen from './screens/UserVerificationScreen';
import WelcomeScreen from './screens/WelcomeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NotificationsProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="OtpScreen" component={OtpScreen} />

            {/* 👇 Main app with bottom tabs */}
            <Stack.Screen name="MainTabs" component={MainTabs} />

            {/* ✅ Additional screens */}
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="PaymentHistory" component={PaymentHistoryScreen} /> {/* ✅ Add this line */}

            {/* Other flows */}
            <Stack.Screen name="Home" component={PropertiesListScreen} />
            <Stack.Screen name="UserVerification" component={UserVerificationScreen} />
            <Stack.Screen name="TakePhotoOfID" component={TakePhotoOfIDScreen} />
            <Stack.Screen name="TakePhotoOfPassport" component={TakePhotoOfPassportScreen} />
            <Stack.Screen name="InputNIN" component={InputNINScreen} />
            <Stack.Screen name="AddPhoneScreen" component={AddPhoneScreen} />
            <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </NotificationsProvider>
    </AuthProvider>
  );
}