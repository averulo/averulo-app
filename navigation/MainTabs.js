import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NotificationBell from '../components/NotificationBell';
import EditProfileScreen from '../screens/EditProfileScreen';
import ExploreHomeScreen from '../screens/ExploreHomeScreen';
import MyBookingsScreen from "../screens/MyBookingsScreen";
import NotificationsScreen from '../screens/NotificationsScreen';
import SavedScreen from '../screens/SavedScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs({ navigation }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#000A63',
        tabBarInactiveTintColor: '#999',
      }}
    >
      {/* 🏠 Explore / Home */}
      <Tab.Screen
        name="Home"
        component={ExploreHomeScreen}
        options={{
          title: 'Explore',
          headerRight: () => (
            <NotificationBell
              onPress={() => navigation.navigate('Notifications')}
            />
          ),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      {/* ❤️ Saved */}
      <Tab.Screen
        name="Saved"
        component={SavedScreen}
        options={{
          title: 'Saved',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 👤 Profile */}
      <Tab.Screen
        name="Profile"
        component={EditProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 🔔 Notifications */}
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="MyBookings"
        component={MyBookingsScreen}
        options={{
          title: "My Bookings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}