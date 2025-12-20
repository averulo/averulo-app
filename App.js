import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthProvider } from './hooks/useAuth';
import { NotificationsProvider } from './hooks/useNotifications';

import { useFonts, Manrope_300Light, Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold } from '@expo-google-fonts/manrope';
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";

import MainTabs from './navigation/MainTabs';

// Screens...
import AboutPlaceScreen from "./screens/AboutPlaceScreen";
import AddPhoneScreen from './screens/AddPhoneScreen';
import AdminBookingsScreen from "./screens/AdminBookingsScreen";
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import AdminKycDashboardScreen from "./screens/AdminKycDashboardScreen";
import AdminPaymentsScreen from "./screens/AdminPaymentsScreen";
import AdminPropertiesScreen from "./screens/AdminPropertiesScreen";
import AdminUsersScreen from "./screens/AdminUsersScreen";
import AmenitiesScreen from "./screens/AmenitiesScreen";
import BookingCancelledScreen from "./screens/BookingCancelledScreen";
import BookingDetailsScreen from "./screens/BookingDetailsScreen";
import BookingInProgressScreen from "./screens/BookingInProgressScreen";
import BookingSuccessScreen from "./screens/BookingSuccessScreen";
import BookingTicketScreen from "./screens/BookingTicketScreen";
import ConfirmBookingScreen from "./screens/ConfirmBookingScreen";
import EditProfileScreen from './screens/EditProfileScreen';
import InputNINScreen from './screens/InputNINScreen';
import LoginScreen from './screens/LoginScreen';
import MyBookingsScreen from "./screens/MyBookingsScreen";
import NotificationsScreen from './screens/NotificationsScreen';
import OtpScreen from './screens/OtpScreen';
import PaymentScreen from "./screens/PaymentScreen";
import PropertiesListScreen from './screens/PropertiesListScreen';
import PropertyDetailsScreen from "./screens/PropertyDetailsScreen";
import SearchScreen from './screens/searchScreen';
import SignUpScreen from './screens/SignUpScreen';
import SplashScreenView from './screens/SplashScreen';
import TakePhotoOfIDScreen from './screens/TakePhotoOfIDScreen';
import TakePhotoOfPassportScreen from './screens/TakePhotoOfPassportScreen';
import UserVerificationScreen from './screens/UserVerificationScreen';
import ViewBookingDetailsScreen from './screens/ViewBookingDetailsScreen';
import WriteReviewScreen from './screens/WriteReviewScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import ChatScreen from './screens/ChatScreen';
import ChatDetailScreen from './screens/ChatDetailScreen';

// Host Screens
import BecomeHostScreen from './screens/host/BecomeHostScreen';
import HostOnboardingScreen from './screens/host/HostOnboardingScreen';
import CreatePropertyScreen from './screens/host/CreatePropertyScreen';
import HostReviewsScreen from './screens/host/HostReviewsScreen';
import ReorderPhotosScreen from './screens/host/ReorderPhotosScreen';
import ConfirmPropertyScreen from './screens/host/ConfirmPropertyScreen';
import PropertyPreviewScreen from './screens/host/PropertyPreviewScreen';
import HostWelcomeScreen from './screens/host/HostWelcomeScreen';
import HostDashboardScreen from './screens/host/HostDashboardScreen';
import HostCalendarScreen from './screens/host/HostCalendarScreen';
import HostStatisticsScreen from './screens/host/HostStatisticsScreen';
import HostBookingsScreen from './screens/host/HostBookingsScreen';
import HostBookingRequestScreen from './screens/host/HostBookingRequestScreen';
import HostBookingAcceptedScreen from './screens/host/HostBookingAcceptedScreen';
import HostBookingDeclinedScreen from './screens/host/HostBookingDeclinedScreen';

