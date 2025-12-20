import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Design colors
const PRIMARY_DARK = "#04123C";
const TEXT_DARK = "#012232";
const TEXT_MEDIUM = "#3E5663";
const TEXT_LIGHT = "#5F737D";
const TEXT_GRAY = "#0F3040";
const BG_BLUE = "#EDF4F7";
const BG_WHITE = "#FCFEFE";
const BG_GRAY = "#F1F3F4";
const BORDER_GRAY = "#D4DADC";
const ERROR_RED = "#EF4444";

export default function BookingCancelledScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const { property, booking, checkIn, checkOut } = route.params || {};

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER BAR */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={() => navigation.navigate("MainTabs")}
          style={styles.closeBtn}
        >
          <Text style={styles.closeIcon}>×</Text>
        </TouchableOpacity>
      </View>

      {/* SCROLLING CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* TITLE & SUBTITLE */}
        <View style={styles.titleContainer}>
          <Text style={styles.header}>Booking Cancelled</Text>
          <Text style={styles.subheader}>
            We are so sorry to remove your service because the most is failed
          </Text>
        </View>

        {/* INFO SECTION WITH LIGHT BLUE BACKGROUND */}
        <View style={styles.infoSection}>
          {/* THREE INFO BOXES */}
          <View style={styles.infoRow}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Restart</Text>
              <Text style={styles.infoValue}>date</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Pending</Text>
              <Text style={styles.infoValue}>confirmation</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Prolonged</Text>
              <Text style={styles.infoValue}>booking</Text>
            </View>
          </View>

          {/* TIMER STRIP */}
          <View style={styles.timerStrip}>
            <View style={styles.timerTextCard}>
              <Text style={styles.timerTitle}>Please wait</Text>
              <Text style={styles.timerSubtitle}>
                We are processing you service
              </Text>
            </View>
            <View style={styles.timerNumberCard}>
              <Text style={styles.timerNumber}>00:00</Text>
              <Text style={styles.timerUnit}>min</Text>
            </View>
          </View>
        </View>

        {/* ERROR MESSAGE */}
        <View style={styles.errorBox}>
          <View style={styles.errorIconCircle}>
            <Text style={styles.errorIcon}>×</Text>
          </View>
          <Text style={styles.errorText}>Sorry! Your Booking was Cancelled</Text>
        </View>
      </ScrollView>

      {/* FIXED FOOTER BUTTONS */}
      <View style={styles.footer}>
        <View style={styles.bottomRow}>
          <TouchableOpacity
            style={styles.homepageBtn}
            onPress={() => navigation.navigate("MainTabs")}
          >
            <Text style={styles.homepageText}>Homepage</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.newBookingBtn}
            onPress={() => navigation.navigate("SearchScreen")}
          >
            <Text style={styles.newBookingText}>New Booking</Text>
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
    paddingBottom: 120,
  },

  titleContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 4,
    marginBottom: 24,
  },

  header: {
    fontFamily: "Manrope-Medium",
    fontWeight: "500",
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.36,
    color: TEXT_DARK,
  },

  subheader: {
    fontFamily: "Manrope-Light",
    fontWeight: "300",
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.24,
    color: TEXT_MEDIUM,
  },

  infoSection: {
    backgroundColor: BG_BLUE,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 24,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 12,
  },

  infoBox: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },

  infoLabel: {
    fontFamily: "Manrope-SemiBold",
    fontWeight: "600",
    fontSize: 12,
    lineHeight: 16,
    color: TEXT_DARK,
    textAlign: "center",
  },

  infoValue: {
    fontFamily: "Manrope-Regular",
    fontWeight: "400",
    fontSize: 12,
    lineHeight: 16,
    color: TEXT_MEDIUM,
    textAlign: "center",
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
    fontFamily: "Manrope-SemiBold",
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 16,
    color: TEXT_GRAY,
  },

  timerSubtitle: {
    fontFamily: "Manrope-Regular",
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
    minWidth: 120,
    height: 72,
    backgroundColor: PRIMARY_DARK,
    borderRadius: 8,
  },

  timerNumber: {
    fontFamily: "Manrope-SemiBold",
    fontWeight: "700",
    fontSize: 28,
    lineHeight: 28,
    color: BG_WHITE,
    textAlign: "center",
  },

  timerUnit: {
    fontFamily: "Manrope-Regular",
    fontWeight: "400",
    fontSize: 12,
    lineHeight: 12,
    color: BG_WHITE,
    textAlign: "center",
    marginTop: 2,
  },

  errorBox: {
    marginHorizontal: 16,
    marginTop: 32,
    backgroundColor: "#FEF2F2",
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FECACA",
  },

  errorIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: ERROR_RED,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  errorIcon: {
    fontSize: 32,
    fontWeight: "300",
    color: "#FFFFFF",
    lineHeight: 32,
  },

  errorText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: ERROR_RED,
    fontFamily: "Manrope-SemiBold",
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
    borderTopWidth: 1,
    borderTopColor: BORDER_GRAY,
  },

  bottomRow: {
    flexDirection: "row",
    gap: 12,
    height: 56,
  },

  homepageBtn: {
    flex: 1,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: PRIMARY_DARK,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },

  homepageText: {
    fontFamily: "Manrope-SemiBold",
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 24,
    color: PRIMARY_DARK,
    textAlign: "center",
  },

  newBookingBtn: {
    flex: 1,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: PRIMARY_DARK,
    borderRadius: 8,
  },

  newBookingText: {
    fontFamily: "Manrope-SemiBold",
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 24,
    color: BG_WHITE,
    textAlign: "center",
  },
});
