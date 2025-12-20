// screens/PropertyDetailsScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";
import { getProperty, getPropertyReviews, toggleFavorite } from "../lib/api";

// Conditionally import Mapbox (requires native rebuild)
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
  console.log("⚠️ Mapbox not available - using fallback image for maps");
}

// Design colors from spec
const PRIMARY_DARK = "#04123C";     // 50% purple Primary
const PRIMARY_BLUE = "#004A6C";     // 80% blue
const TEXT_DARK = "#012232";        // 80% Gray
const TEXT_GRAY = "#0F3040";        // 70% Gray
const TEXT_MEDIUM_GRAY = "#294452"; // 60% Gray
const TEXT_MEDIUM = "#3E5663";      // 50% Gray
const TEXT_LIGHT = "#5F737D";       // 40% Gray
const BG_GRAY = "#F1F3F4";          // 15% Gray
const BORDER_GRAY = "#D4DADC";      // 20% Gray
const YELLOW = "#A36F00";           // 70% yellow
const CARD_RADIUS = 16;

const ROOMS_DATA = [
  {
    title: "Deluxe Double room",
    price: "₦644,653",
    image: "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg",
  },
  {
    title: "Standard Room, 1 king bed",
    price: "₦644,653",
    image: "https://images.pexels.com/photos/261187/pexels-photo-261187.jpeg",
  },
  {
    title: "Premiere Room, 1 king bed",
    price: "₦644,653",
    image: "https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg",
  },
];

const SIMILAR_DATA = [
  {
    name: "King House",
    price: "₦704,653",
    image: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg",
  },
  {
    name: "King House",
    price: "₦704,653",
    image: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg",
  },
  {
    name: "King House",
    price: "₦704,653",
    image: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg",
  },
  {
    name: "King House",
    price: "₦704,653",
    image: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg",
  },
];

