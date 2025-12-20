// screens/host/HostBookingsScreen.js
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

const PRIMARY_DARK = "#04123C";
const TEXT_DARK = "#1F2937";
const TEXT_MEDIUM = "#6B7280";
const BORDER_GRAY = "#E5E7EB";
const BG_WHITE = "#FFFFFF";
const BG_LIGHT = "#F9FAFB";

export default function HostBookingsScreen() {
  const navigation = useNavigation();

  const pendingBookings = [
    {
      id: 1,
      name: "Dr. Jane Okoro",
      phone: "07012345678",
      dates: "10/12/2024 - 15/6/2024",
      price: "$644,653",
      image: "https://i.pravatar.cc/150?img=5",
    },
    {
      id: 2,
      name: "Dr. Jane Okoro",
      phone: "07012345678",
      dates: "10/12/2024 - 15/6/2024",
      price: "$644,653",
      image: "https://i.pravatar.cc/150?img=5",
    },
  ];

  const approvedBookings = [
    {
      id: 3,
      name: "Dr. Jane Okoro",
      phone: "07012345678",
      dates: "10/12/2024 - 15/6/2024",
      price: "$644,653",
      image: "https://i.pravatar.cc/150?img=5",
    },
    {
      id: 4,
      name: "Dr. Jane Okoro",
      phone: "07012345678",
      dates: "10/12/2024 - 15/6/2024",
      price: "$644,653",
      image: "https://i.pravatar.cc/150?img=5",
    },
    {
      id: 5,
      name: "Dr. Jane Okoro",
      phone: "07012345678",
      dates: "10/12/2024 - 15/6/2024",
      price: "$644,653",
      image: "https://i.pravatar.cc/150?img=5",
    },
  ];

  const rejectedBookings = [
    {
      id: 6,
      name: "Dr. Jane Okoro",
      phone: "07012345678",
      dates: "10/12/2024 - 15/6/2024",
      price: "$644,653",
      image: "https://i.pravatar.cc/150?img=5",
    },
  ];

  const BookingCard = ({ booking, isPending }) => (
    <TouchableOpacity
      style={styles.bookingCard}
      onPress={() => {
        if (isPending) {
          navigation.navigate("HostBookingRequestScreen", {
            guestName: booking.name,
            checkIn: booking.dates.split(" - ")[0],
            checkOut: booking.dates.split(" - ")[1],
            roomType: "Deluxe King Room",
            paymentStatus: "Pending Confirmation",
            roomImage: booking.image,
          });
        }
      }}
      activeOpacity={isPending ? 0.7 : 1}
    >
      <View style={styles.bookingImageContainer}>
        <Image source={{ uri: booking.image }} style={styles.bookingImage} />
        <View style={styles.redFlag} />
      </View>
      <View style={styles.bookingInfo}>
        <Text style={styles.bookingName}>{booking.name}</Text>
        <View style={styles.bookingDetail}>
          <Ionicons name="call-outline" size={14} color={TEXT_MEDIUM} />
          <Text style={styles.bookingText}>{booking.phone}</Text>
        </View>
        <View style={styles.bookingDetail}>
          <Ionicons name="calendar-outline" size={14} color={TEXT_MEDIUM} />
          <Text style={styles.bookingText}>{booking.dates}</Text>
        </View>
      </View>
      <Text style={styles.bookingPrice}>{booking.price}</Text>
    </TouchableOpacity>
  );

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
          <Text style={styles.hotelSelector}>Sunset Hotel</Text>
        </View>

        {/* Pending Section */}
        <Text style={styles.sectionTitle}>Pending</Text>
        {pendingBookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} isPending={true} />
        ))}

        {/* Approved Section */}
        <Text style={styles.sectionTitle}>Approved</Text>
        {approvedBookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} isPending={false} />
        ))}

        {/* Rejected Section */}
        <Text style={styles.sectionTitle}>Rejected</Text>
        {rejectedBookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} isPending={false} />
        ))}
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
});
