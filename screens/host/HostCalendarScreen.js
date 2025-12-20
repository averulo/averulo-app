// screens/host/HostCalendarScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY_DARK = "#04123C";
const TEXT_DARK = "#1F2937";
const TEXT_MEDIUM = "#6B7280";
const TEXT_LIGHT = "#9CA3AF";
const BORDER_GRAY = "#E5E7EB";
const BG_WHITE = "#FFFFFF";
const BG_LIGHT = "#F9FAFB";
const OCCUPY_GRAY = "#D1D5DB";
const RESERVE_DARK = "#1E293B";

export default function HostCalendarScreen() {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(11);

  // Upcoming dates
  const upcomingDates = [
    { day: 9, label: "Sun" },
    { day: 10, label: "Mon" },
    { day: 11, label: "Tue" },
    { day: 12, label: "Wed" },
    { day: 13, label: "Thu" },
    { day: 14, label: "Fri" },
    { day: 15, label: "Sat" },
  ];

  // Calendar grid data (12 rooms x 7 days)
  // 0 = vacant, 1 = occupy, 2 = reserve
  const calendarData = Array.from({ length: 12 }, (_, roomIndex) =>
    Array.from({ length: 7 }, (_, dayIndex) => {
      // Reserve pattern for days Tue(2) and Wed(3)
      if (dayIndex === 2 || dayIndex === 3) return 2;
      // Occupy pattern for days Sun(0) and Mon(1)
      if (dayIndex === 0 || dayIndex === 1) return 1;
      return 0; // Vacant for remaining days
    })
  );

  // Sample reservations
  const reservations = [
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
    {
      id: 3,
      name: "Dr. Jane Okoro",
      phone: "07012345678",
      dates: "10/12/2024 - 15/6/2024",
      price: "$644,653",
      image: "https://i.pravatar.cc/150?img=5",
    },
  ];

  const getCellStyle = (status) => {
    if (status === 0) return styles.cellVacant;
    if (status === 1) return styles.cellOccupy;
    if (status === 2) return styles.cellReserve;
    return styles.cellVacant;
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
        {/* Upcoming Reservation */}
        <Text style={styles.pageTitle}>Upcoming reservation</Text>

        {/* Date Selector */}
        <View style={styles.dateRow}>
          {upcomingDates.map((date) => (
            <TouchableOpacity
              key={date.day}
              style={[
                styles.dateBox,
                selectedDate === date.day && styles.dateBoxActive,
              ]}
              onPress={() => setSelectedDate(date.day)}
            >
              <Text
                style={[
                  styles.dateNumber,
                  selectedDate === date.day && styles.dateNumberActive,
                ]}
              >
                {date.day}
              </Text>
              <Text
                style={[
                  styles.dateLabel,
                  selectedDate === date.day && styles.dateLabelActive,
                ]}
              >
                {date.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarGrid}>
          {calendarData.map((roomRow, roomIndex) => (
            <View key={roomIndex} style={styles.calendarRow}>
              <Text style={styles.roomNumber}>{roomIndex + 1}</Text>
              {roomRow.map((cellStatus, dayIndex) => (
                <View key={dayIndex} style={[styles.cell, getCellStyle(cellStatus)]} />
              ))}
            </View>
          ))}
        </View>

        {/* Rooms Legend */}
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>Rooms</Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: OCCUPY_GRAY }]} />
              <Text style={styles.legendText}>Occupy</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: BG_WHITE, borderWidth: 1, borderColor: BORDER_GRAY }]} />
              <Text style={styles.legendText}>vacant</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: RESERVE_DARK }]} />
              <Text style={styles.legendText}>Reserve</Text>
            </View>
          </View>
        </View>

        {/* Reservations Section */}
        <Text style={styles.sectionTitle}>Reservation(s)</Text>

        {reservations.map((reservation) => (
          <View key={reservation.id} style={styles.reservationCard}>
            <View style={styles.reservationImageContainer}>
              <Image
                source={{ uri: reservation.image }}
                style={styles.reservationImage}
              />
              <View style={styles.redFlag} />
            </View>
            <View style={styles.reservationInfo}>
              <Text style={styles.reservationName}>{reservation.name}</Text>
              <View style={styles.reservationDetail}>
                <Ionicons name="call-outline" size={14} color={TEXT_MEDIUM} />
                <Text style={styles.reservationText}>{reservation.phone}</Text>
              </View>
              <View style={styles.reservationDetail}>
                <Ionicons name="calendar-outline" size={14} color={TEXT_MEDIUM} />
                <Text style={styles.reservationText}>{reservation.dates}</Text>
              </View>
            </View>
            <Text style={styles.reservationPrice}>{reservation.price}</Text>
          </View>
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

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="calendar" size={24} color={PRIMARY_DARK} />
          <Text style={[styles.navText, styles.navTextActive]}>Calendar</Text>
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
  pageTitle: {
    fontSize: 20,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: TEXT_DARK,
    marginTop: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: TEXT_DARK,
    marginBottom: 16,
  },
  dateRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 24,
  },
  dateBox: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderRadius: 12,
    backgroundColor: BG_WHITE,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    alignItems: "center",
  },
  dateBoxActive: {
    backgroundColor: PRIMARY_DARK,
    borderColor: PRIMARY_DARK,
  },
  dateNumber: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Manrope-Bold",
    color: TEXT_DARK,
    marginBottom: 6,
  },
  dateNumberActive: {
    color: BG_WHITE,
  },
  dateLabel: {
    fontSize: 13,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
  },
  dateLabelActive: {
    color: BG_WHITE,
  },
  calendarGrid: {
    marginBottom: 24,
  },
  calendarRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 6,
  },
  roomNumber: {
    width: 20,
    fontSize: 12,
    fontFamily: "Manrope-Medium",
    color: TEXT_MEDIUM,
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 4,
  },
  cellVacant: {
    backgroundColor: BG_WHITE,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
  },
  cellOccupy: {
    backgroundColor: OCCUPY_GRAY,
  },
  cellReserve: {
    backgroundColor: RESERVE_DARK,
  },
  legend: {
    marginBottom: 24,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: TEXT_DARK,
    marginBottom: 12,
  },
  legendItems: {
    flexDirection: "row",
    gap: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendBox: {
    width: 16,
    height: 16,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 14,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
  },
  reservationCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: BG_WHITE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    marginBottom: 12,
  },
  reservationImageContainer: {
    position: "relative",
    marginRight: 12,
  },
  reservationImage: {
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
  reservationInfo: {
    flex: 1,
    gap: 4,
  },
  reservationName: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: TEXT_DARK,
    marginBottom: 2,
  },
  reservationDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  reservationText: {
    fontSize: 12,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
  },
  reservationPrice: {
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
  navTextActive: {
    color: PRIMARY_DARK,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
  },
});
