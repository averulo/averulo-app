import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import ExploreHomeScreen from '../screens/ExploreHomeScreen'; // ✅ import this

const Tab = createBottomTabNavigator();

function PlaceholderScreen({ label }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{label}</Text>
    </View>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#000A63',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Explore') iconName = 'home';
          else if (route.name === 'Bookings') iconName = 'calendar';
          else if (route.name === 'Chat') iconName = 'chatbubble';
          else if (route.name === 'Profile') iconName = 'person';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* 👇 Now Explore tab points to your real ExploreHomeScreen */}
      <Tab.Screen name="Explore" component={ExploreHomeScreen} />  
      <Tab.Screen name="Bookings" children={() => <PlaceholderScreen label="Bookings Page" />} />
      <Tab.Screen name="Chat" children={() => <PlaceholderScreen label="Chat Page" />} />
      <Tab.Screen name="Profile" children={() => <PlaceholderScreen label="Profile Page" />} />
    </Tab.Navigator>
  );
}