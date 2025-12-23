// screens/host/CreatePropertyScreen.js
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";

// Conditionally import Mapbox
let Mapbox = null;
let MAPBOX_AVAILABLE = false;
try {
  Mapbox = require("@rnmapbox/maps").default;
  const MAPBOX_TOKEN = Constants.expoConfig?.extra?.mapboxAccessToken;
  if (MAPBOX_TOKEN && MAPBOX_TOKEN !== "YOUR_MAPBOX_TOKEN_HERE") {
    Mapbox.setAccessToken(MAPBOX_TOKEN);
    MAPBOX_AVAILABLE = true;
  }
} catch (err) {
  console.log("⚠️ Mapbox not available - using fallback for host property creation");
}

const PRIMARY_DARK = "#04123C";
const TEXT_DARK = "#111827";
const TEXT_MEDIUM = "#6B7280";
const BORDER_GRAY = "#E5E7EB";

const ROLES = [
  { id: "general_manager", label: "General Manager", icon: "person" },
  { id: "receptionist", label: "Receptionist", icon: "people" },
  { id: "hotel_manager", label: "Hotel Manager", icon: "people-outline" },
  { id: "housekeeping_manager", label: "Housekeeping Manager", icon: "bed" },
  { id: "fb_manager", label: "F&B Manager", icon: "restaurant" },
  { id: "sales_manager", label: "Sales Manager", icon: "briefcase" },
];

const HOTEL_TYPES = [
  { id: "urban_boutique", label: "Urban Boutique Hotel" },
  { id: "boutique_spa", label: "Boutique Spa Hotel" },
  { id: "boutique_beachfront", label: "Boutique Beachfront Hotel" },
  { id: "luxury_boutique", label: "Luxury Boutique Hotel" },
];

const AMENITIES = [
  { id: "wifi", label: "Free Wi-Fi", icon: "wifi" },
  { id: "pool", label: "Pool", icon: "water" },
  { id: "fitness", label: "Fitness Center", icon: "fitness" },
  { id: "breakfast", label: "Complimentary Breakfast", icon: "thumbs-up" },
  { id: "pet_friendly", label: "Pet-Friendly", icon: "paw" },
  { id: "car_park", label: "Car Park", icon: "car" },
  { id: "security", label: "24/7 Security", icon: "shield-checkmark" },
];

const ROOM_TYPES = [
  { id: "standard", label: "Standard Room" },
  { id: "deluxe", label: "Deluxe Room" },
  { id: "suite", label: "Suite" },
  { id: "junior_suite", label: "Junior Suite" },
  { id: "executive", label: "Executive Room" },
  { id: "family", label: "Family Room" },
  { id: "connecting", label: "Connecting Rooms" },
  { id: "premium", label: "Premium Room" },
  { id: "penthouse", label: "Penthouse Suite" },
  { id: "king", label: "King" },
];

