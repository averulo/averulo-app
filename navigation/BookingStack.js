import { createNativeStackNavigator } from "@react-navigation/native-stack";

import BookingFormScreen from "../screens/BookingFormScreen"; // (Your figma booking form / current MyBookingsScreen)
import BookingSuccessScreen from "../screens/BookingSuccessScreen";
import ConfirmRoomScreen from "../screens/ConfirmRoomScreen";
import PaymentScreen from "../screens/PaymentScreen";

const Stack = createNativeStackNavigator();

export default function BookingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BookingForm" component={BookingFormScreen} />
      <Stack.Screen name="ConfirmRoom" component={ConfirmRoomScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="BookingSuccess" component={BookingSuccessScreen} />
    </Stack.Navigator>
  );
}