export default function PropertyDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const params = route.params || {};
  const passedProperty = params.property || null;
  const id = params.id || params._id || null; // future-proof

  const [prop, setProp] = useState(passedProperty || null);
  const [loading, setLoading] = useState(!passedProperty);
  const [favorite, setFavorite] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // DEBUG (helps you see what is coming in)
  useEffect(() => {
    console.log("PropertyDetailsScreen params:", params);
  }, [params]);

  useEffect(() => {
    // 🔹 If property was passed from the listing, DO NOT FETCH
    if (passedProperty) {
      console.log("✅ Property passed from listing:", passedProperty);
      setProp(passedProperty);
      setFavorite(Boolean(passedProperty?.isFavorite));
      setLoading(false);
      return;
    }

    // 🔹 No property object & no id → nothing to load
    if (!id) {
      console.log("⚠️ No property object and no ID");
      setLoading(false);
      return;
    }

    // 🔹 Skip backend fetch for demo properties
    if (id.startsWith && id.startsWith('demo-')) {
      console.log("⚠️ Demo property ID detected, cannot fetch from backend:", id);
      setLoading(false);
      return;
    }

    // 🔹 Fetch from backend when we only have a real id
    (async () => {
      try {
        setLoading(true);
        console.log("📡 Fetching property from backend with ID:", id);
        const data = await getProperty(id);
        setProp(data);
        setFavorite(Boolean(data?.isFavorite));
      } catch (err) {
        console.log("❌ Failed to load property:", err?.message);
        Alert.alert("Error", "Failed to load property details");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, passedProperty]);

  // Fetch reviews
  useEffect(() => {
    const propertyId = prop?.id || id;
    if (!propertyId) return;

    // Skip fetching reviews for demo properties
    if (propertyId.startsWith('demo-')) {
      setReviews([]);
      setReviewsLoading(false);
      return;
    }

    (async () => {
      try {
        setReviewsLoading(true);
        const data = await getPropertyReviews(propertyId);
        setReviews(data || []);
      } catch (err) {
        console.log("❌ Failed to load reviews:", err?.message);
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    })();
  }, [prop?.id, id]);

  async function handleFavorite() {
    const propertyId = prop?.id || id;

    // Handle demo properties or missing ID
    if (!propertyId || propertyId.startsWith('demo-')) {
      setFavorite((prev) => !prev);
      return;
    }

    try {
      const newVal = !favorite;
      setFavorite(newVal);
      await toggleFavorite(propertyId, null, newVal);
    } catch (err) {
      console.log("❌ Favorite error:", err?.message);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator color={PRIMARY_DARK} />
      </SafeAreaView>
    );
  }

  if (!prop) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Property not found</Text>
      </SafeAreaView>
    );
  }

  // for demo listing, prop has: name, distance, price, image, rating, status
  const title = prop.title || prop.name || "Lugar de grande 510";
  const priceNumber =
    typeof prop.price === "number"
      ? prop.price
      : 644653; // backend number vs demo string
  const rating = prop.avgRating ? prop.avgRating.toFixed(1) : "4.9";
  const reviewCount = prop.reviewsCount || 1540;

  const images = prop.images?.length
    ? prop.images.map((img) => img.url)
    : [
        prop.image ||
          "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg",
        "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
        "https://images.pexels.com/photos/261187/pexels-photo-261187.jpeg",
      ];

  const mainImage = images[0];
  const sideTop = images[1] || images[0];
  const sideBottom = images[2] || images[1] || images[0];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View style={{ flex: 1 }}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 140 }}
          showsVerticalScrollIndicator={false}
        >
          {/* HERO IMAGES + BACK + HEART */}
          <View style={styles.heroWrap}>
            <View style={styles.heroGrid}>
              <Image source={{ uri: mainImage }} style={styles.heroMain} />
              <View style={styles.heroSideColumn}>
                <Image source={{ uri: sideTop }} style={styles.heroSide} />
                <Image source={{ uri: sideBottom }} style={styles.heroSide} />
              </View>
            </View>

            <View style={styles.heroTopRow}>
              <TouchableOpacity
                style={styles.iconCircle}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={20} color={TEXT_DARK} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconCircle}
                onPress={handleFavorite}
              >
                <Ionicons
                  name={favorite ? "heart" : "heart-outline"}
                  size={20}
                  color={favorite ? "crimson" : TEXT_DARK}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* MAIN CONTENT */}
          <View style={styles.content}>
            {/* TITLE + META + RATING */}
            <Text style={styles.title}>{title}</Text>

            <View style={styles.metaRow}>
              <Text style={styles.metaText}>
                {prop.city || "Ikeja, Lagos"} ·{" "}
                {prop.distance || "1.03 miles from city centre"}
              </Text>
            </View>

            <View style={styles.ratingRow}>
              <View style={styles.ratingPill}>
                <Text style={styles.ratingNumber}>{rating}</Text>
              </View>
              <Text style={styles.ratingText}>
                Very good · {reviewCount.toLocaleString()} reviews
              </Text>
            </View>

            {/* AMENITIES */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Amenities</Text>
              <View style={styles.amenitiesWrap}>
                {["Wi-Fi", "Pool", "Bar", "Gym", "Room service", "24/7 Front desk"].map(
                  (a) => (
                    <View key={a} style={styles.amenityChip}>
                      <Ionicons
                        name="checkmark-circle"
                        size={14}
                        color="#16A34A"
                      />
                      <Text style={styles.amenityText}>{a}</Text>
                    </View>
                  )
                )}
              </View>

              <TouchableOpacity
                style={styles.showAmenitiesBtn}
                onPress={() =>
                  navigation.navigate("AmenitiesScreen", {
                    amenities: {
                      room: ["Air conditioning", "Flat-screen TV", "Wardrobe", "Work desk"],
                      bathroom: ["Private bathroom", "Hot shower", "Free toiletries", "Towels"],
                      general: ["Free Wi-Fi", "24/7 front desk", "Daily housekeeping"],
                    },
                  })
                }
              >
                <Text style={styles.showAmenitiesText}>Show all amenities</Text>
              </TouchableOpacity>
            </View>

            {/* ABOUT THIS PLACE */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About this place</Text>
              <Text style={styles.desc}>
                {prop.description ||
                  "Hotel with free parking and near recreation park and open-air museum. Enjoy a calm, comfortable stay with easy access to Lagos’ best spots."}
              </Text>
            </View>

            <TouchableOpacity
          onPress={() =>
            navigation.navigate("AboutPlaceScreen", {
              description: prop.description,
            })
          }
        >
          <Text style={{ fontSize: 13, color: PRIMARY_DARK, marginTop: 6, fontFamily: "Manrope", fontWeight: "500" }}>
            Read more
          </Text>
        </TouchableOpacity>

            {/* LOCATION MAP */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Location</Text>

              {prop.latitude && prop.longitude && MAPBOX_AVAILABLE && Mapbox ? (
                <View style={styles.mapContainer}>
                  <Mapbox.MapView
                    style={styles.mapImage}
                    styleURL={Mapbox.StyleURL.Street}
                    zoomEnabled={true}
                    scrollEnabled={true}
                    pitchEnabled={false}
                    rotateEnabled={false}
                  >
                    <Mapbox.Camera
                      zoomLevel={14}
                      centerCoordinate={[prop.longitude, prop.latitude]}
                      animationMode="moveTo"
                    />
                    <Mapbox.PointAnnotation
                      id="property-location"
                      coordinate={[prop.longitude, prop.latitude]}
                    >
                      <View style={styles.markerContainer}>
                        <View style={styles.marker}>
                          <Ionicons name="location" size={24} color="#FFFFFF" />
                        </View>
                      </View>
                    </Mapbox.PointAnnotation>
                  </Mapbox.MapView>
                </View>
              ) : (
                <Image
                  source={{
                    uri:
                      prop.mapImage ||
                      "https://images.pexels.com/photos/1117452/pexels-photo-1117452.jpeg",
                  }}
                  style={styles.mapImage}
                />
              )}

              <Text style={styles.mapAddress}>
                {prop.address ||
                  "422 Sarto drive, Kings Crescent Valley, Lagos, Nigeria"}
              </Text>
            </View>

            {/* EXPLORE THE AREA */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Explore the area</Text>
              <Text style={styles.areaSubtitle}>Ajose Estate Stay Spot</Text>

              <Image
                source={{
                  uri: "https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg",
                }}
                style={styles.areaImage}
              />

              <Text style={styles.areaTitle}>
                2 Saint street off Pink roof road, Ogba road Lagos
              </Text>

              <View style={styles.areaItems}>
                <Text style={styles.areaLabel}>Recreation park</Text>
                <Text style={styles.areaLabel}>Garden</Text>
                <Text style={styles.areaLabel}>Ajose Estate Stay Spot</Text>
              </View>
            </View>

            {/* BOOKING CARD */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Booking</Text>

              <View style={styles.bookingCard}>
                <TextInput
                  placeholder="Add dates"
                  placeholderTextColor="#A3A3A3"
                  style={styles.bookingInput}
                />
                <TextInput
                  placeholder="Add guests"
                  placeholderTextColor="#A3A3A3"
                  style={styles.bookingInput}
                />
                <Text style={styles.bookingNote}>
                  Request accepted within 15min
                </Text>

                <TouchableOpacity style={styles.contactBtn}>
                  <Text style={styles.contactBtnText}>Contact the Hotel</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* SELECT A ROOM */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select a Room</Text>

              {ROOMS_DATA.map((room, idx) => (
                <View key={idx} style={styles.roomCard}>
                  <Image source={{ uri: room.image }} style={styles.roomImage} />
                  <View style={styles.roomInfoRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.roomTitle}>{room.title}</Text>
                      <Text style={styles.roomPrice}>{room.price}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.roomBtn}
                      onPress={() =>
                        navigation.navigate("BookingDetailsScreen", {
                          property: { ...prop, id: prop.id || id },
                          roomName: room.title,
                          roomImage: room.image,
                        })
                      }
                    >
                      <Text style={styles.roomBtnText}>Book</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            {/* RATING & REVIEW */}
            <View style={styles.section}>
              <View style={styles.ratingHeaderRow}>
                <Text style={styles.sectionTitle}>Rating & Review</Text>
                <Text style={styles.reviewCount}>
                  {reviewsLoading ? "..." : `${reviews.length} review${reviews.length !== 1 ? 's' : ''}`}
                </Text>
              </View>

              {reviewsLoading ? (
                <ActivityIndicator size="small" color={PRIMARY_DARK} style={{ marginVertical: 20 }} />
              ) : reviews.length > 0 ? (
                reviews.map((review, idx) => (
                  <View key={review.id} style={[styles.reviewCard, idx > 0 && { marginTop: 12 }]}>
                    <Image
                      source={{
                        uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(review.guest?.name || review.guest?.email || 'User')}&background=random`,
                      }}
                      style={styles.reviewAvatar}
                    />
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={styles.reviewName}>{review.guest?.name || review.guest?.email || 'Guest'}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Ionicons name="star" size={14} color={YELLOW} />
                          <Text style={{ marginLeft: 4, fontSize: 13, color: TEXT_DARK, fontWeight: '600', fontFamily: 'Manrope' }}>
                            {typeof review.rating === 'number' ? review.rating.toFixed(1) : review.rating}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.reviewRole}>
                        {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </Text>
                      {review.comment && (
                        <Text style={styles.reviewText}>{review.comment}</Text>
                      )}
                      {review.reply && (
                        <View style={{ marginTop: 10, paddingLeft: 12, borderLeftWidth: 3, borderLeftColor: BG_GRAY }}>
                          <Text style={[styles.reviewRole, { fontWeight: '600' }]}>Host reply:</Text>
                          <Text style={styles.reviewText}>{review.reply}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                ))
              ) : (
                <Text style={{ textAlign: 'center', color: TEXT_MEDIUM, marginVertical: 20, fontFamily: 'Manrope' }}>
                  No reviews yet. Be the first to review!
                </Text>
              )}
            </View>

            {/* SIMILAR PROPERTIES */}
            <View style={[styles.section, { marginBottom: 40 }]}>
              <Text style={styles.sectionTitle}>
                Similar properties to Lugar de grande 510
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 16 }}
              >
                {SIMILAR_DATA.map((item, i) => (
                  <View key={i} style={styles.similarCard}>
                    <Image
                      source={{ uri: item.image }}
                      style={styles.similarImage}
                    />
                    <Text style={styles.similarName}>{item.name}</Text>
                    <Text style={styles.similarPrice}>{item.price}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </ScrollView>

        {/* BOTTOM BOOKING BAR */}
        <View style={styles.bottomBar}>
          <View style={{ flex: 1 }}>
            <Text style={styles.bottomPrice}>
              ₦{priceNumber.toLocaleString()}
              <Text style={styles.bottomPerNight}> / night</Text>
            </Text>
            <Text style={styles.bottomSub}>Includes taxes and fees</Text>
          </View>

          <TouchableOpacity
            style={styles.bookBtn}
            onPress={() =>
              navigation.navigate("BookingDetailsScreen", {
                property: { ...prop, id: prop.id || id },
              })
            }
          >
            <Text style={styles.bookBtnText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  center: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  // HERO
  heroWrap: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  heroGrid: {
    flexDirection: "row",
    height: 220,
    borderRadius: CARD_RADIUS,
    overflow: "hidden",
  },
  heroMain: {
    flex: 2,
    height: "100%",
  },
  heroSideColumn: {
    flex: 1,
    marginLeft: 4,
  },
  heroSide: {
    flex: 1,
    width: "100%",
    marginBottom: 4,
  },
  heroTopRow: {
    position: "absolute",
    top: 18,
    left: 24,
    right: 24,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.96)",
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: TEXT_DARK,
    marginBottom: 4,
    fontFamily: "Manrope",
  },
  metaRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    color: TEXT_MEDIUM,
    fontFamily: "Manrope",
    fontWeight: "400",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  ratingPill: {
    backgroundColor: YELLOW,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  ratingNumber: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 12,
    fontFamily: "Manrope",
  },
  ratingText: {
    fontSize: 12,
    color: TEXT_MEDIUM,
    fontFamily: "Manrope",
    fontWeight: "400",
  },

  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: TEXT_DARK,
    marginBottom: 8,
    fontFamily: "Manrope",
  },
  desc: {
    fontSize: 13,
    color: TEXT_MEDIUM,
    lineHeight: 18,
    fontFamily: "Manrope",
    fontWeight: "400",
  },

  amenitiesWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 10,
  },
  amenityChip: {
    flexDirection: "row",
    alignItems: "center",
  },
  amenityText: {
    fontSize: 12,
    color: TEXT_MEDIUM,
    marginLeft: 4,
    fontFamily: "Manrope",
    fontWeight: "400",
  },
  showAmenitiesBtn: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  showAmenitiesText: {
    fontSize: 12,
    color: PRIMARY_DARK,
    fontWeight: "500",
    fontFamily: "Manrope",
  },

  mapContainer: {
    width: "100%",
    height: 180,
    borderRadius: CARD_RADIUS,
    overflow: "hidden",
    marginBottom: 8,
  },
  mapImage: {
    width: "100%",
    height: 180,
    borderRadius: CARD_RADIUS,
    marginBottom: 8,
    backgroundColor: BG_GRAY,
  },
  mapAddress: {
    fontSize: 12,
    color: TEXT_MEDIUM,
    fontFamily: "Manrope",
    fontWeight: "400",
  },
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  marker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: PRIMARY_DARK,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  areaSubtitle: {
    fontSize: 12,
    color: TEXT_MEDIUM,
    marginBottom: 6,
    fontFamily: "Manrope",
    fontWeight: "400",
  },
  areaImage: {
    width: "100%",
    height: 130,
    borderRadius: CARD_RADIUS,
    marginBottom: 8,
  },
  areaTitle: {
    fontSize: 13,
    fontWeight: "500",
    color: TEXT_DARK,
    marginBottom: 4,
    fontFamily: "Manrope",
  },
  areaItems: {
    marginTop: 2,
  },
  areaLabel: {
    fontSize: 12,
    color: TEXT_MEDIUM,
    marginBottom: 2,
    fontFamily: "Manrope",
    fontWeight: "400",
  },

  bookingCard: {
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    padding: 12,
  },
  bookingInput: {
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 13,
    color: TEXT_DARK,
    fontFamily: "Manrope",
    fontWeight: "400",
  },
  bookingNote: {
    fontSize: 11,
    color: TEXT_MEDIUM,
    marginBottom: 12,
    fontFamily: "Manrope",
    fontWeight: "400",
  },
  contactBtn: {
    backgroundColor: PRIMARY_DARK,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  contactBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Manrope",
  },

  roomCard: {
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    marginBottom: 12,
    overflow: "hidden",
  },
  roomImage: {
    width: "100%",
    height: 150,
  },
  roomInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  roomTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: TEXT_DARK,
    marginBottom: 2,
    fontFamily: "Manrope",
  },
  roomPrice: {
    fontSize: 13,
    color: TEXT_MEDIUM,
    fontFamily: "Manrope",
    fontWeight: "400",
  },
  roomBtn: {
    backgroundColor: PRIMARY_DARK,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginLeft: 8,
  },
  roomBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Manrope",
  },

  ratingHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  reviewCount: {
    fontSize: 12,
    color: TEXT_MEDIUM,
    fontFamily: "Manrope",
    fontWeight: "400",
  },
  reviewCard: {
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    padding: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  reviewName: {
    fontSize: 13,
    fontWeight: "600",
    color: TEXT_DARK,
    fontFamily: "Manrope",
  },
  reviewRole: {
    fontSize: 11,
    color: TEXT_MEDIUM,
    marginBottom: 4,
    fontFamily: "Manrope",
    fontWeight: "400",
  },
  reviewText: {
    fontSize: 12,
    color: TEXT_MEDIUM,
    lineHeight: 17,
    fontFamily: "Manrope",
    fontWeight: "400",
  },

  similarCard: {
    width: 140,
    marginRight: 12,
  },
  similarImage: {
    width: "100%",
    height: 100,
    borderRadius: 12,
    marginBottom: 6,
  },
  similarName: {
    fontSize: 12,
    fontWeight: "500",
    color: TEXT_DARK,
    fontFamily: "Manrope",
  },
  similarPrice: {
    fontSize: 12,
    color: TEXT_MEDIUM,
    fontFamily: "Manrope",
    fontWeight: "400",
  },

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: BORDER_GRAY,
    backgroundColor: "#FFFFFF",
  },
  bottomPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: PRIMARY_DARK,
    fontFamily: "Manrope",
  },
  bottomPerNight: {
    fontSize: 12,
    fontWeight: "400",
    color: TEXT_MEDIUM,
    fontFamily: "Manrope",
  },
  bottomSub: {
    fontSize: 11,
    color: TEXT_MEDIUM,
    fontFamily: "Manrope",
    fontWeight: "400",
  },
  bookBtn: {
    backgroundColor: PRIMARY_DARK,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginLeft: 12,
  },
  bookBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Manrope",
  },
});