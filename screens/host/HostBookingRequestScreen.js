// screens/host/HostBookingRequestScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
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
const BORDER_GRAY = "#E5E7EB";
const BG_WHITE = "#FFFFFF";
const BG_LIGHT = "#F9FAFB";

export default function HostBookingRequestScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  // Sample booking request data
  const {
    guestName = "John Peter",
    checkIn = "Jan 10",
    checkOut = "Jan 15, 2025",
    roomType = "Deluxe King Room",
    paymentStatus = "Pending Confirmation",
    roomImage = "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
  } = route.params || {};

  // Timer state (30 minutes = 1800 seconds)
  const [timeRemaining, setTimeRemaining] = useState(1800);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          // Auto-decline when time runs out
          handleAutoDecline();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAutoDecline = () => {
    // TODO: Auto-decline booking
    console.log("Booking auto-declined");
    navigation.goBack();
  };

  const handleAccept = () => {
    // TODO: Accept booking API call
    console.log("Booking accepted");
    navigation.navigate("HostBookingAcceptedScreen", {
      guestName,
      checkIn,
      checkOut,
      roomType,
      roomImage,
    });
  };

  const handleReject = () => {
    // TODO: Reject booking API call
    console.log("Booking rejected");
    navigation.navigate("HostBookingDeclinedScreen", {
      guestName,
      checkIn,
      checkOut,
      roomType,
    });
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={28} color={TEXT_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Request Page</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
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

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment Status:</Text>
            <Text style={styles.detailValue}>{paymentStatus}</Text>
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

        {/* Timer Section */}
        <View style={styles.timerSection}>
          <View style={styles.timerLeft}>
            <Text style={styles.timerTitle}>Please respond</Text>
            <Text style={styles.timerSubtitle}>
              Before the time runs up and{"\n"}automatically declines it
            </Text>
          </View>
          <View style={styles.timerRight}>
            <Text style={styles.timerText}>
              {formatTime(timeRemaining)}
              <Text style={styles.timerMinText}>min</Text>
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.rejectButton}
            onPress={handleReject}
            activeOpacity={0.7}
          >
            <Text style={styles.rejectButtonText}>Reject</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.acceptButton}
            onPress={handleAccept}
            activeOpacity={0.7}
          >
            <Text style={styles.acceptButtonText}>Accept</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_WHITE,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_GRAY,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: TEXT_DARK,
  },
  headerPlaceholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  detailsSection: {
    marginTop: 24,
    gap: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 16,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
    width: 150,
  },
  detailValue: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Manrope-Regular",
    color: TEXT_DARK,
  },
  imageSection: {
    marginTop: 32,
  },
  roomImage: {
    width: "100%",
    height: 280,
    borderRadius: 12,
    backgroundColor: BG_LIGHT,
    marginBottom: 12,
  },
  roomLabel: {
    fontSize: 16,
    fontFamily: "Manrope-Regular",
    color: TEXT_DARK,
  },
  timerSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 32,
    padding: 20,
    backgroundColor: BG_LIGHT,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
  },
  timerLeft: {
    flex: 1,
  },
  timerTitle: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: TEXT_DARK,
    marginBottom: 8,
  },
  timerSubtitle: {
    fontSize: 13,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
    lineHeight: 18,
  },
  timerRight: {
    backgroundColor: PRIMARY_DARK,
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderRadius: 12,
    marginLeft: 16,
  },
  timerText: {
    fontSize: 36,
    fontWeight: "700",
    fontFamily: "Manrope-Bold",
    color: BG_WHITE,
  },
  timerMinText: {
    fontSize: 18,
    fontWeight: "400",
    fontFamily: "Manrope-Regular",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 16,
    marginTop: 40,
  },
  rejectButton: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: PRIMARY_DARK,
    backgroundColor: BG_WHITE,
    alignItems: "center",
    justifyContent: "center",
  },
  rejectButtonText: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: TEXT_DARK,
  },
  acceptButton: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 12,
    backgroundColor: PRIMARY_DARK,
    alignItems: "center",
    justifyContent: "center",
  },
  acceptButtonText: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: BG_WHITE,
  },
});
