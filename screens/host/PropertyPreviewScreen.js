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
import Constants from "expo-constants";

const PRIMARY_DARK = "#04123C";
const TEXT_DARK = "#111827";
const TEXT_MEDIUM = "#6B7280";
const BORDER_GRAY = "#E5E7EB";
const BG_WHITE = "#FFFFFF";

// Mapbox token for static map
const MAPBOX_TOKEN = Constants.expoConfig?.extra?.mapboxAccessToken || "";

// Amenity icon mapping
const AMENITY_ICONS = {
  wifi: { icon: "wifi", label: "Free Wi-Fi" },
  pool: { icon: "water-outline", label: "Pool" },
  fitness: { icon: "fitness-outline", label: "Fitness Center" },
  breakfast: { icon: "restaurant-outline", label: "Complimentary Breakfast" },
  pet_friendly: { icon: "paw-outline", label: "Pet-Friendly" },
  car_park: { icon: "car-outline", label: "Car Park" },
  security: { icon: "shield-checkmark-outline", label: "24/7 Security" },
};

// Room type labels
const ROOM_LABELS = {
  standard: "Standard Room",
  deluxe: "Deluxe Room",
  suite: "Suite",
  junior_suite: "Junior Suite",
  executive: "Executive Room",
  family: "Family Room",
  connecting: "Connecting Rooms",
  premium: "Premium Room",
  penthouse: "Penthouse Suite",
  king: "King Room",
};

// Hotel type labels
const HOTEL_TYPES = {
  urban_boutique: "Urban Boutique Hotel",
  boutique_spa: "Boutique Spa Hotel",
  boutique_beachfront: "Boutique Beachfront Hotel",
  luxury_boutique: "Luxury Boutique Hotel",
};

