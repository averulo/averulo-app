import { useNavigation, useRoute } from "@react-navigation/native";
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

// Design colors from spec
const PRIMARY_DARK = "#04123C";     // 50% purple Primary
const PRIMARY_BLUE = "#004A6C";     // 80% blue
const BORDER_PURPLE = "#90A1D6";    // 20% purple
const TEXT_DARK = "#012232";        // 80% Gray
const TEXT_MEDIUM = "#3E5663";      // 50% Gray
const TEXT_LIGHT = "#5F737D";       // 40% Gray
const TEXT_GRAY = "#0F3040";        // 70% Gray
const BG_BLUE = "#EDF4F7";          // 1% blue
const BG_WHITE = "#FCFEFE";         // 10% Gray
const BG_GRAY = "#F1F3F4";          // 15% Gray
const BORDER_GRAY = "#D4DADC";      // 20% Gray

export default function BookingInProgressScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const {
    bookingId,
    property,
    booking,
    checkIn,
    checkOut,
    guestName,
    email,
    phone,
    notes,
  } = route.params || {};

  const propertyName = property?.title || "the hotel";

  const [stage, setStage] = useState(1);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
  const [confirmed, setConfirmed] = useState(false);

  // COUNTDOWN
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // FAKE STAGES - simulate booking confirmation
  useEffect(() => {
    setTimeout(() => setStage(2), 2000);
    setTimeout(() => {
      setStage(3);
      setConfirmed(true);
    }, 5000);
  }, []);

  const formatTime = () => {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}min`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER BAR */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Text style={styles.closeIcon}>×</Text>
        </TouchableOpacity>
      </View>

      {/* TOP SCROLLING CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* TITLE & SUBTITLE */}
        <View style={styles.titleContainer}>
          <Text style={styles.header}>Booking in Progress...</Text>
          <Text style={styles.subheader}>
            We are processing your service. Please wait while the hotel confirms availability.
          </Text>
        </View>

        {/* PROGRESS SECTION WITH LIGHT BLUE BACKGROUND */}
        <View style={styles.progressSection}>
          <View style={styles.progressContent}>
            {/* PROGRESS LABELS */}
            <View style={styles.progressLabels}>
              <Text style={stage >= 1 ? styles.activeLabel : styles.label}>
                Request{'\n'}sent
              </Text>
              <Text style={stage >= 2 ? styles.activeLabel : styles.label}>
                Awaiting{'\n'}confirmation
              </Text>
              <Text style={stage >= 3 ? styles.activeLabel : styles.label}>
                Finalizing{'\n'}booking
              </Text>
            </View>

            {/* PROGRESS BAR WITH DOTS AND LINES */}
            <View style={styles.progressBar}>
              {/* First dot - rounded on left */}
              <View style={[styles.progressDotFirst, stage >= 1 && styles.activeDot]} />

              {/* First line */}
              <View style={[styles.progressLine, stage >= 2 && styles.activeLine]} />

              {/* Second dot - no rounding */}
              <View style={[styles.progressDotMiddle, stage >= 2 && styles.activeDot]} />

              {/* Second line */}
              <View style={[styles.progressLine, stage >= 3 && styles.activeLine]} />

              {/* Third dot - rounded on right */}
              <View style={[styles.progressDotLast, stage >= 3 && styles.activeDot]} />
            </View>
          </View>

          {/* TIMER STRIP */}
          <View style={styles.timerStrip}>
            <View style={styles.timerTextCard}>
              <Text style={styles.timerTitle}>Please wait</Text>
              <Text style={styles.timerSubtitle}>We are processing your service</Text>
            </View>
            <View style={styles.timerNumberCard}>
              <Text style={styles.timerNumber}>{formatTime()}</Text>
            </View>
          </View>
        </View>

        {/* STATUS CAPTION */}
        <Text style={styles.statusCaption}>Request accepted within 15min</Text>

        {/* WAITING OR CONFIRMED STATE */}
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
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.viewBtn}
            onPress={() =>
              navigation.navigate("BookingTicketScreen", {
                property,
                booking,
                checkIn,
                checkOut,
                guestName,
                email,
                phone,
                notes,
              })
            }
          >
            <Text style={styles.viewText}>View Booking</Text>
          </TouchableOpacity>
        </View>
      </View>

    </SafeAreaView>
  );
}

/* -------------------------------------------------- */
/* ----------------------- STYLES -------------------- */
/* -------------------------------------------------- */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  headerBar: {
    height: 52,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 0.4,
    borderBottomColor: BORDER_GRAY,
    justifyContent: "center",
    paddingHorizontal: 16,
  },

  closeBtn: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  closeIcon: {
    fontSize: 24,
    fontWeight: "400",
    color: TEXT_GRAY,
    lineHeight: 24,
  },

  scrollContent: {
    paddingBottom: 100,
  },

  titleContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 4,
    marginBottom: 24,
  },

  header: {
    fontFamily: "Manrope",
    fontWeight: "500",
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.36,
    color: TEXT_DARK,
  },

  subheader: {
    fontFamily: "Manrope",
    fontWeight: "300",
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.24,
    color: TEXT_MEDIUM,
  },

  progressSection: {
    backgroundColor: BG_BLUE,
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 48,
    marginTop: 0,
  },

  progressContent: {
    marginBottom: 48,
  },

  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },

  label: {
    fontFamily: "Manrope",
    fontWeight: "400",
    fontSize: 12,
    lineHeight: 12,
    letterSpacing: -0.24,
    color: TEXT_LIGHT,
    flex: 1,
    textAlign: "center",
  },

  activeLabel: {
    fontFamily: "Manrope",
    fontWeight: "700",
    fontSize: 12,
    lineHeight: 12,
    letterSpacing: -0.24,
    color: TEXT_MEDIUM,
    flex: 1,
    textAlign: "center",
  },

  progressBar: {
    flexDirection: "row",
    alignItems: "center",
    height: 12,
  },

  progressDotFirst: {
    width: 9,
    height: 12,
    backgroundColor: BG_WHITE,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },

  progressDotMiddle: {
    width: 9,
    height: 12,
    backgroundColor: BG_WHITE,
    borderRadius: 0,
  },

  progressDotLast: {
    width: 9,
    height: 12,
    backgroundColor: BG_WHITE,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },

  activeDot: {
    backgroundColor: PRIMARY_BLUE,
  },

  progressLine: {
    flex: 1,
    height: 12,
    backgroundColor: BG_WHITE,
  },

  activeLine: {
    backgroundColor: PRIMARY_BLUE,
  },

  timerStrip: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
    paddingLeft: 8,
    gap: 8,
    height: 80,
    backgroundColor: BG_WHITE,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 8,
  },

  timerTextCard: {
    flex: 1,
    justifyContent: "center",
    gap: 4,
  },

  timerTitle: {
    fontFamily: "Manrope",
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 16,
    color: TEXT_GRAY,
  },

  timerSubtitle: {
    fontFamily: "Manrope",
    fontWeight: "400",
    fontSize: 12,
    lineHeight: 12,
    color: TEXT_MEDIUM,
  },

  timerNumberCard: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    minWidth: 140,
    height: 72,
    backgroundColor: PRIMARY_DARK,
    borderRadius: 8,
  },

  timerNumber: {
    fontFamily: "Manrope",
    fontWeight: "700",
    fontSize: 28,
    lineHeight: 28,
    color: BG_WHITE,
    textAlign: "center",
  },

  statusCaption: {
    fontFamily: "Manrope",
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 32,
    textAlign: "center",
    color: TEXT_GRAY,
    marginTop: 48,
    marginBottom: 16,
  },

  // Success Box
  successBox: {
    marginHorizontal: 16,
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
    backgroundColor: PRIMARY_DARK,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  successText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
    fontFamily: "Manrope",
  },

  // Waiting Options
  waitingOptions: {
    marginHorizontal: 16,
    gap: 12,
  },

  waitingButton: {
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#fff",
  },

  waitingButtonText: {
    fontSize: 14,
    color: "#111",
    fontFamily: "Manrope",
    fontWeight: "500",
  },

  chooseAnotherButton: {
    alignItems: "center",
    paddingVertical: 12,
  },

  chooseAnotherText: {
    fontSize: 14,
    color: PRIMARY_DARK,
    fontFamily: "Manrope",
    fontWeight: "500",
    textDecorationLine: "underline",
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 40,
    paddingTop: 16,
    backgroundColor: "#FFFFFF",
  },

  bottomRow: {
    flexDirection: "row",
    gap: 8,
    height: 56,
  },

  editBtn: {
    width: 66,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: BORDER_PURPLE,
    borderRadius: 8,
  },

  editText: {
    fontFamily: "Manrope",
    fontWeight: "600",
    fontSize: 18,
    lineHeight: 24,
    color: "#010F1D",
    textAlign: "center",
  },

  viewBtn: {
    flex: 1,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: PRIMARY_DARK,
    borderRadius: 8,
    paddingHorizontal: 16,
  },

  viewText: {
    fontFamily: "Manrope",
    fontWeight: "600",
    fontSize: 18,
    lineHeight: 24,
    color: BG_WHITE,
    textAlign: "center",
  },
});