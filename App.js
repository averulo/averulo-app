import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './hooks/useAuth';
import { NotificationsProvider } from './hooks/useNotifications'; // 👈

import MainTabs from './navigation/MainTabs';

// Screens
import AddPhoneScreen from './screens/AddPhoneScreen';
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import AdminKycDashboardScreen from "./screens/AdminKycDashboardScreen";
import EditProfileScreen from './screens/EditProfileScreen';
import InputNINScreen from './screens/InputNINScreen';
import LoginScreen from './screens/LoginScreen';
import NotificationsScreen from './screens/NotificationsScreen'; // ✅ add this
import OtpScreen from './screens/OtpScreen';
import PropertiesListScreen from './screens/PropertiesListScreen';
import SignUpScreen from './screens/SignUpScreen';
import SplashScreen from './screens/SplashScreen';
import TakePhotoOfIDScreen from './screens/TakePhotoOfIDScreen';
import TakePhotoOfPassportScreen from './screens/TakePhotoOfPassportScreen';
import UserVerificationScreen from './screens/UserVerificationScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NotificationsProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="OtpScreen" component={OtpScreen} />

            {/* 👇 Main app with bottom tabs */}
            <Stack.Screen name="MainTabs" component={MainTabs} />

            {/* ✅ This line fixes the navigation error */}
            <Stack.Screen name="Notifications" component={NotificationsScreen} />

            {/* Other flows */}
            <Stack.Screen name="Home" component={PropertiesListScreen} />
            <Stack.Screen name="UserVerification" component={UserVerificationScreen} />
            <Stack.Screen name="TakePhotoOfID" component={TakePhotoOfIDScreen} />
            <Stack.Screen name="TakePhotoOfPassport" component={TakePhotoOfPassportScreen} />
            <Stack.Screen name="InputNIN" component={InputNINScreen} />
            <Stack.Screen name="AddPhoneScreen" component={AddPhoneScreen} />
            <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
            <Stack.Screen
              name="AdminKycDashboard"
              component={AdminKycDashboardScreen}
              options={{ title: "KYC Dashboard", headerShown: true }}
            />
            <Stack.Screen
            name="AdminDashboard"
            component={AdminDashboardScreen}
            options={{ title: "Admin Dashboard", headerShown: true }}
          />
          </Stack.Navigator>
        </NavigationContainer>
      </NotificationsProvider>
    </AuthProvider>
  );
}