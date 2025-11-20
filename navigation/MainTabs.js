// navigation/MainTabs.js
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/HomeScreen";
import MyBookingsScreen from "../screens/MyBookingsScreen";
import NotificationsScreen from "../screens/NotificationsScreen"; // temporary Chat screen
import PropertiesListScreen from "../screens/PropertiesListScreen"; // ✅ Explore

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#000A63",
        tabBarInactiveTintColor: "#9CA3AF",
      }}
    >
      {/* 🏠 Home */}
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 🔍 Explore */}
      <Tab.Screen
        name="ExploreTab"
        component={PropertiesListScreen}  // ← FIXED
        options={{
          title: "Explore",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 📅 Booking */}
      <Tab.Screen
        name="BookingTab"
        component={MyBookingsScreen}
        options={{
          title: "Booking",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 💬 Chat */}
      <Tab.Screen
        name="ChatTab"
        component={NotificationsScreen} // temporary until Chat is built
        options={{
          title: "Chat",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-ellipses-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}