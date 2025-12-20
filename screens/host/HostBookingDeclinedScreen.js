// screens/host/HostBookingDeclinedScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY_DARK = "#04123C";
const TEXT_DARK = "#1F2937";
const TEXT_MEDIUM = "#6B7280";
const TEXT_LIGHT = "#9CA3AF";
const BG_PINK = "#FEE2E2";
const BG_WHITE = "#FFFFFF";
const RED = "#DC2626";

export default function HostBookingDeclinedScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const {
    guestName = "John Peter",
    checkIn = "Jan 10",
    checkOut = "Jan 15, 2025",
    roomType = "Deluxe King Room",
  } = route.params || {};

  const [selectedReason, setSelectedReason] = useState(null);

  const reasons = [
    { id: 1, text: "Sorry, those dates are no longer available." },
    { id: 2, text: "Your group size exceeds our maximum capacity." },
    { id: 3, text: "Unable to meet your check-in time preferences." },
    {
      id: 4,
      text: "Property is undergoing maintenance during your requested dates.",
    },
    { id: 5, text: "Those dates unavailable, but I have other dates open." },
  ];

  const handleViewSummary = () => {
    // TODO: Navigate to booking summary
    console.log("View summary");
  };

  const handleHomepage = () => {
    navigation.navigate("HostDashboardScreen");
  };

  const handleNewBooking = () => {
    navigation.navigate("HostBookingsScreen");
  };

  const handleOthers = () => {
    // TODO: Open text input for custom reason
    console.log("Add custom reason");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Error Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.errorCircle}>
            <Ionicons name="close" size={100} color={BG_WHITE} />
          </View>
        </View>

        {/* Error Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.errorTitle}>
            Booking declined. The{"\n"}guest has been{"\n"}notified.
          </Text>
        </View>

        {/* View Summary Button */}
        <TouchableOpacity
          style={styles.viewSummaryButton}
          onPress={handleViewSummary}
          activeOpacity={0.8}
        >
          <Text style={styles.viewSummaryText}>View Summary</Text>
        </TouchableOpacity>

        {/* Reason Selection */}
        <View style={styles.reasonSection}>
          <Text style={styles.reasonTitle}>
            Select Reason (will be sent to client)
          </Text>

          {reasons.map((reason) => (
            <TouchableOpacity
              key={reason.id}
              style={[
                styles.reasonCard,
                selectedReason === reason.id && styles.reasonCardSelected,
              ]}
              onPress={() => setSelectedReason(reason.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.reasonText}>{reason.text}</Text>
            </TouchableOpacity>
          ))}

          {/* Others Button */}
          <TouchableOpacity
            style={styles.othersButton}
            onPress={handleOthers}
            activeOpacity={0.7}
          >
            <Text style={styles.othersButtonText}>Others</Text>
            <Ionicons name="add" size={20} color={TEXT_MEDIUM} />
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.homepageButton}
            onPress={handleHomepage}
            activeOpacity={0.7}
          >
            <Text style={styles.homepageButtonText}>Homepage</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.newBookingButton}
            onPress={handleNewBooking}
            activeOpacity={0.7}
          >
            <Text style={styles.newBookingButtonText}>New Booking</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_PINK,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
    marginBottom: 32,
  },
  errorCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: RED,
    justifyContent: "center",
    alignItems: "center",
  },
  messageContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "400",
    fontFamily: "Manrope-Regular",
    color: TEXT_DARK,
    textAlign: "center",
    lineHeight: 34,
  },
  viewSummaryButton: {
    backgroundColor: "#9CA3AF",
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    alignSelf: "center",
    marginBottom: 48,
  },
  viewSummaryText: {
    fontSize: 18,
    fontWeight: "400",
    fontFamily: "Manrope-Regular",
    color: BG_WHITE,
  },
  reasonSection: {
    marginBottom: 32,
  },
  reasonTitle: {
    fontSize: 18,
    fontWeight: "400",
    fontFamily: "Manrope-Regular",
    color: TEXT_DARK,
    marginBottom: 20,
  },
  reasonCard: {
    backgroundColor: BG_WHITE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 18,
    marginBottom: 12,
  },
  reasonCardSelected: {
    borderColor: PRIMARY_DARK,
    borderWidth: 2,
  },
  reasonText: {
    fontSize: 15,
    fontFamily: "Manrope-Regular",
    color: TEXT_DARK,
    lineHeight: 22,
  },
  othersButton: {
    backgroundColor: BG_WHITE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 130,
  },
  othersButtonText: {
    fontSize: 15,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 16,
  },
  homepageButton: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: PRIMARY_DARK,
    backgroundColor: BG_WHITE,
    alignItems: "center",
    justifyContent: "center",
  },
  homepageButtonText: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: TEXT_DARK,
  },
  newBookingButton: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 12,
    backgroundColor: PRIMARY_DARK,
    alignItems: "center",
    justifyContent: "center",
  },
  newBookingButtonText: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: BG_WHITE,
  },
});
