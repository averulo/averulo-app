// screens/HomeScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../hooks/useAuth";

// Design colors from Figma
const PRIMARY_DARK = "#04123C";     // 50% purple Primary
const TEXT_DARK = "#012232";        // 80% Gray
const TEXT_GRAY = "#0F3040";        // 70% Gray
const TEXT_MEDIUM_GRAY = "#294452"; // 60% Gray
const TEXT_MEDIUM = "#3E5663";      // 50% Gray
const TEXT_LIGHT = "#5F737D";       // 40% Gray
const BG_BLUE = "#EDF4F7";          // 1% blue
const BG_WHITE = "#FCFEFE";         // 10% Gray
const BG_GRAY = "#F1F3F4";          // 15% Gray
const BORDER_GRAY = "#D4DADC";      // 20% Gray
const YELLOW = "#A36F00";           // 70% yellow
const GRAY_1 = "#0D0D0D";           // Gray 1
const GRAY_3 = "#333D49";           // Gray 3

export default function HomeScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const email = user?.email || "johnpeter200@gmail.com";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ─────────── TOP ROW ─────────── */}
        <View style={styles.topRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {email[0]?.toUpperCase()}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.welcomeSmall}>Welcome!</Text>
            <Text style={styles.welcomeEmail}>{email}</Text>
          </View>

          <TouchableOpacity style={styles.iconSquare}>
            <Ionicons name="notifications-outline" size={20} color={PRIMARY_DARK} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.iconSquare, { marginLeft: 8 }]}>
            <Ionicons name="options-outline" size={20} color={PRIMARY_DARK} />
          </TouchableOpacity>
        </View>

        {/* ─────────── SEARCH BAR ─────────── */}
        <TouchableOpacity
          style={styles.searchBar}
          activeOpacity={0.7}
          onPress={() => navigation.navigate("SearchScreen")}
        >
          <Ionicons name="search-outline" size={20} color="#9CA3AF" />
          <Text style={styles.searchPlaceholder}>Search for location, hotel</Text>
        </TouchableOpacity>

        {/* ─────────── FILTER CHIPS ─────────── */}
        <View style={styles.filterRow}>
          <FilterChip label="All" active />
          <FilterChip label="Popular" />
          <FilterChip label="Price" />
          <FilterChip label="Amenities" />
          <FilterChip label="Type" />
        </View>

        {/* ─────────── COMPLETE PROFILE CARD ─────────── */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Text style={styles.profileTitle}>Complete your profile</Text>
            <Ionicons name="close" size={18} color="#9CA3AF" />
          </View>

          <ProfileRow label="Phone Number" />
          <ProfileRow label="Profile" />
          <ProfileRow label="Recommendation" red />
        </View>

        {/* ─────────── RECOMMEND HOTELS ─────────── */}
        <Text style={styles.sectionTitle}>Recommend Hotels</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 16 }}
        >
          {RECOMMEND_DATA.map((hotel, i) => (
            <TouchableOpacity
              key={i}
              style={styles.recommendCard}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate("PropertyDetailsScreen", {
                  property: {
                    id: hotel.id,
                    name: hotel.name,
                    image: hotel.image,
                    price: hotel.price,
                    rating: 9.0,
                  },
                })
              }
            >
              <Image source={{ uri: hotel.image }} style={styles.recommendImg} />
              <View style={styles.recommendInfo}>
                <Text style={styles.recommendName}>{hotel.name}</Text>
                <Text style={styles.recommendLocation}>{hotel.location}</Text>
                <Text style={styles.recommendPrice}>{hotel.price}</Text>

                <View style={styles.ratingRow}>
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>9.0</Text>
                  </View>
                  <Text style={styles.ratingSubText}>Wonderful · 15 reviews</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ─────────── FIND YOUR HOTEL CTA ─────────── */}
        <View style={styles.findSection}>
          <Text style={styles.findTitle}>Find Your hotel</Text>
          <Text style={styles.findSubtitle}>
            Explore the best properties across Africa with ease and confidence
          </Text>

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate("ExploreTab")}
          >
            <Text style={styles.primaryBtnText}>Start your Search</Text>
          </TouchableOpacity>
        </View>

        {/* ─────────── YOUR MATCHES ─────────── */}
        <Text style={styles.sectionTitle}>Your Matches</Text>

        <View style={styles.matchCard}>
          <Image
            source={{ uri: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg" }}
            style={styles.matchImg}
          />
          <View style={styles.matchInfo}>
            <Text style={styles.matchTitle}>King Hotel, Nigeria</Text>
            <Text style={styles.matchLocation}>Nearby · Eiffel Tower Experience</Text>
            <Text style={styles.matchCity}>Lagos, Nigeria</Text>

            <View style={styles.ratingRow}>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>9.0</Text>
              </View>
              <Text style={styles.ratingSubText}>Wonderful · 15 reviews</Text>
            </View>

            <Text style={styles.matchPrice}>₦704,653</Text>
            <Text style={styles.feeText}>included taxes and fees</Text>
          </View>

          <TouchableOpacity style={styles.viewNowBtn}>
            <Text style={styles.viewNowText}>View Now</Text>
          </TouchableOpacity>
        </View>

        {/* ─────────── MOST POPULAR HOTELS ─────────── */}
        <Text style={styles.sectionTitle}>Most popular hotels</Text>

        <View style={styles.gridRow}>
          <PopularCard
            image="https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg"
            title="King Hotel, Nigeria"
            price="₦704,653"
          />
          <PopularCard
            image="https://images.pexels.com/photos/261187/pexels-photo-261187.jpeg"
            title="King Hotel, Nigeria"
            price="₦704,653"
          />
        </View>

        {/* ─────────── FEATURED DEALS ─────────── */}
        <Text style={styles.sectionTitle}>Featured Deals and Promotions</Text>

        <View style={styles.featuredCard}>
          <Image
            source={{ uri: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg" }}
            style={styles.featuredImg}
          />
          <Text style={styles.featuredTitle}>Lugar de grande 510</Text>
          <Text style={styles.featuredPrice}>₦644,653</Text>
        </View>

        {/* ─────────── BUSINESS TRAVELERS ─────────── */}
        <Text style={styles.sectionTitle}>Business Travelers</Text>

        <View style={styles.businessRow}>
          <BusinessCard />
          <BusinessCard />
          <BusinessCard />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

/* ───────────────────── COMPONENTS — EXACTLY SAME AS BEFORE ───────────────────── */

function FilterChip({ label, active }) {
  return (
    <View style={[styles.filterChip, active && { backgroundColor: PRIMARY_DARK }]}>
      <Text style={[styles.filterText, active && { color: "#fff" }]}>{label}</Text>
    </View>
  );
}

function ProfileRow({ label, red }) {
  return (
    <View style={styles.profileRow}>
      <View style={styles.profileLeft}>
        <Ionicons name="document-text-outline" size={16} color="#111827" />
        <Text style={styles.profileRowText}>{label}</Text>
      </View>
      <Ionicons
        name={red ? "close-circle" : "checkmark-circle"}
        size={18}
        color={red ? "#EF4444" : "#16A34A"}
      />
    </View>
  );
}

function PopularCard({ title, price, image }) {
  return (
    <View style={styles.popularCard}>
      <Image source={{ uri: image }} style={styles.popularImg} />
      <Text style={styles.popularTitle}>{title}</Text>
      <Text style={styles.popularPrice}>{price}</Text>
    </View>
  );
}

function BusinessCard() {
  return (
    <View style={styles.businessCard}>
      <Image
        source={{ uri: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg" }}
        style={styles.businessImg}
      />
      <Text style={styles.businessTitle}>King House</Text>
      <Text style={styles.businessPrice}>₦704,653</Text>
    </View>
  );
}

const RECOMMEND_DATA = [
  {
    id: "demo-property-1",
    name: "Lugar de grande 510",
    location: "South Africa",
    price: "₦644,653",
    image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
  },
  {
    id: "demo-property-2",
    name: "King Hotel, Lagos",
    location: "Nigeria",
    price: "₦704,653",
    image: "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg",
  },
];

/* ───────────────────── STYLES (UNCHANGED) ───────────────────── */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: PRIMARY_DARK,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: {
    color: BG_WHITE,
    fontWeight: "700",
    fontSize: 16,
    fontFamily: "Manrope",
  },
  welcomeSmall: {
    fontSize: 13,
    color: TEXT_MEDIUM,
    fontFamily: "Manrope",
  },
  welcomeEmail: {
    fontSize: 15,
    fontWeight: "600",
    color: TEXT_DARK,
    fontFamily: "Manrope",
  },
  iconSquare: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: BG_GRAY,
    justifyContent: "center",
    alignItems: "center",
  },

  searchBar: {
    flexDirection: "row",
    backgroundColor: BG_GRAY,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  searchInput: {
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
    fontFamily: "Manrope",
    color: TEXT_DARK,
  },
  searchPlaceholder: {
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
    fontFamily: "Manrope",
    color: "#9CA3AF",
  },

  filterRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  filterChip: {
    backgroundColor: BORDER_GRAY,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    marginRight: 8,
  },
  filterText: {
    fontSize: 13,
    color: TEXT_DARK,
    fontFamily: "Manrope",
  },

  profileCard: {
    backgroundColor: BG_BLUE,
    padding: 14,
    borderRadius: 14,
    marginBottom: 20,
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  profileTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: TEXT_DARK,
    fontFamily: "Manrope",
  },
  profileRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    alignItems: "center",
  },
  profileLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileRowText: {
    marginLeft: 8,
    fontSize: 13,
    color: TEXT_DARK,
    fontFamily: "Manrope",
  },

  sectionTitle: {
    fontFamily: "Manrope",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 16,
    color: TEXT_GRAY,
    marginBottom: 10,
  },

  recommendCard: {
    width: 314,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    marginRight: 8,
    overflow: "hidden",
    gap: 12,
  },
  recommendImg: {
    width: "100%",
    height: 177,
    borderRadius: 8,
  },
  recommendInfo: {
    paddingHorizontal: 12,
    paddingBottom: 8,
    gap: 4,
  },
  recommendName: {
    fontFamily: "Manrope",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 16,
    color: TEXT_GRAY,
  },
  recommendLocation: {
    fontFamily: "Manrope",
    fontWeight: "300",
    fontSize: 12,
    lineHeight: 12,
    color: TEXT_MEDIUM,
    marginBottom: 4,
  },
  recommendPrice: {
    fontFamily: "Manrope",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 16,
    color: TEXT_GRAY,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  ratingBadge: {
    backgroundColor: YELLOW,
    paddingHorizontal: 4,
    paddingVertical: 0,
    borderRadius: 4,
    marginRight: 2,
    height: 16,
    justifyContent: "center",
  },
  ratingText: {
    fontFamily: "Manrope",
    fontWeight: "300",
    fontSize: 12,
    lineHeight: 12,
    color: BG_WHITE,
  },
  ratingSubText: {
    fontFamily: "Manrope",
    fontWeight: "300",
    fontSize: 12,
    lineHeight: 12,
    color: TEXT_MEDIUM,
  },

  findSection: {
    marginVertical: 14,
    gap: 4,
  },
  findTitle: {
    fontFamily: "Manrope",
    fontWeight: "500",
    fontSize: 32,
    lineHeight: 32,
    letterSpacing: -0.05 * 32,
    color: TEXT_DARK,
  },
  findSubtitle: {
    fontFamily: "Manrope",
    fontWeight: "300",
    fontSize: 14,
    lineHeight: 20,
    color: TEXT_MEDIUM_GRAY,
    marginBottom: 12,
  },
  primaryBtn: {
    backgroundColor: PRIMARY_DARK,
    paddingVertical: 16,
    paddingHorizontal: 16,
    height: 56,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: {
    fontFamily: "Manrope",
    fontWeight: "600",
    fontSize: 18,
    lineHeight: 24,
    textAlign: "center",
    color: BG_WHITE,
  },

  matchCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 0,
    marginBottom: 20,
    gap: 16,
  },
  matchImg: {
    width: "100%",
    height: 256,
    borderRadius: 8,
  },
  matchTitle: {
    fontFamily: "Manrope",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 16,
    color: TEXT_GRAY,
  },
  matchLocation: {
    fontFamily: "Manrope",
    fontWeight: "300",
    fontSize: 10,
    lineHeight: 12,
    color: TEXT_MEDIUM,
  },
  matchCity: {
    fontFamily: "Manrope",
    fontWeight: "300",
    fontSize: 12,
    lineHeight: 12,
    color: TEXT_MEDIUM,
    marginBottom: 4,
  },
  matchPrice: {
    fontFamily: "Manrope",
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 16,
    color: TEXT_GRAY,
    marginTop: 6,
  },
  feeText: {
    fontFamily: "Manrope",
    fontWeight: "300",
    fontSize: 10,
    lineHeight: 12,
    color: TEXT_MEDIUM,
  },
  viewNowBtn: {
    backgroundColor: PRIMARY_DARK,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  viewNowText: {
    fontFamily: "Manrope",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 16,
    color: BG_WHITE,
  },

  gridRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  popularCard: {
    width: 200,
    gap: 8,
  },
  popularImg: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  popularTitle: {
    fontFamily: "Manrope",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 16,
    color: TEXT_GRAY,
  },
  popularLocation: {
    fontFamily: "Manrope",
    fontWeight: "300",
    fontSize: 12,
    lineHeight: 12,
    color: TEXT_MEDIUM,
  },
  popularRating: {
    fontFamily: "Manrope",
    fontWeight: "300",
    fontSize: 10,
    lineHeight: 12,
    color: TEXT_MEDIUM,
  },
  popularPrice: {
    fontFamily: "Manrope",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 16,
    color: TEXT_GRAY,
  },
  popularFeeText: {
    fontFamily: "Manrope",
    fontWeight: "300",
    fontSize: 10,
    lineHeight: 12,
    color: TEXT_MEDIUM,
  },

  featuredCard: {
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 24,
    gap: 8,
  },
  featuredImg: {
    width: "100%",
    height: 184,
    borderRadius: 8,
  },
  featuredTitle: {
    fontFamily: "Manrope",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 16,
    color: TEXT_GRAY,
  },
  featuredPrice: {
    fontFamily: "Manrope",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 16,
    color: TEXT_GRAY,
  },

  businessRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  businessCard: {
    width: 109.33,
    gap: 8,
  },
  businessImg: {
    width: 109.33,
    height: 168,
    borderRadius: 5,
  },
  businessTitle: {
    fontFamily: "Inter",
    fontWeight: "300",
    fontSize: 12,
    lineHeight: 16,
    color: GRAY_1,
  },
  businessPrice: {
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 16,
    color: GRAY_1,
  },
});