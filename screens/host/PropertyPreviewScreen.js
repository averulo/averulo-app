// screens/host/PropertyPreviewScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY_DARK = "#04123C";
const TEXT_DARK = "#111827";
const TEXT_MEDIUM = "#6B7280";
const BORDER_GRAY = "#E5E7EB";
const BG_WHITE = "#FFFFFF";

export default function PropertyPreviewScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const {
    propertyName = "Lugar de grange, 510",
    phoneNumber = "07074545676",
    hotelEmail = "lucas@gmail.com",
    website = "WWW.Sunset.com",
  } = route.params || {};

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [pegaNumber, setPegaNumber] = useState("07074545676");
  const [phone, setPhone] = useState(phoneNumber);
  const [email, setEmail] = useState(hotelEmail);
  const [hotelWebsite, setHotelWebsite] = useState(website);
  const [hotelType] = useState("Boutique hotel");
  const [roomType] = useState("Urban Boutique hotel");

  const amenities = [
    { icon: "water-outline", label: "Pool" },
    { icon: "beer-outline", label: "Bar" },
    { icon: "home-outline", label: "Room service" },
  ];

  const services = [
    { icon: "water-outline", label: "Pool" },
    { icon: "beer-outline", label: "Bar" },
    { icon: "home-outline", label: "Room service" },
  ];

  const rooms = [
    {
      id: 1,
      name: "Deluxe Double room, King bed",
      price: "$644,653",
      image: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
    },
    {
      id: 2,
      name: "Standard Room, 1 king bed",
      price: "$644,653",
      image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
    },
    {
      id: 3,
      name: "Business Room, 1 king bed",
      price: "$644,653",
      image: "https://images.pexels.com/photos/2598638/pexels-photo-2598638.jpeg",
    },
  ];

  const handleConfirm = () => {
    setShowSuccessModal(true);
  };

  const handleBackToProfile = () => {
    setShowSuccessModal(false);
    navigation.reset({
      index: 0,
      routes: [{ name: "MainTabs" }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={TEXT_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.mainTitle}>Check out your hotel!</Text>
        <Text style={styles.subtitle}>
          Confirm that the charges made are correct before submitting
        </Text>

        {/* Main Hotel Image */}
        <Image
          source={{
            uri: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
          }}
          style={styles.mainImage}
          resizeMode="cover"
        />

        {/* Hotel Info */}
        <Text style={styles.hotelName}>{propertyName}</Text>
        <Text style={styles.hotelDescription}>
          Walk onto the unique view on the beach, and, after online use it off.
          Pool user and off. All inclusive. Pass
        </Text>

        {/* Amenities & Service Offered Row */}
        <View style={styles.twoColumnRow}>
          {/* Amenities */}
          <View style={styles.columnSection}>
            <Text style={styles.columnTitle}>Amenities</Text>
            {amenities.map((amenity, index) => (
              <View key={index} style={styles.iconRow}>
                <Ionicons name={amenity.icon} size={16} color={TEXT_MEDIUM} />
                <Text style={styles.iconText}>{amenity.label}</Text>
              </View>
            ))}
          </View>

          {/* Service Offered */}
          <View style={styles.columnSection}>
            <Text style={styles.columnTitle}>Service Offered</Text>
            {services.map((service, index) => (
              <View key={index} style={styles.iconRow}>
                <Ionicons name={service.icon} size={16} color={TEXT_MEDIUM} />
                <Text style={styles.iconText}>{service.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* About this place */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About this place</Text>
          <Text style={styles.aboutText}>
            Logan with free parking and near recreation area and garden.
            Located near the family. Enjoy a delicious breakfast and home vivir and the offering experience with your next music. It has
          </Text>
          <TouchableOpacity>
            <Text style={styles.readMoreLink}>read more →</Text>
          </TouchableOpacity>
        </View>

        {/* Attach Pega Number */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Attach Pega Number</Text>
          <TextInput
            style={styles.input}
            value={pegaNumber}
            onChangeText={setPegaNumber}
            keyboardType="phone-pad"
          />
        </View>

        {/* Phone */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Phone</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Website */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Website</Text>
          <TextInput
            style={styles.input}
            value={hotelWebsite}
            onChangeText={setHotelWebsite}
            autoCapitalize="none"
          />
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.mapPlaceholder}>
            <Image
              source={{
                uri: "https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/-0.1278,51.5074,10,0/400x200?access_token=pk.eyJ1IjoiYXZlcnVsbyIsImEiOiJjbWk3YmxjcHAwOHRjMmtzYm5ucG5kdXZsIn0.0AGfmRv74kWpqhnyJDXIIg",
              }}
              style={styles.mapImage}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* List of hotel */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>List of hotel</Text>
          <View style={styles.selectInput}>
            <Text style={styles.selectText}>{hotelType}</Text>
            <Ionicons name="chevron-down" size={20} color={TEXT_MEDIUM} />
          </View>
        </View>

        {/* List of all room */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>List of all room</Text>
          <View style={styles.selectInput}>
            <Text style={styles.selectText}>{roomType}</Text>
            <Ionicons name="chevron-down" size={20} color={TEXT_MEDIUM} />
          </View>
        </View>

        {/* Picture Points */}
        <View style={styles.photoSection}>
          <Image
            source={{
              uri: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
            }}
            style={styles.photoImage}
            resizeMode="cover"
          />
          <Text style={styles.photoLabel}>Picture Points</Text>
        </View>

        {/* Amenities Photos */}
        <View style={styles.photoSection}>
          <Image
            source={{
              uri: "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg",
            }}
            style={styles.photoImage}
            resizeMode="cover"
          />
          <Text style={styles.photoLabel}>Amenities</Text>
        </View>

        {/* Dining */}
        <View style={styles.photoSection}>
          <Image
            source={{
              uri: "https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg",
            }}
            style={styles.photoImage}
            resizeMode="cover"
          />
          <Text style={styles.photoLabel}>Dining</Text>
        </View>

        {/* Special feature */}
        <View style={styles.photoSection}>
          <Image
            source={{
              uri: "https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg",
            }}
            style={styles.photoImage}
            resizeMode="cover"
          />
          <Text style={styles.photoLabel}>Special feature</Text>
        </View>

        {/* The type of rooms */}
        <Text style={styles.roomsTitle}>The type of rooms</Text>
        {rooms.map((room) => (
          <View key={room.id} style={styles.roomCard}>
            <Image
              source={{ uri: room.image }}
              style={styles.roomImage}
              resizeMode="cover"
            />
            <View style={styles.roomInfo}>
              <View style={styles.roomDetails}>
                <Text style={styles.roomName}>{room.name}</Text>
                <Text style={styles.roomPrice}>{room.price}</Text>
              </View>
              <TouchableOpacity style={styles.editPriceButton}>
                <Text style={styles.editPriceText}>Edit price</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Fixed Create Profile Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Create Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <SafeAreaView style={styles.successSafeArea}>
          <View style={styles.successContainer}>
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark" size={80} color={BG_WHITE} />
            </View>
            <Text style={styles.successTitle}>
              Pending approval, will update you shortly
            </Text>
            <TouchableOpacity
              style={styles.backToProfileButton}
              onPress={handleBackToProfile}
            >
              <Text style={styles.backToProfileButtonText}>Back to Profile</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: TEXT_DARK,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: "700",
    fontFamily: "Manrope-Bold",
    color: TEXT_DARK,
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
    marginBottom: 20,
    lineHeight: 18,
  },
  mainImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    backgroundColor: BORDER_GRAY,
    marginBottom: 16,
  },
  hotelName: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: TEXT_DARK,
    marginBottom: 8,
  },
  hotelDescription: {
    fontSize: 13,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
    lineHeight: 20,
    marginBottom: 20,
  },
  twoColumnRow: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 16,
  },
  columnSection: {
    flex: 1,
  },
  columnTitle: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: TEXT_DARK,
    marginBottom: 10,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  iconText: {
    fontSize: 13,
    fontFamily: "Manrope-Regular",
    color: TEXT_DARK,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: TEXT_DARK,
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 13,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
    lineHeight: 20,
    marginBottom: 8,
  },
  readMoreLink: {
    fontSize: 13,
    fontFamily: "Manrope-Medium",
    color: PRIMARY_DARK,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontFamily: "Manrope-Medium",
    color: TEXT_DARK,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: "Manrope-Regular",
    color: TEXT_DARK,
    backgroundColor: BG_WHITE,
  },
  selectInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 8,
    padding: 12,
    backgroundColor: BG_WHITE,
  },
  selectText: {
    fontSize: 14,
    fontFamily: "Manrope-Regular",
    color: TEXT_DARK,
  },
  mapPlaceholder: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    backgroundColor: BORDER_GRAY,
    overflow: "hidden",
  },
  mapImage: {
    width: "100%",
    height: "100%",
  },
  photoSection: {
    marginBottom: 16,
  },
  photoImage: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    backgroundColor: BORDER_GRAY,
    marginBottom: 8,
  },
  photoLabel: {
    fontSize: 13,
    fontFamily: "Manrope-Medium",
    color: TEXT_DARK,
    textAlign: "center",
  },
  roomsTitle: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: TEXT_DARK,
    marginTop: 12,
    marginBottom: 16,
  },
  roomCard: {
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    backgroundColor: BG_WHITE,
  },
  roomImage: {
    width: "100%",
    height: 140,
    backgroundColor: BORDER_GRAY,
  },
  roomInfo: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  roomDetails: {
    flex: 1,
  },
  roomName: {
    fontSize: 14,
    fontFamily: "Manrope-Medium",
    color: TEXT_DARK,
    marginBottom: 4,
  },
  roomPrice: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Manrope-Bold",
    color: TEXT_DARK,
  },
  editPriceButton: {
    backgroundColor: PRIMARY_DARK,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  editPriceText: {
    fontSize: 13,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: BG_WHITE,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: BG_WHITE,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: BORDER_GRAY,
  },
  confirmButton: {
    backgroundColor: PRIMARY_DARK,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmButtonText: {
    color: BG_WHITE,
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Manrope-Bold",
  },
  successSafeArea: {
    flex: 1,
    backgroundColor: BG_WHITE,
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  successIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: PRIMARY_DARK,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  successTitle: {
    fontSize: 18,
    fontFamily: "Manrope-SemiBold",
    color: TEXT_DARK,
    textAlign: "center",
    marginBottom: 40,
  },
  backToProfileButton: {
    backgroundColor: PRIMARY_DARK,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  backToProfileButtonText: {
    color: BG_WHITE,
    fontSize: 15,
    fontFamily: "Manrope-SemiBold",
  },
});
