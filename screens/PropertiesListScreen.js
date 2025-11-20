// screens/PropertiesListScreen.js
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { calculateDistance, formatDistance } from "../utils/locationService";

// === Design tokens from Figma ===
const PRIMARY_PURPLE = "#010F1D"; // 70% purple
const TEXT_DARK = "#0F3040";      // 70% gray
const TEXT_MEDIUM = "#3E5663";    // 50% gray
const TEXT_LIGHT = "#5F737D";     // 40% gray
const BG_CHIP = "#F1F3F4";        // 15% gray
const BORDER_LIGHT = "#D4DADC";   // 20% gray
const RATING_YELLOW = "#A36F00";  // 70% yellow

export default function PropertiesListScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  // Get location params from route
  const { latitude, longitude, radius, locationName, q } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState(q || "");

  async function getToken() {
    return await AsyncStorage.getItem("token");
  }

  async function loadProperties() {
    try {
      setLoading(true);
      const token = await getToken();

      // Build query URL
      let url = `http://192.168.100.6:4000/api/properties?q=${search}`;

      // Add location params if available
      if (latitude && longitude) {
        url += `&lat=${latitude}&lon=${longitude}&radius=${radius || 10}`;
      }

      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      const data = await res.json();
      let items = data.items || [];

      // If we have user location, calculate distances and sort by distance
      if (latitude && longitude) {
        items = items.map(property => ({
          ...property,
          distance: property.latitude && property.longitude
            ? calculateDistance(latitude, longitude, property.latitude, property.longitude)
            : null,
        })).filter(property => {
          // Filter by radius if specified
          if (radius && property.distance) {
            return property.distance <= radius;
          }
          return true;
        }).sort((a, b) => {
          // Sort by distance (closest first)
          if (a.distance === null) return 1;
          if (b.distance === null) return -1;
          return a.distance - b.distance;
        });
      }

      setProperties(items);
    } catch (err) {
      console.log("❌ Error loading properties:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProperties();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER (back + search + filter) */}
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={TEXT_DARK} />
          </TouchableOpacity>

          <View style={styles.searchWrapper}>
            <View style={styles.searchBar}>
              <Ionicons
                name="search-outline"
                size={18}
                color={TEXT_LIGHT}
                style={{ marginRight: 6 }}
              />
              <TextInput
                placeholder="Search for location, hotel"
                placeholderTextColor={TEXT_LIGHT}
                value={search}
                onChangeText={setSearch}
                onSubmitEditing={loadProperties}
                style={styles.searchInput}
              />
            </View>

            <TouchableOpacity style={styles.filterCircle}>
              <Ionicons
                name="options-outline"
                size={18}
                color="#000203"
                style={{ transform: [{ rotate: "90deg" }] }}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* FILTER CHIPS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          <FilterChip label="All" active />
          <FilterChip label="Popular" />
          <FilterChip label="Price" />
          <FilterChip label="Amenities" />
          <FilterChip label="Type" />
        </ScrollView>

        {/* LOCATION BADGE */}
        {locationName && (
          <View style={styles.locationBadge}>
            <Ionicons name="location" size={14} color={PRIMARY_PURPLE} />
            <Text style={styles.locationBadgeText}>
              Properties near {locationName}
            </Text>
          </View>
        )}
      </View>

      {/* MAIN SCROLL CONTENT */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {loading && (
          <ActivityIndicator
            size="large"
            color={PRIMARY_PURPLE}
            style={{ marginTop: 40 }}
          />
        )}

        {!loading &&
          properties.map((hotel) => (
            <TouchableOpacity
              key={hotel.id}
              style={styles.card}
              activeOpacity={0.9}
              onPress={() =>
                navigation.navigate("PropertyDetailsScreen", {
                  id: hotel.id,
                  property: hotel,
                })
              }
            >
              {/* IMAGE */}
              <Image
                source={{
                  uri:
                    hotel.coverImage ||
                    hotel.image ||
                    "https://via.placeholder.com/400x300",
                }}
                style={styles.cardImage}
              />

              {/* LOWER SECTION */}
              <View style={styles.cardBottomRow}>
                <View style={styles.cardTextBlock}>
                  <Text numberOfLines={1} style={styles.cardTitle}>
                    {hotel.title || hotel.name || "Lugar de grande 510,"}
                  </Text>
                  <Text numberOfLines={1} style={styles.cardDistance}>
                    {hotel.distance
                      ? `${formatDistance(hotel.distance)} away`
                      : (hotel.city ? hotel.city : "Lagos")}
                  </Text>
                  <Text style={styles.cardPrice}>
                    ₦
                    {hotel.nightlyPrice
                      ? hotel.nightlyPrice.toLocaleString()
                      : "644,653"}
                  </Text>
                </View>

                <View style={styles.cardRightBlock}>
                  {/* Pool */}
                  <View style={styles.poolRow}>
                    <Ionicons
                      name="water-outline"
                      size={16}
                      color="#294452"
                    />
                    <Text style={styles.poolText}>Pool</Text>
                  </View>

                  {/* Rating */}
                  <View style={styles.ratingRow}>
                    <Ionicons
                      name="star"
                      size={12}
                      color={RATING_YELLOW}
                    />
                    <Text style={styles.ratingText}>
                      {hotel.avgRating
                        ? hotel.avgRating.toFixed(1)
                        : "78"}{" "}
                      (200)
                    </Text>
                  </View>

                  {/* Status */}
                  <Text style={styles.statusText}>
                    {hotel.status || "Good"}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}

        {/* extra bottom space so it doesn’t clash with tab bar */}
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// === Small chip component ===
function FilterChip({ label, active = false }) {
  return (
    <View
      style={[
        styles.chip,
        active && styles.chipActive,
      ]}
    >
      <Text
        style={[
          styles.chipText,
          active && styles.chipTextActive,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

// === Styles ===
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  // Header (search + chips)
  headerContainer: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 0.4,
    borderBottomColor: BORDER_LIGHT,
    paddingTop: 4,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  searchWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER_LIGHT,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: TEXT_DARK,
    fontFamily: "Manrope",
  },
  filterCircle: {
    width: 32,
    height: 32,
    borderRadius: 200,
    borderWidth: 0.4,
    borderColor: "#000203",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
    backgroundColor: "#FFFFFF",
  },

  chipsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  locationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 8,
    backgroundColor: "#EDF4FF",
    borderRadius: 6,
    marginLeft: 16,
    alignSelf: "flex-start",
  },
  locationBadgeText: {
    fontSize: 13,
    fontFamily: "Manrope",
    fontWeight: "500",
    color: PRIMARY_PURPLE,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: BG_CHIP,
  },
  chipActive: {
    backgroundColor: "#000203",
  },
  chipText: {
    fontSize: 12,
    fontFamily: "Manrope",
    fontWeight: "300",
    color: "#404B5A",
  },
  chipTextActive: {
    color: "#FCFEFE",
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: "#FFFFFF",
  },

  // Card
  card: {
    width: "100%",
    marginBottom: 24,
  },
  cardImage: {
    width: "100%",
    height: 184,
    borderRadius: 8,
  },
  cardBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 8,
  },
  cardTextBlock: {
    flex: 1,
    marginRight: 16,
  },
  cardTitle: {
    fontFamily: "Manrope",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 16,
    color: TEXT_DARK,
    marginBottom: 4,
  },
  cardDistance: {
    fontFamily: "Manrope",
    fontWeight: "300",
    fontSize: 12,
    lineHeight: 12,
    color: TEXT_MEDIUM,
    marginBottom: 4,
  },
  cardPrice: {
    fontFamily: "Manrope",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 16,
    color: TEXT_DARK,
  },

  cardRightBlock: {
    width: 55,
    alignItems: "flex-end",
  },
  poolRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    marginBottom: 2,
  },
  poolText: {
    fontFamily: "Manrope",
    fontWeight: "400",
    fontSize: 10,
    lineHeight: 16,
    color: "#294452",
    marginLeft: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  ratingText: {
    fontFamily: "Manrope",
    fontWeight: "300",
    fontSize: 10,
    lineHeight: 16,
    color: "#294452",
    marginLeft: 4,
  },
  statusText: {
    fontFamily: "Manrope",
    fontWeight: "300",
    fontSize: 10,
    lineHeight: 16,
    color: "#294452",
    textAlign: "center",
  },
});