// screens/host/HostDashboardScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../hooks/useAuth";

const PRIMARY_DARK = "#04123C";
const TEXT_DARK = "#1F2937";
const TEXT_MEDIUM = "#6B7280";
const TEXT_LIGHT = "#9CA3AF";
const BORDER_GRAY = "#E5E7EB";
const BG_WHITE = "#FFFFFF";
const BG_LIGHT = "#F9FAFB";

export default function HostDashboardScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [selectedTab, setSelectedTab] = useState("currently");

  const userName = user?.name || "John";

  // Sample property data
  const property = {
    name: "Lugar de grande 510, South Africa",
    room: "Room 1-10",
    price: "$644,653",
    image: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="home" size={24} color={PRIMARY_DARK} />
          <Text style={styles.headerTitle}>Averulo limited</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="share-outline" size={22} color={TEXT_DARK} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="ellipsis-horizontal" size={22} color={TEXT_DARK} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <Text style={styles.greeting}>
          Hey {userName}, Ready for your next guest
        </Text>

        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeText}>Welcome!</Text>
          <Image
            source={{ uri: property.image }}
            style={styles.propertyImage}
            resizeMode="cover"
          />
          <View style={styles.propertyInfo}>
            <View style={styles.propertyDetails}>
              <Text style={styles.propertyName}>{property.name}</Text>
              <Text style={styles.propertyRoom}>{property.room}</Text>
            </View>
            <Text style={styles.propertyPrice}>{property.price}</Text>
          </View>
        </View>

        {/* View Bookings Button */}
        <TouchableOpacity
          style={styles.viewBookingsButton}
          onPress={() => navigation.navigate("HostBookingsScreen")}
        >
          <Text style={styles.viewBookingsText}>View Bookings</Text>
        </TouchableOpacity>

        {/* Your Reservation Section */}
        <View style={styles.reservationSection}>
          <Text style={styles.sectionTitle}>Your Reservation</Text>

          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, selectedTab === "checked-out" && styles.tabActive]}
              onPress={() => setSelectedTab("checked-out")}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === "checked-out" && styles.tabTextActive,
                ]}
              >
                Checkout out (0)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, selectedTab === "currently" && styles.tabActive]}
              onPress={() => setSelectedTab("currently")}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === "currently" && styles.tabTextActive,
                ]}
              >
                Currently guests (0)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, selectedTab === "future" && styles.tabActive]}
              onPress={() => setSelectedTab("future")}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === "future" && styles.tabTextActive,
                ]}
              >
                Future guest (1)
              </Text>
            </TouchableOpacity>
          </View>

          {/* Empty State */}
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              You don't have any guests checking{"\n"}out today or tomorrow
            </Text>
          </View>
        </View>

        {/* All Reservation */}
        <TouchableOpacity style={styles.allReservationButton}>
          <Text style={styles.allReservationText}>All reservation (0)</Text>
        </TouchableOpacity>

        {/* Reviews Section */}
        <View style={styles.reviewsSection}>
          <Text style={styles.reviewsTitle}>Reviews</Text>
          <View style={styles.reviewsButtons}>
            <TouchableOpacity style={styles.reviewButton}>
              <Text style={styles.reviewButtonText}>New review</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reviewButton}>
              <Text style={styles.reviewButtonText}>Read</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color={PRIMARY_DARK} />
          <Text style={[styles.navText, styles.navTextActive]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("ChatScreen")}
        >
          <Ionicons name="chatbubble-outline" size={24} color={TEXT_MEDIUM} />
          <Text style={styles.navText}>Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("HostCalendarScreen")}
        >
          <Ionicons name="calendar-outline" size={24} color={TEXT_MEDIUM} />
          <Text style={styles.navText}>Calendar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("HostStatisticsScreen")}
        >
          <Ionicons name="stats-chart-outline" size={24} color={TEXT_MEDIUM} />
          <Text style={styles.navText}>Statistic</Text>
        </TouchableOpacity>
      </View>
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_GRAY,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: TEXT_DARK,
  },
  headerRight: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: BG_LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 13,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
    marginTop: 16,
    marginBottom: 16,
  },
  welcomeCard: {
    backgroundColor: BG_WHITE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    padding: 16,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Manrope-Bold",
    color: TEXT_DARK,
    marginBottom: 12,
  },
  propertyImage: {
    width: "100%",
    height: 160,
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
    marginBottom: 12,
  },
  propertyInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  propertyDetails: {
    flex: 1,
  },
  propertyName: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Manrope-Medium",
    color: TEXT_DARK,
    marginBottom: 4,
  },
  propertyRoom: {
    fontSize: 12,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
  },
  propertyPrice: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Manrope-Bold",
    color: TEXT_DARK,
  },
  viewBookingsButton: {
    backgroundColor: BG_WHITE,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 24,
  },
  viewBookingsText: {
    fontSize: 15,
    fontWeight: "500",
    fontFamily: "Manrope-Medium",
    color: TEXT_DARK,
  },
  reservationSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Manrope-Bold",
    color: TEXT_DARK,
    marginBottom: 16,
  },
  tabs: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: BG_LIGHT,
  },
  tabActive: {
    backgroundColor: PRIMARY_DARK,
  },
  tabText: {
    fontSize: 12,
    fontFamily: "Manrope-Medium",
    color: TEXT_MEDIUM,
  },
  tabTextActive: {
    color: BG_WHITE,
  },
  emptyState: {
    backgroundColor: BG_LIGHT,
    borderRadius: 12,
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
    textAlign: "center",
    lineHeight: 20,
  },
  allReservationButton: {
    backgroundColor: BG_WHITE,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  allReservationText: {
    fontSize: 15,
    fontWeight: "500",
    fontFamily: "Manrope-Medium",
    color: TEXT_DARK,
  },
  reviewsSection: {
    marginBottom: 24,
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Manrope-Bold",
    color: TEXT_DARK,
    marginBottom: 16,
  },
  reviewsButtons: {
    flexDirection: "row",
    gap: 12,
  },
  reviewButton: {
    flex: 1,
    backgroundColor: BG_WHITE,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  reviewButtonText: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Manrope-Medium",
    color: TEXT_DARK,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: BORDER_GRAY,
    backgroundColor: BG_WHITE,
  },
  navItem: {
    alignItems: "center",
    gap: 4,
  },
  navText: {
    fontSize: 11,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
  },
  navTextActive: {
    color: PRIMARY_DARK,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
  },
});