export default function PropertyPreviewScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  // Extract all data from route params
  const {
    propertyName = "Your Hotel",
    phoneNumber = "",
    hotelEmail = "",
    website = "",
    hotelType = "",
    location = "",
    selectedAmenities = [],
    exteriorPhotos = [],
    amenityPhotos = [],
    diningPhotos = [],
    specialFeaturePhotos = [],
    roomCounts = {},
    roomMedia = {},
    roomPrices = {},
    designConcept = "",
    uniqueExperiences = "",
    customerService = "",
    hotelStory = "",
    otherDetails = "",
  } = route.params || {};

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [pegaNumber, setPegaNumber] = useState(phoneNumber || "");
  const [phone, setPhone] = useState(phoneNumber);
  const [email, setEmail] = useState(hotelEmail);
  const [hotelWebsite, setHotelWebsite] = useState(website);

  // Get hotel type label
  const hotelTypeLabel = HOTEL_TYPES[hotelType] || hotelType || "Boutique Hotel";

  // Build amenities list from selected amenities
  const amenities = selectedAmenities.slice(0, 3).map((amenityId) => {
    const amenityData = AMENITY_ICONS[amenityId] || { icon: "checkmark-outline", label: amenityId };
    return { icon: amenityData.icon, label: amenityData.label };
  });

  // Use remaining amenities or default services
  const services = selectedAmenities.slice(3, 6).map((amenityId) => {
    const amenityData = AMENITY_ICONS[amenityId] || { icon: "checkmark-outline", label: amenityId };
    return { icon: amenityData.icon, label: amenityData.label };
  });

  // If no amenities selected, show defaults
  if (amenities.length === 0) {
    amenities.push(
      { icon: "water-outline", label: "Pool" },
      { icon: "restaurant-outline", label: "Restaurant" },
      { icon: "wifi", label: "Wi-Fi" }
    );
  }

  if (services.length === 0) {
    services.push(
      { icon: "bed-outline", label: "Room Service" },
      { icon: "car-outline", label: "Parking" },
      { icon: "shield-checkmark-outline", label: "Security" }
    );
  }

  // Build rooms list from selected rooms with prices
  const rooms = Object.entries(roomCounts)
    .filter(([_, count]) => count > 0)
    .map(([roomId, count], index) => {
      const roomImages = roomMedia[roomId] || [];
      const firstImage = roomImages.length > 0 ? (roomImages[0].uri || roomImages[0]) : null;
      const price = roomPrices[roomId] || "0";
      const roomLabel = ROOM_LABELS[roomId] || roomId;

      return {
        id: index + 1,
        roomId,
        name: `${roomLabel}, ${count} room${count > 1 ? 's' : ''}`,
        price: `₦${Number(price).toLocaleString() || price}`,
        image: firstImage || "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
      };
    });

  // If no rooms selected, show sample
  if (rooms.length === 0) {
    rooms.push({
      id: 1,
      name: "Standard Room",
      price: "₦0",
      image: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
    });
  }

  // Get first exterior photo or fallback
  const getMainImage = () => {
    if (exteriorPhotos.length > 0) {
      return exteriorPhotos[0].uri || exteriorPhotos[0];
    }
    return "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg";
  };

  // Get amenity photo or fallback
  const getAmenityImage = () => {
    if (amenityPhotos.length > 0) {
      return amenityPhotos[0].uri || amenityPhotos[0];
    }
    return "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg";
  };

  // Get dining photo or fallback
  const getDiningImage = () => {
    if (diningPhotos.length > 0) {
      return diningPhotos[0].uri || diningPhotos[0];
    }
    return "https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg";
  };

  // Get special feature photo or fallback
  const getSpecialFeatureImage = () => {
    if (specialFeaturePhotos.length > 0) {
      return specialFeaturePhotos[0].uri || specialFeaturePhotos[0];
    }
    return "https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg";
  };

  // Build description from provided details
  const getDescription = () => {
    if (hotelStory) return hotelStory;
    if (designConcept) return designConcept;
    if (uniqueExperiences) return uniqueExperiences;
    return "Welcome to our hotel. We offer exceptional hospitality and comfortable accommodations for all guests.";
  };

  // Get about text
  const getAboutText = () => {
    if (customerService) return customerService;
    if (otherDetails) return otherDetails;
    return "Our hotel provides a unique experience with personalized service and modern amenities. Located in a prime location with easy access to local attractions.";
  };

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
            uri: getMainImage(),
          }}
          style={styles.mainImage}
          resizeMode="cover"
        />

        {/* Hotel Info */}
        <Text style={styles.hotelName}>{propertyName}</Text>
        <Text style={styles.hotelDescription}>
          {getDescription()}
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
            {getAboutText()}
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
          {location ? (
            <Text style={styles.locationText}>{location}</Text>
          ) : null}
          <View style={styles.mapPlaceholder}>
            <Image
              source={{
                uri: MAPBOX_TOKEN
                  ? `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/3.3792,6.5244,10,0/400x200?access_token=${MAPBOX_TOKEN}`
                  : "https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/3.3792,6.5244,10,0/400x200?access_token=pk.eyJ1IjoiYXZlcnVsbyIsImEiOiJjbWk3YmxjcHAwOHRjMmtzYm5ucG5kdXZsIn0.0AGfmRv74kWpqhnyJDXIIg",
              }}
              style={styles.mapImage}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* List of hotel */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Hotel Type</Text>
          <TouchableOpacity
            style={styles.selectInput}
            onPress={() => {
              // TODO: Show hotel type picker
              alert('Hotel type selected');
            }}
          >
            <Text style={styles.selectText}>{hotelTypeLabel}</Text>
            <Ionicons name="chevron-down" size={20} color={TEXT_MEDIUM} />
          </TouchableOpacity>
        </View>

        {/* List of all room */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Room Types ({rooms.length})</Text>
          <TouchableOpacity
            style={styles.selectInput}
            onPress={() => {
              // TODO: Show room type picker
              alert(`${rooms.length} room type(s) configured`);
            }}
          >
            <Text style={styles.selectText}>
              {rooms.length > 0 ? rooms[0].name : "No rooms configured"}
            </Text>
            <Ionicons name="chevron-down" size={20} color={TEXT_MEDIUM} />
          </TouchableOpacity>
        </View>

        {/* Exterior Photos */}
        <View style={styles.photoSection}>
          <Image
            source={{
              uri: getMainImage(),
            }}
            style={styles.photoImage}
            resizeMode="cover"
          />
          <Text style={styles.photoLabel}>
            Exterior{exteriorPhotos.length > 0 ? ` (${exteriorPhotos.length} photos)` : ""}
          </Text>
        </View>

        {/* Amenities Photos */}
        <View style={styles.photoSection}>
          <Image
            source={{
              uri: getAmenityImage(),
            }}
            style={styles.photoImage}
            resizeMode="cover"
          />
          <Text style={styles.photoLabel}>
            Amenities{amenityPhotos.length > 0 ? ` (${amenityPhotos.length} photos)` : ""}
          </Text>
        </View>

        {/* Dining */}
        <View style={styles.photoSection}>
          <Image
            source={{
              uri: getDiningImage(),
            }}
            style={styles.photoImage}
            resizeMode="cover"
          />
          <Text style={styles.photoLabel}>
            Dining{diningPhotos.length > 0 ? ` (${diningPhotos.length} photos)` : ""}
          </Text>
        </View>

        {/* Special feature */}
        <View style={styles.photoSection}>
          <Image
            source={{
              uri: getSpecialFeatureImage(),
            }}
            style={styles.photoImage}
            resizeMode="cover"
          />
          <Text style={styles.photoLabel}>
            Special Features{specialFeaturePhotos.length > 0 ? ` (${specialFeaturePhotos.length} photos)` : ""}
          </Text>
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
              <TouchableOpacity
                style={styles.editPriceButton}
                onPress={() => {
                  // TODO: Navigate to edit price screen or open modal
                  alert(`Edit price for: ${room.name}`);
                }}
              >
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
  locationText: {
    fontSize: 14,
    fontFamily: "Manrope-Medium",
    color: TEXT_DARK,
    marginBottom: 12,
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
