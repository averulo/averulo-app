// screens/host/HostBookingsScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useState, useCallback } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../hooks/useAuth";
import { API_BASE } from "../../lib/api";

const PRIMARY_DARK = "#04123C";
const TEXT_DARK = "#1F2937";
const TEXT_MEDIUM = "#6B7280";
const BORDER_GRAY = "#E5E7EB";
const BG_WHITE = "#FFFFFF";
const BG_LIGHT = "#F9FAFB";

export default function HostBookingsScreen() {
  const navigation = useNavigation();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);

  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [token])
  );

  const fetchBookings = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/bookings/host`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setBookings(data || []);
      }
    } catch (err) {
      console.log("Fetch bookings error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Group bookings by status
  const pendingBookings = bookings.filter(b => b.status === 'PENDING');
  const approvedBookings = bookings.filter(b => b.status === 'APPROVED');
  const rejectedBookings = bookings.filter(b => b.status === 'REJECTED' || b.status === 'CANCELLED');

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  const BookingCard = ({ booking, isPending }) => {
    const guestName = booking.guest?.name || booking.guest?.email || "Guest";
    const guestPhone = booking.guest?.phone || "";
    const dates = `${formatDate(booking.startDate)} - ${formatDate(booking.endDate)}`;
    const price = booking.totalAmount ? `₦${(booking.totalAmount / 100).toLocaleString()}` : "₦0";
    const guestImage = `https://i.pravatar.cc/150?u=${booking.guestId}`;

    return (
      <TouchableOpacity
        style={styles.bookingCard}
        onPress={() => {
          if (isPending) {
            navigation.navigate("HostBookingRequestScreen", {
              bookingId: booking.id,
              guestName,
              checkIn: formatDate(booking.startDate),
              checkOut: formatDate(booking.endDate),
              roomType: booking.property?.title || "Room",
              paymentStatus: "Pending Confirmation",
              roomImage: booking.property?.images?.[0]?.url || guestImage,
            });
          }
        }}
        activeOpacity={isPending ? 0.7 : 1}
      >
        <View style={styles.bookingImageContainer}>
          <Image source={{ uri: guestImage }} style={styles.bookingImage} />
          {isPending && <View style={styles.redFlag} />}
        </View>
        <View style={styles.bookingInfo}>
          <Text style={styles.bookingName}>{guestName}</Text>
          {guestPhone ? (
            <View style={styles.bookingDetail}>
              <Ionicons name="call-outline" size={14} color={TEXT_MEDIUM} />
              <Text style={styles.bookingText}>{guestPhone}</Text>
            </View>
          ) : null}
          <View style={styles.bookingDetail}>
            <Ionicons name="calendar-outline" size={14} color={TEXT_MEDIUM} />
            <Text style={styles.bookingText}>{dates}</Text>
          </View>
        </View>
        <Text style={styles.bookingPrice}>{price}</Text>
      </TouchableOpacity>
    );
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
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Row */}
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>Bookings</Text>
          <Text style={styles.hotelSelector}>{bookings.length} total</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={PRIMARY_DARK} />
            <Text style={styles.loadingText}>Loading bookings...</Text>
          </View>
        ) : bookings.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={60} color={TEXT_MEDIUM} />
            <Text style={styles.emptyText}>No bookings yet</Text>
            <Text style={styles.emptySubtext}>When guests book your property, they'll appear here</Text>
          </View>
        ) : (
          <>
            {/* Pending Section */}
            {pendingBookings.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Pending ({pendingBookings.length})</Text>
                {pendingBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} isPending={true} />
                ))}
              </>
            )}

            {/* Approved Section */}
            {approvedBookings.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Approved ({approvedBookings.length})</Text>
                {approvedBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} isPending={false} />
                ))}
              </>
            )}

            {/* Rejected/Cancelled Section */}
            {rejectedBookings.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Cancelled ({rejectedBookings.length})</Text>
                {rejectedBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} isPending={false} />
                ))}
              </>
            )}
          </>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("HostDashboardScreen")}
        >
          <Ionicons name="home-outline" size={24} color={TEXT_MEDIUM} />
          <Text style={styles.navText}>Home</Text>
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
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: "700",
    fontFamily: "Manrope-Bold",
    color: TEXT_DARK,
  },
  hotelSelector: {
    fontSize: 15,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: TEXT_DARK,
    marginTop: 8,
    marginBottom: 16,
  },
  bookingCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: BG_WHITE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    marginBottom: 12,
  },
  bookingImageContainer: {
    position: "relative",
    marginRight: 12,
  },
  bookingImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#E5E7EB",
  },
  redFlag: {
    position: "absolute",
    top: 0,
    right: -8,
    width: 20,
    height: 24,
    backgroundColor: "#EF4444",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  bookingInfo: {
    flex: 1,
    gap: 4,
  },
  bookingName: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: TEXT_DARK,
    marginBottom: 2,
  },
  bookingDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  bookingText: {
    fontSize: 12,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
  },
  bookingPrice: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Manrope-Bold",
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
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
    marginTop: 12,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: TEXT_DARK,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
    marginTop: 8,
    textAlign: "center",
  },
});
