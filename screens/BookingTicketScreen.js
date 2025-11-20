// screens/BookingTicketScreen.js
import { useNavigation, useRoute } from "@react-navigation/native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY_DARK = "#000A63";
const BORDER_COLOR = "#E5E7EB";

export default function BookingTicketScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const {
    booking,
    property,
    guestName,
    checkIn,
    checkOut,
  } = route.params || {};

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* TICKET CARD */}
        <View style={styles.card}>
          {/* AVERULO LOGO BADGE */}
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>AVERULO</Text>
          </View>

          {/* GUEST NAME */}
          <Text style={styles.guestName}>
            {guestName || "John Peter"}
          </Text>

          {/* BOOKING ID BOX */}
          <View style={styles.bookingIdBox}>
            <Text style={styles.bookingIdLabel}>Booking ID:</Text>
            <Text style={styles.bookingIdValue}>
              {booking?.bookingCode || booking?.id || "495060735"}
            </Text>
          </View>

          {/* DATES */}
          <Text style={styles.dates}>
            {checkIn || "10/12/2024"} | {checkOut || "15/6/2024"}
          </Text>

          {/* ROOM TYPE */}
          <Text style={styles.roomType}>
            {property?.roomType || property?.title || "Deluxe Double room"}
          </Text>
        </View>

        {/* CLOSE BUTTON (optional) */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.navigate("MainTabs")}
        >
          <Text style={styles.closeButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PRIMARY_DARK,
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    paddingTop: 32,
    width: "100%",
    maxWidth: 360,
    position: "relative",
  },

  logoBadge: {
    position: "absolute",
    top: 24,
    right: 24,
    backgroundColor: PRIMARY_DARK,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },

  logoText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "Manrope-Bold",
    letterSpacing: 0.5,
  },

  guestName: {
    fontSize: 28,
    fontWeight: "700",
    fontFamily: "Manrope-Bold",
    color: "#111",
    marginBottom: 20,
  },

  bookingIdBox: {
    borderWidth: 1.5,
    borderColor: BORDER_COLOR,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },

  bookingIdLabel: {
    fontSize: 13,
    color: "#6B7280",
    fontFamily: "Manrope-Regular",
    marginBottom: 4,
  },

  bookingIdValue: {
    fontSize: 22,
    fontWeight: "700",
    fontFamily: "Manrope-Bold",
    color: "#111",
    letterSpacing: 0.5,
  },

  dates: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Manrope-Medium",
    color: "#111",
    marginBottom: 12,
  },

  roomType: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Manrope-Medium",
    color: "#111",
  },

  closeButton: {
    marginTop: 40,
    paddingVertical: 14,
    paddingHorizontal: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
  },

  closeButtonText: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Manrope-Bold",
    color: PRIMARY_DARK,
  },
});
