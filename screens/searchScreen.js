// screens/SearchScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_BASE } from "../lib/api";
import { getCurrentLocation, searchPlaces } from "../utils/locationService";

// Design colors from spec
const PRIMARY_DARK = "#04123C";     // 50% purple Primary
const TEXT_DARK = "#012232";        // 80% Gray
const TEXT_GRAY = "#0F3040";        // 70% Gray
const TEXT_MEDIUM = "#3E5663";      // 50% Gray
const TEXT_LIGHT = "#5F737D";       // 40% Gray
const BG_GRAY = "#F1F3F4";          // 15% Gray
const BORDER_GRAY = "#D4DADC";      // 20% Gray

export default function SearchScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [locationResults, setLocationResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [searchMode, setSearchMode] = useState("location"); // "location" or "property"
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const debounceRef = useRef(null);

  // 🎯 Animate appearance
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: (locationResults.length > 0 || results.length > 0) ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [locationResults, results]);

  // 🎯 Fetch location suggestions with Mapbox
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!search.trim()) {
      setLocationResults([]);
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setLoading(true);

        if (searchMode === "location") {
          // Search for places using Mapbox
          const places = await searchPlaces(search, userLocation);
          setLocationResults(places);
        } else {
          // Search for properties
          const res = await fetch(`${API_BASE}/api/properties?q=${encodeURIComponent(search)}`);
          const json = await res.json();
          const items = Array.isArray(json.items) ? json.items : [];
          setResults(items);
        }
      } catch (err) {
        console.error("Search failed:", err);
        setLocationResults([]);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);
  }, [search, searchMode]);

  // 🎯 Handle "Use My Location" button
  async function handleUseMyLocation() {
    try {
      setLoading(true);
      const location = await getCurrentLocation();
      setUserLocation(location);

      // Navigate to properties list with user's coordinates
      navigation.navigate("PropertiesListScreen", {
        latitude: location.latitude,
        longitude: location.longitude,
        radius: 10, // 10km radius
      });
    } catch (error) {
      console.error("Error getting location:", error);
      alert("Could not get your location. Please enable location services.");
    } finally {
      setLoading(false);
    }
  }

  // 🎯 Keyboard behavior
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
    const hide = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={22} color={PRIMARY_DARK} />
          </TouchableOpacity>

          <View style={styles.searchWrap}>
            <Ionicons name="search" size={18} color={TEXT_LIGHT} />
            <TextInput
              placeholder="Search for location, hotel"
              placeholderTextColor={TEXT_LIGHT}
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
              returnKeyType="search"
              autoFocus
            />
          </View>
        </View>

        {/* Use My Location Button */}
        {!search && (
          <TouchableOpacity
            style={styles.useLocationButton}
            onPress={handleUseMyLocation}
            disabled={loading}
          >
            <View style={styles.locationIconCircle}>
              <Ionicons name="navigate" size={20} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.useLocationText}>Use my current location</Text>
              <Text style={styles.useLocationSub}>Find properties near you</Text>
            </View>
            {loading && <ActivityIndicator size="small" color={PRIMARY_DARK} />}
          </TouchableOpacity>
        )}

        {/* Results List */}
        <Animated.View style={[styles.resultsWrap, { opacity: fadeAnim }]}>
          <FlatList
            data={searchMode === "location" ? locationResults : results}
            keyExtractor={(item, i) => item.id || `${i}`}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              !loading && search.length > 0 ? (
                <Text style={styles.noResult}>No results found</Text>
              ) : null
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultRow}
                activeOpacity={0.7}
                onPress={() => {
                  if (searchMode === "location") {
                    // Navigate with location coordinates
                    navigation.navigate("PropertiesListScreen", {
                      latitude: item.coordinates.latitude,
                      longitude: item.coordinates.longitude,
                      locationName: item.shortName,
                      radius: 10,
                    });
                  } else {
                    // Navigate with property search
                    navigation.navigate("PropertiesListScreen", {
                      q: item.city || item.title,
                    });
                  }
                }}
              >
                <Ionicons
                  name="location-outline"
                  size={18}
                  color={PRIMARY_DARK}
                  style={{ marginRight: 10 }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.resultTitle} numberOfLines={1}>
                    {searchMode === "location" ? item.shortName : item.title || item.city}
                  </Text>
                  <Text style={styles.resultSub} numberOfLines={1}>
                    {searchMode === "location" ? item.placeName : item.city}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            ListFooterComponent={
              loading ? (
                <View style={{ padding: 20, alignItems: "center" }}>
                  <ActivityIndicator size="small" color={PRIMARY_DARK} />
                  <Text style={styles.loadingText}>Searching...</Text>
                </View>
              ) : null
            }
          />
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 8,
    marginTop: 4,
  },
  searchWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BG_GRAY,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginLeft: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 6,
    color: TEXT_DARK,
    fontSize: 14,
    fontFamily: "Manrope",
    fontWeight: "400",
  },
  useLocationButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    backgroundColor: BG_GRAY,
    borderRadius: 12,
    gap: 12,
  },
  locationIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: PRIMARY_DARK,
    justifyContent: "center",
    alignItems: "center",
  },
  useLocationText: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Manrope",
    color: TEXT_DARK,
  },
  useLocationSub: {
    fontSize: 12,
    fontFamily: "Manrope",
    color: TEXT_MEDIUM,
    marginTop: 2,
  },
  resultsWrap: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_GRAY,
  },
  resultTitle: {
    fontSize: 15,
    color: TEXT_DARK,
    fontWeight: "500",
    fontFamily: "Manrope",
  },
  resultSub: {
    fontSize: 13,
    color: TEXT_MEDIUM,
    fontFamily: "Manrope",
    fontWeight: "300",
  },
  noResult: {
    textAlign: "center",
    color: TEXT_MEDIUM,
    marginTop: 30,
    fontSize: 14,
    fontFamily: "Manrope",
    fontWeight: "400",
  },
  loadingText: {
    textAlign: "center",
    color: TEXT_MEDIUM,
    marginVertical: 16,
    fontSize: 13,
    fontFamily: "Manrope",
    fontWeight: "400",
  },
});