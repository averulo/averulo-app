// screens/ExploreHomeScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_BASE } from "../lib/api";

const PRIMARY = "#000A63";
const MUTED = "#6B7280";

export default function ExploreHomeScreen() {
  const navigation = useNavigation();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchProperties();
  }, []);

  async function fetchProperties() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/properties`);
      const data = await res.json();
      const items = data.items || data || [];
      setProperties(items);
    } catch (err) {
      console.log("❌ Error loading properties:", err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleOpenDetails(property) {
    navigation.navigate("PropertyDetailsScreen", { id: property.id });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Search</Text>
          <TouchableOpacity style={styles.mapToggle}>
            <Ionicons name="map-outline" size={18} color={PRIMARY} />
            <Text style={styles.mapToggleText}>Map</Text>
          </TouchableOpacity>
        </View>

        {/* SEARCH BAR (FIGMA STYLE) */}
        <View style={styles.searchCard}>
          <View style={styles.searchRow}>
            <Ionicons name="search-outline" size={18} color={MUTED} />
            <TextInput
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
              placeholder="Where are you going?"
              placeholderTextColor={MUTED}
            />
          </View>

          <View style={styles.searchMetaRow}>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>Check-in</Text>
              <Text style={styles.metaValue}>Add date</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>Check-out</Text>
              <Text style={styles.metaValue}>Add date</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>Guests</Text>
              <Text style={styles.metaValue}>Add guests</Text>
            </View>
          </View>

          <View style={styles.filterRow}>
            <FilterChip label="All" active />
            <FilterChip label="Popular" />
            <FilterChip label="Price" />
            <FilterChip label="Amenities" />
            <FilterChip label="Type" />
          </View>
        </View>

        {/* RESULTS TITLE */}
        <Text style={styles.resultsTitle}>Results</Text>

        {loading ? (
          <View style={{ marginTop: 20 }}>
            <ActivityIndicator color={PRIMARY} />
          </View>
        ) : (
          <View style={styles.listWrapper}>
            <FlatList
              data={properties}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item: p }) => (
                <TouchableOpacity
                  style={styles.card}
                  activeOpacity={0.85}
                  onPress={() => handleOpenDetails(p)}
                >
                  <View style={styles.cardImageWrap}>
                    <Image
                      source={{
                        uri:
                          p.images?.[0]?.url ||
                          "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg",
                      }}
                      style={styles.cardImage}
                    />
                    <View style={styles.ratingBadge}>
                      <Text style={styles.ratingBadgeText}>
                        {p.avgRating?.toFixed(1) || "9.0"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle} numberOfLines={2}>
                      {p.title || "King Hotel, Nigeria"}
                    </Text>
                    <Text style={styles.cardLocation} numberOfLines={1}>
                      {p.city || "Lagos"}, {p.country || "Nigeria"}
                    </Text>

                    <Text style={styles.cardPrice}>
                      ₦{(p.price || 644653).toLocaleString()}
                      <Text style={styles.perNight}> / night</Text>
                    </Text>

                    <Text style={styles.taxesText}>
                      included taxes and fees
                    </Text>

                    <TouchableOpacity
                      style={styles.viewBtn}
                      onPress={() => handleOpenDetails(p)}
                    >
                      <Text style={styles.viewBtnText}>View</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function FilterChip({ label, active }) {
  return (
    <View
      style={[
        styles.chip,
        active && { backgroundColor: PRIMARY },
      ]}
    >
      <Text
        style={[
          styles.chipText,
          active && { color: "#fff" },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  mapToggle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  mapToggleText: {
    marginLeft: 4,
    fontSize: 13,
    color: PRIMARY,
    fontWeight: "500",
  },

  searchCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  searchInput: {
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },

  searchMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 10,
  },
  metaCol: {
    flex: 1,
    paddingHorizontal: 10,
  },
  metaLabel: {
    fontSize: 11,
    color: MUTED,
  },
  metaValue: {
    fontSize: 13,
    color: "#111827",
    fontWeight: "500",
  },
  metaDivider: {
    width: 1,
    height: 26,
    backgroundColor: "#E5E7EB",
  },

  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
  },
  chip: {
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginRight: 6,
    marginBottom: 6,
  },
  chipText: {
    fontSize: 12,
    color: "#111827",
  },

  resultsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 10,
  },

  listWrapper: {
    marginBottom: 20,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 14,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  cardImageWrap: {
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: 170,
  },
  ratingBadge: {
    position: "absolute",
    right: 10,
    bottom: 10,
    backgroundColor: PRIMARY,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingBadgeText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 12,
  },
  cardContent: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  cardLocation: {
    fontSize: 12,
    color: MUTED,
    marginBottom: 6,
  },
  cardPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: PRIMARY,
  },
  perNight: {
    fontSize: 12,
    fontWeight: "400",
    color: MUTED,
  },
  taxesText: {
    fontSize: 11,
    color: MUTED,
    marginTop: 2,
  },
  viewBtn: {
    alignSelf: "flex-start",
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: PRIMARY,
  },
  viewBtnText: {
    color: PRIMARY,
    fontSize: 13,
    fontWeight: "600",
  },
});