export default function CreatePropertyScreen() {
  const navigation = useNavigation();
  const [step, setStep] = useState(1);
  const [propertyName, setPropertyName] = useState("");
  const [accountHolderPosition, setAccountHolderPosition] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [hotelEmail, setHotelEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [hotelType, setHotelType] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState(6.5244); // Default: Lagos
  const [longitude, setLongitude] = useState(3.3792);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [focusedField, setFocusedField] = useState("");

  // Media upload states (step 8)
  const [exteriorVideos, setExteriorVideos] = useState([]);
  const [exteriorPhotos, setExteriorPhotos] = useState([]);
  const [amenityPhotos, setAmenityPhotos] = useState([]);
  const [diningPhotos, setDiningPhotos] = useState([]);
  const [specialFeaturePhotos, setSpecialFeaturePhotos] = useState([]);
  const [eventSpacePhotos, setEventSpacePhotos] = useState([]);
  const [nearbyAttractionPhotos, setNearbyAttractionPhotos] = useState([]);

  // Room types state (step 9)
  const [roomCounts, setRoomCounts] = useState({});
  const [selectedRoomForEdit, setSelectedRoomForEdit] = useState(null);

  // Room media state (step 10)
  const [roomMedia, setRoomMedia] = useState({});

  // Room prices state (step 11)
  const [roomPrices, setRoomPrices] = useState({});

  // Hotel unique details state (step 12)
  const [designConcept, setDesignConcept] = useState("");
  const [uniqueExperiences, setUniqueExperiences] = useState("");
  const [customerService, setCustomerService] = useState("");
  const [hotelStory, setHotelStory] = useState("");
  const [otherDetails, setOtherDetails] = useState("");

  const toggleRole = (roleId) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  const toggleAmenity = (amenityId) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityId)
        ? prev.filter((id) => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  // Image picker for media upload
  const pickImages = async (type) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow access to your photo library");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: type === 'video' ? ImagePicker.MediaTypeOptions.Videos : ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      return result.assets;
    }
    return [];
  };

  const handleUploadMedia = async (category) => {
    const assets = await pickImages(category === 'exteriorVideos' ? 'video' : 'image');

    if (category === 'exteriorVideos') {
      setExteriorVideos([...exteriorVideos, ...assets]);
    } else if (category === 'exteriorPhotos') {
      setExteriorPhotos([...exteriorPhotos, ...assets]);
    } else if (category === 'amenityPhotos') {
      setAmenityPhotos([...amenityPhotos, ...assets]);
    } else if (category === 'diningPhotos') {
      setDiningPhotos([...diningPhotos, ...assets]);
    } else if (category === 'specialFeaturePhotos') {
      setSpecialFeaturePhotos([...specialFeaturePhotos, ...assets]);
    } else if (category === 'eventSpacePhotos') {
      setEventSpacePhotos([...eventSpacePhotos, ...assets]);
    } else if (category === 'nearbyAttractionPhotos') {
      setNearbyAttractionPhotos([...nearbyAttractionPhotos, ...assets]);
    }
  };

  const handleReorderMedia = (category, title) => {
    let photos = [];

    if (category === 'exteriorPhotos') photos = exteriorPhotos;
    else if (category === 'amenityPhotos') photos = amenityPhotos;
    else if (category === 'diningPhotos') photos = diningPhotos;
    else if (category === 'specialFeaturePhotos') photos = specialFeaturePhotos;
    else if (category === 'eventSpacePhotos') photos = eventSpacePhotos;
    else if (category === 'nearbyAttractionPhotos') photos = nearbyAttractionPhotos;

    if (photos.length === 0) return;

    navigation.navigate('ReorderPhotosScreen', {
      photos,
      title,
      category,
      onSave: (reorderedPhotos) => {
        if (category === 'exteriorPhotos') setExteriorPhotos(reorderedPhotos);
        else if (category === 'amenityPhotos') setAmenityPhotos(reorderedPhotos);
        else if (category === 'diningPhotos') setDiningPhotos(reorderedPhotos);
        else if (category === 'specialFeaturePhotos') setSpecialFeaturePhotos(reorderedPhotos);
        else if (category === 'eventSpacePhotos') setEventSpacePhotos(reorderedPhotos);
        else if (category === 'nearbyAttractionPhotos') setNearbyAttractionPhotos(reorderedPhotos);
      },
    });
  };

  const handleNext = () => {
    if (step === 1) {
      if (!propertyName.trim()) {
        alert("Please enter your hotel name");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!accountHolderPosition.trim()) {
        alert("Please enter your position");
        return;
      }
      setStep(3);
    } else if (step === 3) {
      // No validation required for role selection
      setStep(4);
    } else if (step === 4) {
      if (!phoneNumber.trim() || !hotelEmail.trim()) {
        alert("Please fill in required contact information");
        return;
      }
      setStep(5);
    } else if (step === 5) {
      if (!hotelType) {
        alert("Please select a hotel type");
        return;
      }
      setStep(6);
    } else if (step === 6) {
      if (!location.trim()) {
        alert("Please enter your hotel location");
        return;
      }
      setStep(7);
    } else if (step === 7) {
      // Continue to media upload
      setStep(8);
    } else if (step === 8) {
      // Continue to room selection
      setStep(9);
    } else if (step === 9) {
      // Check if any rooms were selected
      const hasRooms = Object.values(roomCounts).some(count => count > 0);
      if (hasRooms) {
        setStep(10);
      } else {
        // No rooms selected, skip to completion
        setStep(10); // Or could directly complete
      }
    } else if (step === 10) {
      // Continue to room pricing
      setStep(11);
    } else if (step === 11) {
      // Continue to hotel unique details
      setStep(12);
    } else if (step === 12) {
      // Navigate to confirmation screen
      navigation.navigate("ConfirmPropertyScreen", {
        propertyName,
        accountHolderPosition,
        selectedRoles,
        phoneNumber,
        hotelEmail,
        website,
        hotelType,
        location,
        selectedAmenities,
        exteriorVideos,
        exteriorPhotos,
        amenityPhotos,
        diningPhotos,
        specialFeaturePhotos,
        eventSpacePhotos,
        nearbyAttractionPhotos,
        roomCounts,
        roomMedia,
        roomPrices,
        designConcept,
        uniqueExperiences,
        customerService,
        hotelStory,
        otherDetails,
      });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleSkip = () => {
    if (step === 5 || step === 7 || step === 8 || step === 9 || step === 10 || step === 11 || step === 12) {
      // Skip hotel type, amenities, media upload, rooms, room media, pricing, or unique details - go to main tabs
      navigation.reset({
        index: 0,
        routes: [{ name: "MainTabs" }],
      });
    } else {
      // Skip to next step
      setStep(step + 1);
    }
  };

  const incrementRoomCount = (roomId) => {
    setRoomCounts((prev) => ({
      ...prev,
      [roomId]: (prev[roomId] || 0) + 1,
    }));
  };

  const decrementRoomCount = (roomId) => {
    setRoomCounts((prev) => ({
      ...prev,
      [roomId]: Math.max(0, (prev[roomId] || 0) - 1),
    }));
  };

  const handleUploadRoomMedia = async (roomId) => {
    const assets = await pickImages('image');
    if (assets.length > 0) {
      setRoomMedia((prev) => ({
        ...prev,
        [roomId]: [...(prev[roomId] || []), ...assets],
      }));
    }
  };

  const handleReorderRoomMedia = (roomId, roomLabel) => {
    const photos = roomMedia[roomId] || [];
    if (photos.length === 0) return;

    navigation.navigate('ReorderPhotosScreen', {
      photos,
      title: roomLabel,
      category: roomId,
      onSave: (reorderedPhotos) => {
        setRoomMedia((prev) => ({
          ...prev,
          [roomId]: reorderedPhotos,
        }));
      },
    });
  };

  const handleRoomPriceChange = (roomId, price) => {
    setRoomPrices((prev) => ({
      ...prev,
      [roomId]: price,
    }));
  };

  const progress = step / 12; // 12 total steps

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={TEXT_DARK} />
          </TouchableOpacity>
          {(step === 2 || step === 3 || step === 5 || step === 7 || step === 8 || step === 9 || step === 10 || step === 11 || step === 12) && (
            <TouchableOpacity onPress={handleSkip}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {step === 1 ? (
            // Step 1: Property Name
            <>
              <Text style={styles.question}>What is the Name of your hotel</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === "propertyName" && styles.inputFocused,
                ]}
                value={propertyName}
                onChangeText={setPropertyName}
                onFocus={() => setFocusedField("propertyName")}
                onBlur={() => setFocusedField("")}
                placeholder="Enter hotel name"
                placeholderTextColor="#aaa"
              />
            </>
          ) : step === 2 ? (
            // Step 2: Account Holder Position
            <>
              <Text style={styles.question}>
                Position of the Primary account holder
              </Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === "position" && styles.inputFocused,
                ]}
                value={accountHolderPosition}
                onChangeText={setAccountHolderPosition}
                onFocus={() => setFocusedField("position")}
                onBlur={() => setFocusedField("")}
                placeholder="Enter your position"
                placeholderTextColor="#aaa"
              />
            </>
          ) : step === 3 ? (
            // Step 3: Select Roles
            <>
              <Text style={styles.question}>Select other account users</Text>
              <View style={styles.rolesGrid}>
                {ROLES.map((role) => (
                  <TouchableOpacity
                    key={role.id}
                    style={[
                      styles.roleCard,
                      selectedRoles.includes(role.id) && styles.roleCardSelected,
                    ]}
                    onPress={() => toggleRole(role.id)}
                  >
                    <Ionicons
                      name={role.icon}
                      size={32}
                      color={selectedRoles.includes(role.id) ? PRIMARY_DARK : TEXT_MEDIUM}
                    />
                    <Text
                      style={[
                        styles.roleLabel,
                        selectedRoles.includes(role.id) && styles.roleLabelSelected,
                      ]}
                    >
                      {role.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          ) : step === 4 ? (
            // Step 4: Contact Info
            <>
              <Text style={styles.question}>Contact Info for the hotel</Text>
              <Text style={styles.label}>Hotel Phone Number</Text>
              <TextInput
                style={[
                  styles.contactInput,
                  focusedField === "phone" && styles.inputFocused,
                ]}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                onFocus={() => setFocusedField("phone")}
                onBlur={() => setFocusedField("")}
                placeholder="0701234567​8"
                placeholderTextColor="#aaa"
                keyboardType="phone-pad"
              />

              <Text style={styles.label}>Hotel Email</Text>
              <TextInput
                style={[
                  styles.contactInput,
                  focusedField === "email" && styles.inputFocused,
                ]}
                value={hotelEmail}
                onChangeText={setHotelEmail}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField("")}
                placeholder="Sunset@gmail.com"
                placeholderTextColor="#aaa"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.label}>Website</Text>
              <TextInput
                style={[
                  styles.contactInput,
                  focusedField === "website" && styles.inputFocused,
                ]}
                value={website}
                onChangeText={setWebsite}
                onFocus={() => setFocusedField("website")}
                onBlur={() => setFocusedField("")}
                placeholder="WWW.Sunset.com"
                placeholderTextColor="#aaa"
                keyboardType="url"
                autoCapitalize="none"
              />
            </>
          ) : step === 5 ? (
            // Step 5: Hotel Type
            <>
              <Text style={styles.question}>Which of these best describes your hotel</Text>
              <View style={styles.hotelTypesList}>
                {HOTEL_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.hotelTypeOption,
                      hotelType === type.id && styles.hotelTypeSelected,
                    ]}
                    onPress={() => setHotelType(type.id)}
                  >
                    <Text
                      style={[
                        styles.hotelTypeText,
                        hotelType === type.id && styles.hotelTypeTextSelected,
                      ]}
                    >
                      {type.label}
                    </Text>
                    <View style={styles.radioOuter}>
                      {hotelType === type.id && <View style={styles.radioInner} />}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          ) : step === 6 ? (
            // Step 6: Location
            <>
              <Text style={styles.question}>Where's your hotel located</Text>

              {/* Interactive Map */}
              {MAPBOX_AVAILABLE && Mapbox ? (
                <View style={styles.mapContainer}>
                  <Mapbox.MapView
                    style={styles.mapView}
                    styleURL={Mapbox.StyleURL.Street}
                    zoomEnabled={true}
                    scrollEnabled={true}
                    pitchEnabled={false}
                    rotateEnabled={false}
                    onPress={(feature) => {
                      if (feature.geometry?.coordinates) {
                        const [lng, lat] = feature.geometry.coordinates;
                        setLatitude(lat);
                        setLongitude(lng);
                      }
                    }}
                  >
                    <Mapbox.Camera
                      zoomLevel={12}
                      centerCoordinate={[longitude, latitude]}
                      animationMode="flyTo"
                      animationDuration={1000}
                    />
                    <Mapbox.PointAnnotation
                      id="property-location"
                      coordinate={[longitude, latitude]}
                    >
                      <View style={styles.mapMarker}>
                        <Ionicons name="location" size={32} color="#FFFFFF" />
                      </View>
                    </Mapbox.PointAnnotation>
                  </Mapbox.MapView>
                  <Text style={styles.mapHint}>
                    Tap on the map to set your property location
                  </Text>
                </View>
              ) : (
                <View style={styles.mapPlaceholder}>
                  <Ionicons name="location" size={48} color={PRIMARY_DARK} />
                  <Text style={styles.mapPlaceholderText}>
                    Interactive map available in production build
                  </Text>
                </View>
              )}

              {/* Address Input */}
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={[
                  styles.contactInput,
                  focusedField === "location" && styles.inputFocused,
                ]}
                value={location}
                onChangeText={setLocation}
                onFocus={() => setFocusedField("location")}
                onBlur={() => setFocusedField("")}
                placeholder="Enter your address"
                placeholderTextColor="#aaa"
                multiline
                numberOfLines={2}
              />
            </>
          ) : step === 7 ? (
            // Step 7: Amenities
            <>
              <Text style={styles.question}>What amenities do you have</Text>
              <View style={styles.amenitiesList}>
                {AMENITIES.map((amenity) => (
                  <TouchableOpacity
                    key={amenity.id}
                    style={[
                      styles.amenityOption,
                      selectedAmenities.includes(amenity.id) && styles.amenitySelected,
                    ]}
                    onPress={() => toggleAmenity(amenity.id)}
                  >
                    <View style={styles.amenityLeft}>
                      <Ionicons
                        name={amenity.icon}
                        size={24}
                        color={selectedAmenities.includes(amenity.id) ? PRIMARY_DARK : TEXT_MEDIUM}
                      />
                      <Text
                        style={[
                          styles.amenityText,
                          selectedAmenities.includes(amenity.id) && styles.amenityTextSelected,
                        ]}
                      >
                        {amenity.label}
                      </Text>
                    </View>
                    <View style={[
                      styles.checkbox,
                      selectedAmenities.includes(amenity.id) && styles.checkboxChecked,
                    ]}>
                      {selectedAmenities.includes(amenity.id) && (
                        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}

                {/* Others + Button */}
                <TouchableOpacity
                  style={styles.othersButton}
                  onPress={() => alert("Add custom amenity feature coming soon!")}
                >
                  <View style={styles.amenityLeft}>
                    <Ionicons name="add-circle-outline" size={24} color={TEXT_MEDIUM} />
                    <Text style={styles.othersButtonText}>Others +</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </>
          ) : step === 8 ? (
            // Step 8: Media Upload
            <>
              <Text style={styles.question}>Add different media of the hotel</Text>
              <View style={styles.mediaUploadList}>
                {/* Exterior Videos */}
                <MediaUploadCard
                  icon="videocam"
                  title="Exterior videos"
                  count={exteriorVideos.length}
                  onPress={() => handleUploadMedia('exteriorVideos')}
                />

                {/* Exterior Photos */}
                <MediaUploadCard
                  icon="camera"
                  title="Upload photos"
                  subtitle="Exterior"
                  count={exteriorPhotos.length}
                  onPress={() => handleUploadMedia('exteriorPhotos')}
                  onReorder={() => handleReorderMedia('exteriorPhotos', 'Exterior Media')}
                />

                {/* Amenities */}
                <MediaUploadCard
                  icon="fitness"
                  title="Amenities"
                  count={amenityPhotos.length}
                  onPress={() => handleUploadMedia('amenityPhotos')}
                  onReorder={() => handleReorderMedia('amenityPhotos', 'Amenities')}
                />

                {/* Dining Options */}
                <MediaUploadCard
                  icon="restaurant"
                  title="Dining Options"
                  count={diningPhotos.length}
                  onPress={() => handleUploadMedia('diningPhotos')}
                  onReorder={() => handleReorderMedia('diningPhotos', 'Dining Options')}
                />

                {/* Special Features */}
                <MediaUploadCard
                  icon="star"
                  title="Special Features"
                  count={specialFeaturePhotos.length}
                  onPress={() => handleUploadMedia('specialFeaturePhotos')}
                  onReorder={() => handleReorderMedia('specialFeaturePhotos', 'Special Features')}
                />

                {/* Event Spaces */}
                <MediaUploadCard
                  icon="calendar"
                  title="Event Spaces"
                  count={eventSpacePhotos.length}
                  onPress={() => handleUploadMedia('eventSpacePhotos')}
                  onReorder={() => handleReorderMedia('eventSpacePhotos', 'Event Spaces')}
                />

                {/* Nearby Attractions */}
                <MediaUploadCard
                  icon="location"
                  title="Nearby Attractions"
                  count={nearbyAttractionPhotos.length}
                  onPress={() => handleUploadMedia('nearbyAttractionPhotos')}
                  onReorder={() => handleReorderMedia('nearbyAttractionPhotos', 'Nearby Attractions')}
                />
              </View>
            </>
          ) : step === 9 ? (
            // Step 9: Room Selection
            <>
              <Text style={styles.question}>Choose the type of rooms you have and number</Text>
              <View style={styles.roomTypesGrid}>
                {ROOM_TYPES.map((room) => (
                  <RoomTypeCard
                    key={room.id}
                    label={room.label}
                    count={roomCounts[room.id] || 0}
                    onPress={() => setSelectedRoomForEdit(room)}
                  />
                ))}
              </View>
            </>
          ) : step === 10 ? (
            // Step 10: Room Media Upload
            <>
              <Text style={styles.question}>Let's add some media of each room type</Text>
              <View style={styles.roomMediaList}>
                {ROOM_TYPES.filter(room => (roomCounts[room.id] || 0) > 0).map((room) => (
                  <RoomMediaCard
                    key={room.id}
                    label={room.label}
                    count={roomCounts[room.id]}
                    media={roomMedia[room.id] || []}
                    onUpload={() => handleUploadRoomMedia(room.id)}
                    onReorder={() => handleReorderRoomMedia(room.id, room.label)}
                  />
                ))}
              </View>
            </>
          ) : step === 11 ? (
            // Step 11: Room Pricing
            <>
              <Text style={styles.question}>Add prices</Text>
              <View style={styles.pricingList}>
                {ROOM_TYPES.filter(room => (roomCounts[room.id] || 0) > 0).map((room) => (
                  <RoomPricingCard
                    key={room.id}
                    label={room.label}
                    media={roomMedia[room.id] || []}
                    price={roomPrices[room.id] || ""}
                    onPriceChange={(price) => handleRoomPriceChange(room.id, price)}
                  />
                ))}
              </View>
            </>
          ) : step === 12 ? (
            // Step 12: What makes your hotel unique
            <>
              <Text style={styles.question}>What make your hotel unique</Text>

              {/* Design Concept */}
              <Text style={styles.uniqueLabel}>
                What inspired the design or concept of your hotel?
              </Text>
              <Text style={styles.uniqueHint}>
                (Explain how your hotel's style, architecture, or theme stands out.)
              </Text>
              <TextInput
                style={[
                  styles.uniqueTextArea,
                  focusedField === "designConcept" && styles.inputFocused,
                ]}
                value={designConcept}
                onChangeText={setDesignConcept}
                onFocus={() => setFocusedField("designConcept")}
                onBlur={() => setFocusedField("")}
                placeholder=""
                placeholderTextColor="#aaa"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />

              {/* Unique Experiences */}
              <Text style={styles.uniqueLabel}>
                What unique experiences or activities do you offer to guests?
              </Text>
              <Text style={styles.uniqueHint}>
                (E.g., cultural tours, workshops, exclusive events, etc.)
              </Text>
              <TextInput
                style={[
                  styles.uniqueTextArea,
                  focusedField === "uniqueExperiences" && styles.inputFocused,
                ]}
                value={uniqueExperiences}
                onChangeText={setUniqueExperiences}
                onFocus={() => setFocusedField("uniqueExperiences")}
                onBlur={() => setFocusedField("")}
                placeholder=""
                placeholderTextColor="#aaa"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />

              {/* Customer Service */}
              <Text style={styles.uniqueLabel}>
                What is your approach to customer service?
              </Text>
              <Text style={styles.uniqueHint}>
                (E.g., personalized service, multilingual staff, tailored experiences.)
              </Text>
              <TextInput
                style={[
                  styles.uniqueTextArea,
                  focusedField === "customerService" && styles.inputFocused,
                ]}
                value={customerService}
                onChangeText={setCustomerService}
                onFocus={() => setFocusedField("customerService")}
                onBlur={() => setFocusedField("")}
                placeholder=""
                placeholderTextColor="#aaa"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />

              {/* Hotel Story */}
              <Text style={styles.uniqueLabel}>
                Is there a story or vision behind the creation of your hotel?
              </Text>
              <TextInput
                style={[
                  styles.uniqueTextArea,
                  focusedField === "hotelStory" && styles.inputFocused,
                ]}
                value={hotelStory}
                onChangeText={setHotelStory}
                onFocus={() => setFocusedField("hotelStory")}
                onBlur={() => setFocusedField("")}
                placeholder=""
                placeholderTextColor="#aaa"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />

              {/* Other Details */}
              <Text style={styles.uniqueLabel}>
                Any other details you'd like to share about what makes your hotel unique?
              </Text>
              <TextInput
                style={[
                  styles.uniqueTextArea,
                  focusedField === "otherDetails" && styles.inputFocused,
                ]}
                value={otherDetails}
                onChangeText={setOtherDetails}
                onFocus={() => setFocusedField("otherDetails")}
                onBlur={() => setFocusedField("")}
                placeholder=""
                placeholderTextColor="#aaa"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </>
          ) : null}
        </ScrollView>

        {/* Room Count Modal */}
        <Modal
          visible={selectedRoomForEdit !== null}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setSelectedRoomForEdit(null)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setSelectedRoomForEdit(null)}
          >
            <TouchableOpacity
              style={styles.modalContent}
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.modalHeader}>
                <View style={styles.modalDragHandle} />
              </View>

              <View style={styles.modalBody}>
                <Text style={styles.modalTitle}>Number of room</Text>

                <View style={styles.modalCounter}>
                  <TouchableOpacity
                    style={styles.modalCounterButton}
                    onPress={() => {
                      if (selectedRoomForEdit) {
                        decrementRoomCount(selectedRoomForEdit.id);
                      }
                    }}
                  >
                    <Ionicons name="remove-circle-outline" size={32} color={TEXT_DARK} />
                  </TouchableOpacity>

                  <Text style={styles.modalCountText}>
                    {selectedRoomForEdit ? (roomCounts[selectedRoomForEdit.id] || 0) : 0}
                  </Text>

                  <TouchableOpacity
                    style={styles.modalCounterButton}
                    onPress={() => {
                      if (selectedRoomForEdit) {
                        incrementRoomCount(selectedRoomForEdit.id);
                      }
                    }}
                  >
                    <Ionicons name="add-circle-outline" size={32} color={TEXT_DARK} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

        {/* Bottom Button */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.letsGoButton} onPress={handleNext}>
            <Text style={styles.letsGoButtonText}>
              {step >= 3 ? "Continue" : "Let's go"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Media Upload Card Component
function MediaUploadCard({ icon, title, subtitle, count, onPress, onReorder }) {
  return (
    <View style={styles.mediaCardContainer}>
      <TouchableOpacity style={styles.mediaCardHeader} onPress={onPress}>
        <View style={styles.mediaCardIcon}>
          <Ionicons name={icon} size={24} color={PRIMARY_DARK} />
        </View>
        <Text style={styles.mediaCardTitle}>{title}</Text>
      </TouchableOpacity>

      <View style={styles.mediaButtonsRow}>
        <TouchableOpacity
          style={[styles.mediaUploadButton, count > 0 && styles.mediaUploadButtonWithReorder]}
          onPress={onPress}
        >
          <Text style={styles.mediaUploadButtonText}>
            {count > 0 ? `${count} uploaded` : "Upload photos"}
          </Text>
          <Ionicons name="cloud-upload-outline" size={20} color={TEXT_MEDIUM} />
        </TouchableOpacity>

        {count > 0 && onReorder && (
          <TouchableOpacity style={styles.reorderButton} onPress={onReorder}>
            <Ionicons name="reorder-three" size={20} color={PRIMARY_DARK} />
          </TouchableOpacity>
        )}
      </View>

      {subtitle && <Text style={styles.mediaCardSubtitle}>{subtitle}</Text>}
    </View>
  );
}

// Room Type Card Component
function RoomTypeCard({ label, count, onPress }) {
  return (
    <TouchableOpacity
      style={styles.roomTypeCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons name="bed" size={40} color={TEXT_DARK} />
      <Text style={styles.roomTypeLabel}>
        {label}: {count > 0 ? count : ''}
      </Text>
    </TouchableOpacity>
  );
}

// Room Pricing Card Component
function RoomPricingCard({ label, media, price, onPriceChange }) {
  const firstImage = media && media.length > 0 ? media[0] : null;

  return (
    <View style={styles.pricingCard}>
      {/* Room Image Preview */}
      <View style={styles.pricingImageContainer}>
        {firstImage ? (
          <Image
            source={{ uri: firstImage.uri || firstImage }}
            style={styles.pricingImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.pricingImagePlaceholder}>
            <Ionicons name="bed-outline" size={48} color={TEXT_MEDIUM} />
          </View>
        )}
      </View>

      {/* Room Label */}
      <Text style={styles.pricingRoomLabel}>{label}:</Text>

      {/* Price Input */}
      <View style={styles.priceInputContainer}>
        <Text style={styles.priceCurrency}>$</Text>
        <TextInput
          style={styles.priceInput}
          value={price}
          onChangeText={onPriceChange}
          placeholder="644,653"
          placeholderTextColor="#CCCCCC"
          keyboardType="numeric"
        />
      </View>
    </View>
  );
}

// Room Media Card Component
function RoomMediaCard({ label, count, media, onUpload, onReorder }) {
  return (
    <View style={styles.roomMediaCard}>
      {/* Preview Image or Placeholder */}
      {media.length > 0 ? (
        <View style={styles.roomMediaPreview}>
          <View style={styles.roomMediaImageContainer}>
            {/* Show first uploaded image as preview */}
            <View style={styles.roomMediaPlaceholder}>
              <Ionicons name="image" size={40} color={TEXT_MEDIUM} />
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.roomMediaPreview}>
          <View style={styles.roomMediaImageContainer}>
            <View style={styles.roomMediaPlaceholder}>
              <Ionicons name="image-outline" size={40} color={TEXT_MEDIUM} />
            </View>
          </View>
        </View>
      )}

      {/* Room Info Card */}
      <View style={styles.roomMediaInfo}>
        <View style={styles.roomMediaHeader}>
          <Ionicons name="bed" size={24} color={PRIMARY_DARK} />
          <Text style={styles.roomMediaLabel}>{label}: {count}</Text>
        </View>
      </View>

      {/* Upload and Reorder Buttons */}
      <View style={styles.roomMediaButtonsRow}>
        <TouchableOpacity
          style={[styles.roomMediaUploadButton, media.length > 0 && styles.roomMediaUploadButtonWithReorder]}
          onPress={onUpload}
        >
          <Text style={styles.roomMediaUploadText}>Upload Media</Text>
          <Ionicons name="cloud-upload-outline" size={20} color={TEXT_DARK} />
        </TouchableOpacity>

        {media.length > 0 && onReorder && (
          <TouchableOpacity style={styles.roomMediaReorderButton} onPress={onReorder}>
            <Ionicons name="reorder-three" size={20} color={PRIMARY_DARK} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  backBtn: {
    padding: 4,
  },

  skipText: {
    fontSize: 16,
    fontFamily: "Manrope-Medium",
    color: TEXT_MEDIUM,
  },

  progressBarContainer: {
    height: 4,
    backgroundColor: BORDER_GRAY,
    marginHorizontal: 16,
    marginBottom: 40,
    borderRadius: 2,
  },

  progressBar: {
    height: "100%",
    backgroundColor: PRIMARY_DARK,
    borderRadius: 2,
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
  },

  question: {
    fontSize: 18,
    fontWeight: "500",
    fontFamily: "Manrope-Medium",
    color: TEXT_DARK,
    marginBottom: 24,
  },

  input: {
    borderBottomWidth: 2,
    borderBottomColor: BORDER_GRAY,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: "Manrope-Regular",
    color: TEXT_DARK,
  },

  inputFocused: {
    borderBottomColor: PRIMARY_DARK,
  },

  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
  },

  letsGoButton: {
    backgroundColor: PRIMARY_DARK,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  letsGoButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Manrope-Bold",
  },

  rolesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginTop: 24,
  },

  roleCard: {
    width: "47%",
    aspectRatio: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: BORDER_GRAY,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },

  roleCardSelected: {
    borderColor: PRIMARY_DARK,
    backgroundColor: "#F0F4FF",
  },

  roleLabel: {
    fontSize: 13,
    fontFamily: "Manrope-Medium",
    color: TEXT_DARK,
    textAlign: "center",
  },

  roleLabelSelected: {
    color: PRIMARY_DARK,
    fontWeight: "600",
  },

  label: {
    fontSize: 13,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
    marginBottom: 8,
    marginTop: 16,
  },

  contactInput: {
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    fontFamily: "Manrope-Regular",
    color: TEXT_DARK,
    backgroundColor: "#FFFFFF",
  },

  hotelTypesList: {
    marginTop: 24,
    gap: 12,
  },

  hotelTypeOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: BORDER_GRAY,
    borderRadius: 10,
  },

  hotelTypeSelected: {
    borderColor: PRIMARY_DARK,
    backgroundColor: "#F0F4FF",
  },

  hotelTypeText: {
    fontSize: 15,
    fontFamily: "Manrope-Regular",
    color: TEXT_DARK,
  },

  hotelTypeTextSelected: {
    fontFamily: "Manrope-SemiBold",
    color: PRIMARY_DARK,
  },

  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: BORDER_GRAY,
    justifyContent: "center",
    alignItems: "center",
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: PRIMARY_DARK,
  },

  // Step 6: Location
  mapContainer: {
    width: "100%",
    marginBottom: 16,
  },

  mapView: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 8,
  },

  mapMarker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: PRIMARY_DARK,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  mapHint: {
    fontSize: 12,
    fontFamily: "Manrope",
    color: TEXT_MEDIUM,
    textAlign: "center",
    marginBottom: 16,
  },

  mapPlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: "#F0F4FF",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: BORDER_GRAY,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },

  mapPlaceholderText: {
    fontSize: 14,
    fontFamily: "Manrope-Medium",
    color: TEXT_MEDIUM,
    marginTop: 12,
    textAlign: "center",
    paddingHorizontal: 20,
  },

  // Step 7: Amenities
  amenitiesList: {
    marginTop: 24,
    gap: 12,
  },

  amenityOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: BORDER_GRAY,
    borderRadius: 10,
  },

  amenitySelected: {
    borderColor: PRIMARY_DARK,
    backgroundColor: "#F0F4FF",
  },

  amenityLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  amenityText: {
    fontSize: 15,
    fontFamily: "Manrope-Regular",
    color: TEXT_DARK,
  },

  amenityTextSelected: {
    fontFamily: "Manrope-SemiBold",
    color: PRIMARY_DARK,
  },

  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: BORDER_GRAY,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  checkboxChecked: {
    backgroundColor: PRIMARY_DARK,
    borderColor: PRIMARY_DARK,
  },

  othersButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: BORDER_GRAY,
    borderRadius: 10,
    borderStyle: "dashed",
  },

  othersButtonText: {
    fontSize: 15,
    fontFamily: "Manrope-Medium",
    color: TEXT_MEDIUM,
  },

  // Step 8: Media Upload
  mediaUploadList: {
    marginTop: 16,
    gap: 16,
  },

  mediaCardContainer: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },

  mediaCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 4,
  },

  mediaCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#F0F4FF",
    justifyContent: "center",
    alignItems: "center",
  },

  mediaCardTitle: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Manrope-Medium",
    color: TEXT_DARK,
  },

  mediaCardSubtitle: {
    fontSize: 12,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
    marginTop: -4,
  },

  mediaButtonsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  mediaUploadButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#EDF4F7",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
  },

  mediaUploadButtonWithReorder: {
    flex: 1,
  },

  mediaUploadButtonText: {
    fontSize: 14,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
  },

  reorderButton: {
    width: 48,
    height: 48,
    backgroundColor: "#F0F4FF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: PRIMARY_DARK,
    justifyContent: "center",
    alignItems: "center",
  },

  // Step 9: Room Selection
  roomTypesGrid: {
    marginTop: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },

  roomTypeCard: {
    width: "47%",
    aspectRatio: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 8,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },

  roomTypeLabel: {
    fontSize: 13,
    fontFamily: "Manrope-Medium",
    color: TEXT_DARK,
    textAlign: "center",
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
  },

  modalHeader: {
    paddingTop: 12,
    paddingBottom: 8,
    alignItems: "center",
  },

  modalDragHandle: {
    width: 40,
    height: 4,
    backgroundColor: BORDER_GRAY,
    borderRadius: 2,
  },

  modalBody: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },

  modalTitle: {
    fontSize: 16,
    fontFamily: "Manrope-Medium",
    color: TEXT_DARK,
    textAlign: "center",
    marginBottom: 32,
  },

  modalCounter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
  },

  modalCounterButton: {
    padding: 8,
  },

  modalCountText: {
    fontSize: 40,
    fontFamily: "Manrope-Bold",
    color: TEXT_DARK,
    minWidth: 60,
    textAlign: "center",
  },

  // Step 10: Room Media Upload
  roomMediaList: {
    marginTop: 16,
    gap: 16,
  },

  roomMediaCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 8,
    overflow: "hidden",
  },

  roomMediaPreview: {
    width: "100%",
    height: 200,
    backgroundColor: "#F5F5F5",
  },

  roomMediaImageContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  roomMediaPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },

  roomMediaInfo: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: BORDER_GRAY,
    padding: 12,
  },

  roomMediaHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  roomMediaLabel: {
    fontSize: 15,
    fontFamily: "Manrope-Medium",
    color: TEXT_DARK,
  },

  roomMediaButtonsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDF4F7",
    borderTopWidth: 1,
    borderTopColor: BORDER_GRAY,
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  roomMediaUploadButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
  },

  roomMediaUploadButtonWithReorder: {
    flex: 1,
  },

  roomMediaUploadText: {
    fontSize: 14,
    fontFamily: "Manrope-Medium",
    color: TEXT_DARK,
  },

  roomMediaReorderButton: {
    width: 48,
    height: 48,
    backgroundColor: "#F0F4FF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: PRIMARY_DARK,
    justifyContent: "center",
    alignItems: "center",
  },

  // Step 11: Room Pricing
  pricingList: {
    marginTop: 16,
    gap: 24,
  },

  pricingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: BORDER_GRAY,
  },

  pricingImageContainer: {
    width: "100%",
    height: 200,
    backgroundColor: "#F5F5F5",
  },

  pricingImage: {
    width: "100%",
    height: "100%",
  },

  pricingImagePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },

  pricingRoomLabel: {
    fontSize: 18,
    fontFamily: "Manrope-SemiBold",
    color: TEXT_DARK,
    textAlign: "center",
    marginTop: 20,
    marginBottom: 12,
  },

  priceInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },

  priceCurrency: {
    fontSize: 24,
    fontFamily: "Manrope-SemiBold",
    color: TEXT_DARK,
    marginRight: 8,
  },

  priceInput: {
    flex: 1,
    fontSize: 24,
    fontFamily: "Manrope-SemiBold",
    color: TEXT_DARK,
    textAlign: "center",
    padding: 0,
  },

  // Step 12: Hotel Unique Details
  uniqueLabel: {
    fontSize: 15,
    fontFamily: "Manrope-Medium",
    color: TEXT_DARK,
    marginTop: 20,
    marginBottom: 4,
    lineHeight: 22,
  },

  uniqueHint: {
    fontSize: 13,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
    marginBottom: 12,
    lineHeight: 18,
  },

  uniqueTextArea: {
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    fontFamily: "Manrope-Regular",
    color: TEXT_DARK,
    backgroundColor: "#FFFFFF",
    minHeight: 100,
    marginBottom: 16,
  },
});
