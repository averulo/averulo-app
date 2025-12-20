// screens/ProfileScreen.js
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../hooks/useAuth";

const PRIMARY_DARK = "#04123C";
const TEXT_DARK = "#1F2937";
const TEXT_MEDIUM = "#6B7280";
const TEXT_LIGHT = "#9CA3AF";
const BORDER_GRAY = "#E5E7EB";
const LIGHT_BLUE = "#EFF6FF";
const BADGE_BG = "#3B82F6";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user, signOut } = useAuth();

  const [bookingsCount] = useState(3); // This would come from API
  const [showHostApprovalBanner, setShowHostApprovalBanner] = useState(true); // Show when host gets approved

  const userName = user?.name || "John Doe";
  const userEmail = user?.email || "JohnDoe@email.com";
  const isHost = user?.role === "HOST" || user?.role === "ADMIN";

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Ionicons name="home" size={28} color={TEXT_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate("SettingsScreen")}>
          <Ionicons name="settings-outline" size={28} color={TEXT_DARK} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Host Approval Banner */}
        {showHostApprovalBanner && (
          <TouchableOpacity
            style={styles.approvalBanner}
            onPress={() => {
              setShowHostApprovalBanner(false);
              navigation.navigate("HostWelcomeScreen");
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.approvalBannerText}>
              Host account has been approved and can switch to host part
            </Text>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                setShowHostApprovalBanner(false);
              }}
            >
              <Ionicons name="close" size={20} color={TEXT_DARK} />
            </TouchableOpacity>
          </TouchableOpacity>
        )}

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={{
              uri: user?.avatar || "https://i.pravatar.cc/150?img=12",
            }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userEmail}>{userEmail}</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate("EditProfileScreen")}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Switch to Host Card - Only show for non-hosts */}
        {!isHost && (
          <View style={styles.switchToHostCard}>
            <View style={styles.switchToHostContent}>
              <Text style={styles.switchToHostText}>
                Switch to Host Profile to begin accepting bookings
              </Text>
              <TouchableOpacity
                style={styles.switchToHostButton}
                onPress={() => navigation.navigate("BecomeHostScreen")}
              >
                <Text style={styles.switchToHostButtonText}>Switch to Host</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* My Bookings */}
        <TouchableOpacity
          style={styles.bookingsCard}
          onPress={() => navigation.navigate("MainTabs", { screen: "BookingTab" })}
        >
          <View style={styles.bookingsLeft}>
            <Text style={styles.bookingsText}>My Bookings</Text>
            {bookingsCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{bookingsCount}</Text>
              </View>
            )}
          </View>
          <Ionicons name="chevron-forward" size={20} color={TEXT_LIGHT} />
        </TouchableOpacity>

        {/* My Profile Section */}
        <Text style={styles.sectionTitle}>My Profile</Text>

        <View style={styles.menuCard}>
          <MenuItem
            icon="person-outline"
            label="Personal Information"
            onPress={() => navigation.navigate("EditProfileScreen")}
          />
          <MenuItem
            icon="ticket-outline"
            label="My Coupons"
            onPress={() => {}}
          />
          <MenuItem
            icon="star-outline"
            label="Reviews & Ratings"
            onPress={() => {}}
          />
          <MenuItem
            icon="card-outline"
            label="Payment & Billing"
            onPress={() => {}}
          />
          <MenuItem
            icon="help-circle-outline"
            label="Support & Legal"
            onPress={() => {}}
            showDivider={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuItem({ icon, label, onPress, showDivider = true }) {
  return (
    <>
      <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <View style={styles.menuLeft}>
          <Ionicons name={icon} size={22} color={TEXT_MEDIUM} />
          <Text style={styles.menuLabel}>{label}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={TEXT_LIGHT} />
      </TouchableOpacity>
      {showDivider && <View style={styles.divider} />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_GRAY,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: TEXT_DARK,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E5E7EB",
  },
  profileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: TEXT_DARK,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    backgroundColor: "#FAFAFA",
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: "500",
    fontFamily: "Manrope-Medium",
    color: TEXT_DARK,
  },
  switchToHostCard: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    backgroundColor: LIGHT_BLUE,
    borderRadius: 12,
  },
  switchToHostContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchToHostText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
    marginRight: 12,
  },
  switchToHostButton: {
    backgroundColor: PRIMARY_DARK,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  switchToHostButtonText: {
    fontSize: 13,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: "#FFFFFF",
  },
  bookingsCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
  },
  bookingsLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  bookingsText: {
    fontSize: 15,
    fontWeight: "500",
    fontFamily: "Manrope-Medium",
    color: TEXT_DARK,
  },
  badge: {
    backgroundColor: BADGE_BG,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: "#FFFFFF",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: TEXT_DARK,
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  menuCard: {
    marginHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  menuLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuLabel: {
    fontSize: 15,
    fontFamily: "Manrope-Regular",
    color: TEXT_DARK,
  },
  divider: {
    height: 1,
    backgroundColor: BORDER_GRAY,
  },
  approvalBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  approvalBannerText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Manrope-Medium",
    color: TEXT_DARK,
    marginRight: 12,
  },
});
