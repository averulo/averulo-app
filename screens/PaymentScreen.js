// screens/PaymentScreen.js
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const PRIMARY = "#000A63";

export default function PaymentScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const {
    bookingId,
    totalAmount,
    property,
    booking,
    checkIn,
    checkOut,
    guestName,
    email,
    phone,
    notes,
  } = route.params || {};

  useEffect(() => {
    // simulate payment delay
    const timeout = setTimeout(() => {
      navigation.replace("BookingInProgressScreen", {
        bookingId,
        property,
        booking,
        checkIn,
        checkOut,
        guestName,
        email,
        phone,
        notes,
      });
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={PRIMARY} />
      <Text style={styles.title}>Processing Payment...</Text>
      <Text style={styles.sub}>Please wait while we confirm your payment…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 20, fontWeight: "700", marginTop: 20 },
  sub: { marginTop: 5, fontSize: 14, color: "#666" },
});