// screens/host/HostBookingAcceptedScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  Image,
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
const BG_WHITE = "#FFFFFF";
const BG_LIGHT = "#F9FAFB";

export default function HostBookingAcceptedScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const {
    guestName = "John Peter",
    checkIn = "Jan 10",
    checkOut = "Jan 15, 2025",
    roomType = "Deluxe King Room",
    roomImage = "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
  } = route.params || {};

  const handleViewSummary = () => {
    // TODO: Navigate to booking summary or close modal
    console.log("View summary");
  };

  const handleHomepage = () => {
    navigation.navigate("HostDashboardScreen");
  };

  const handleViewBookings = () => {
    navigation.navigate("HostBookingsScreen");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.sparkle1}>
            <Ionicons name="sparkles" size={20} color={PRIMARY_DARK} />
          </View>
          <View style={styles.sparkle2}>
            <Ionicons name="sparkles" size={16} color={PRIMARY_DARK} />
          </View>
          <View style={styles.sparkle3}>
            <Ionicons name="sparkles" size={14} color={PRIMARY_DARK} />
          </View>
          <View style={styles.successCircle}>
            <Ionicons name="checkmark" size={80} color={BG_WHITE} />
          </View>
        </View>

        {/* Success Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.successTitle}>Booking accepted!</Text>
          <Text style={styles.successSubtitle}>
            Your guest has been{"\n"}notified.
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

        {/* Booking Details */}
        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Guest Name:</Text>
            <Text style={styles.detailValue}>{guestName}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Stay Duration:</Text>
            <Text style={styles.detailValue}>
              {checkIn} – {checkOut}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Room Type:</Text>
            <Text style={styles.detailValue}>{roomType}</Text>
          </View>
        </View>

        {/* Room Image */}
        <View style={styles.imageSection}>
          <Image
            source={{ uri: roomImage }}
            style={styles.roomImage}
            resizeMode="cover"
          />
          <Text style={styles.roomLabel}>Deluxe double room</Text>
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
            style={styles.viewBookingsButton}
            onPress={handleViewBookings}
            activeOpacity={0.7}
          >
            <Text style={styles.viewBookingsButtonText}>View Bookings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_LIGHT,
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
    position: "relative",
  },
  successCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: PRIMARY_DARK,
    justifyContent: "center",
    alignItems: "center",
  },
  sparkle1: {
    position: "absolute",
    top: 20,
    left: 80,
    zIndex: 1,
  },
  sparkle2: {
    position: "absolute",
    top: 50,
    left: 40,
    zIndex: 1,
  },
  sparkle3: {
    position: "absolute",
    top: 80,
    left: 60,
    zIndex: 1,
  },
  messageContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: TEXT_DARK,
    marginBottom: 12,
  },
  successSubtitle: {
    fontSize: 18,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
    textAlign: "center",
    lineHeight: 26,
  },
  viewSummaryButton: {
    backgroundColor: PRIMARY_DARK,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    alignSelf: "center",
    marginBottom: 48,
  },
  viewSummaryText: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: BG_WHITE,
  },
  detailsSection: {
    gap: 16,
    marginBottom: 32,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 16,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
    width: 140,
  },
  detailValue: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Manrope-Regular",
    color: TEXT_DARK,
  },
  imageSection: {
    marginBottom: 32,
  },
  roomImage: {
    width: "100%",
    height: 280,
    borderRadius: 12,
    backgroundColor: BG_WHITE,
    marginBottom: 12,
  },
  roomLabel: {
    fontSize: 16,
    fontFamily: "Manrope-Regular",
    color: TEXT_DARK,
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
  viewBookingsButton: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 12,
    backgroundColor: PRIMARY_DARK,
    alignItems: "center",
    justifyContent: "center",
  },
  viewBookingsButtonText: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: BG_WHITE,
  },
});