// 👇 MUST be at the top level.
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    "Manrope-Light": Manrope_300Light,
    "Manrope-Regular": Manrope_400Regular,
    "Manrope-Medium": Manrope_500Medium,
    "Manrope-SemiBold": Manrope_600SemiBold,
  });

  // 👇 This must hide splash *after* fonts finish AND after navigation is ready
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Show error in console if fonts fail to load, but continue anyway
  if (fontError) {
    console.error('Error loading fonts:', fontError);
  }

  if (!fontsLoaded && !fontError) {
    return null; // keep splash visible
  }

  return (
    <AuthProvider>
      <NotificationsProvider>
        <NavigationContainer onReady={onLayoutRootView}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            
            <Stack.Screen name="Splash" component={SplashScreenView} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="OtpScreen" component={OtpScreen} />

            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />

            <Stack.Screen name="Home" component={PropertiesListScreen} />
            <Stack.Screen name="UserVerification" component={UserVerificationScreen} />
            <Stack.Screen name="TakePhotoOfID" component={TakePhotoOfIDScreen} />
            <Stack.Screen name="TakePhotoOfPassport" component={TakePhotoOfPassportScreen} />
            <Stack.Screen name="InputNIN" component={InputNINScreen} />
            <Stack.Screen name="AddPhoneScreen" component={AddPhoneScreen} />
            <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />

            <Stack.Screen name="AdminKycDashboard" component={AdminKycDashboardScreen} options={{ headerShown: true }} />
            <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ headerShown: true }} />
            <Stack.Screen name="AdminUsersScreen" component={AdminUsersScreen} options={{ headerShown: true }} />
            <Stack.Screen name="AdminPropertiesScreen" component={AdminPropertiesScreen} options={{ headerShown: true }} />
            <Stack.Screen name="AdminBookingsScreen" component={AdminBookingsScreen} options={{ headerShown: true }} />
            <Stack.Screen name="AdminPaymentsScreen" component={AdminPaymentsScreen} options={{ headerShown: true }} />

            <Stack.Screen name="BecomeHostScreen" component={BecomeHostScreen} />
            <Stack.Screen name="HostOnboardingScreen" component={HostOnboardingScreen} />
            <Stack.Screen name="CreatePropertyScreen" component={CreatePropertyScreen} />
            <Stack.Screen name="ReorderPhotosScreen" component={ReorderPhotosScreen} />
            <Stack.Screen name="ConfirmPropertyScreen" component={ConfirmPropertyScreen} />
            <Stack.Screen name="PropertyPreviewScreen" component={PropertyPreviewScreen} />
            <Stack.Screen name="HostWelcomeScreen" component={HostWelcomeScreen} />
            <Stack.Screen name="HostDashboardScreen" component={HostDashboardScreen} />
            <Stack.Screen name="HostCalendarScreen" component={HostCalendarScreen} />
            <Stack.Screen name="HostStatisticsScreen" component={HostStatisticsScreen} />
            <Stack.Screen name="HostBookingsScreen" component={HostBookingsScreen} />
            <Stack.Screen name="HostBookingRequestScreen" component={HostBookingRequestScreen} />
            <Stack.Screen name="HostBookingAcceptedScreen" component={HostBookingAcceptedScreen} />
            <Stack.Screen name="HostBookingDeclinedScreen" component={HostBookingDeclinedScreen} />
            <Stack.Screen name="HostReviewsScreen" component={HostReviewsScreen} />

            <Stack.Screen name="MyBookingsScreen" component={MyBookingsScreen} />
            <Stack.Screen name="SearchScreen" component={SearchScreen} />
            <Stack.Screen name="PropertyDetailsScreen" component={PropertyDetailsScreen} />
            <Stack.Screen name="AmenitiesScreen" component={AmenitiesScreen} />
            <Stack.Screen name="AboutPlaceScreen" component={AboutPlaceScreen} />
            <Stack.Screen name="BookingDetailsScreen" component={BookingDetailsScreen} />
            <Stack.Screen name="ConfirmBookingScreen" component={ConfirmBookingScreen} />
            <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
            <Stack.Screen name="BookingInProgressScreen" component={BookingInProgressScreen} />
            <Stack.Screen name="BookingCancelledScreen" component={BookingCancelledScreen} />
            <Stack.Screen name="BookingSuccessScreen" component={BookingSuccessScreen} />
            <Stack.Screen name="BookingTicketScreen" component={BookingTicketScreen} />
            <Stack.Screen name="ViewBookingDetailsScreen" component={ViewBookingDetailsScreen} />
            <Stack.Screen name="WriteReviewScreen" component={WriteReviewScreen} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} />
            <Stack.Screen name="ChatDetailScreen" component={ChatDetailScreen} />

          </Stack.Navigator>
        </NavigationContainer>
      </NotificationsProvider>
    </AuthProvider>
  );
}