import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PRIMARY = "#000A63";
const MUTED = "#6B7280";

export default function BookingSuccessScreen() {
  const navigation = useNavigation();
  const [timer, setTimer] = useState(900); // 15 minutes in seconds
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    // Simulate booking confirmation after 3 seconds
    const confirmTimeout = setTimeout(() => {
      setConfirmed(true);
    }, 3000);

    // Start countdown timer
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(confirmTimeout);
      clearInterval(interval);
    };
  }, []);

  // Format timer to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* CLOSE BUTTON */}
        <TouchableOpacity
          onPress={() => navigation.navigate("MainTabs")}
          style={styles.closeBtn}
        >
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>

        {/* HEADER */}
        <Text style={styles.header}>Booking in Progress...</Text>
        <Text style={styles.subheader}>
          We are processing your service. Please wait while the hotel confirms
          availability.
        </Text>

        {/* PROGRESS BAR */}
        <View style={styles.progressContainer}>
          <View style={styles.progressSteps}>
            <View style={styles.stepWrapper}>
              <Text
                style={[
                  styles.stepLabel,
                  styles.stepLabelActive,
                ]}
              >
                Request{"\n"}sent
              </Text>
            </View>

            <View style={styles.stepWrapper}>
              <Text
                style={[
                  styles.stepLabel,
                  confirmed && styles.stepLabelActive,
                ]}
              >
                Awaiting{"\n"}confirmation
              </Text>
            </View>

            <View style={styles.stepWrapper}>
              <Text
                style={[
                  styles.stepLabel,
                  confirmed && styles.stepLabelActive,
                ]}
              >
                Finalizing{"\n"}booking
              </Text>
            </View>
          </View>

          {/* Progress Bar Line */}
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                confirmed
                  ? styles.progressBarComplete
                  : styles.progressBarPartial,
              ]}
            />
          </View>
        </View>

        {/* PLEASE WAIT SECTION */}
        <View style={styles.waitSection}>
          <View style={styles.waitTextContainer}>
            <Text style={styles.waitTitle}>Please wait</Text>
            <Text style={styles.waitSubtitle}>
              We are processing your service
            </Text>
          </View>

          <View style={styles.timerBox}>
            <Text style={styles.timerText}>{formatTime(timer)}</Text>
            <Text style={styles.timerLabel}>min</Text>
          </View>
        </View>

        {/* REQUEST ACCEPTED TEXT */}
        <Text style={styles.requestAcceptedText}>
          Request accepted within 15min
        </Text>

        {/* CONFIRMATION OR WAITING MESSAGE */}
        {confirmed ? (
          <View style={styles.successBox}>
            <View style={styles.iconCircle}>
              <Ionicons name="checkmark" size={24} color="#fff" />
            </View>

            <Text style={styles.successText}>
              Congratulations! Your Booking is Confirmed
            </Text>
          </View>
        ) : (
          <View style={styles.waitingOptions}>
            <TouchableOpacity style={styles.waitingButton}>
              <Text style={styles.waitingButtonText}>
                Wait for the host to accept
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.chooseAnotherButton}
              onPress={() => navigation.navigate("MainTabs")}
            >
              <Text style={styles.chooseAnotherText}>Choose another hotel</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* FIXED FOOTER BUTTONS */}
      <View style={styles.footer}>
        <View style={styles.bottomRow}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation.navigate("MainTabs")}
          >
            <Text style={styles.editText}>Homepage</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.viewBtn}
            onPress={() => navigation.navigate("MyBookingsScreen")}
          >
            <Text style={styles.viewText}>View Booking</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* ----------------------------------------------- */
/* --------------------- STYLES ------------------ */
/* ----------------------------------------------- */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  scrollContent: {
    paddingTop: 60,
    paddingBottom: 120,
    paddingHorizontal: 20,
  },

  closeBtn: {
    position: "absolute",
    top: 10,
    left: 20,
    padding: 10,
    zIndex: 99,
  },

  header: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Manrope-Bold",
    marginBottom: 8,
    color: "#111",
  },

  subheader: {
    fontSize: 13,
    color: MUTED,
    lineHeight: 18,
    marginBottom: 30,
    fontFamily: "Manrope-Regular",
  },

  // Progress Bar Styles
  progressContainer: {
    marginBottom: 30,
  },

  progressSteps: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  stepWrapper: {
    flex: 1,
    alignItems: "center",
  },

  stepLabel: {
    fontSize: 11,
    color: MUTED,
    textAlign: "center",
    lineHeight: 14,
    fontFamily: "Manrope-Regular",
  },

  stepLabelActive: {
    color: "#111",
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
  },

  progressBarContainer: {
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    backgroundColor: PRIMARY,
    borderRadius: 2,
  },

  progressBarPartial: {
    width: "33%",
  },

  progressBarComplete: {
    width: "100%",
  },

  // Wait Section
  waitSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },

  waitTextContainer: {
    flex: 1,
  },

  waitTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    marginBottom: 4,
    fontFamily: "Manrope-Bold",
  },

  waitSubtitle: {
    fontSize: 12,
    color: MUTED,
    fontFamily: "Manrope-Regular",
  },

  timerBox: {
    backgroundColor: PRIMARY,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "baseline",
  },

  timerText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    fontFamily: "Manrope-Bold",
  },

  timerLabel: {
    fontSize: 14,
    color: "#fff",
    marginLeft: 4,
    fontFamily: "Manrope-Regular",
  },

  requestAcceptedText: {
    textAlign: "center",
    color: MUTED,
    fontSize: 13,
    marginBottom: 20,
    fontFamily: "Manrope-Regular",
  },

  // Success Box
  successBox: {
    backgroundColor: "#F4F6FB",
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  successText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
    fontFamily: "Manrope-SemiBold",
  },

  // Waiting Options
  waitingOptions: {
    gap: 12,
  },

  waitingButton: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
  },

  waitingButtonText: {
    fontSize: 14,
    color: "#111",
    fontFamily: "Manrope-Medium",
  },

  chooseAnotherButton: {
    alignItems: "center",
    paddingVertical: 12,
  },

  chooseAnotherText: {
    fontSize: 14,
    color: PRIMARY,
    fontFamily: "Manrope-Medium",
    textDecorationLine: "underline",
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 35,
    paddingTop: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },

  bottomRow: {
    flexDirection: "row",
    gap: 14,
  },

  editBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: PRIMARY,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
  },

  editText: {
    color: PRIMARY,
    fontWeight: "700",
    fontSize: 15,
    fontFamily: "Manrope-Bold",
  },

  viewBtn: {
    flex: 1,
    backgroundColor: PRIMARY,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
  },

  viewText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    fontFamily: "Manrope-Bold",
  },
});
