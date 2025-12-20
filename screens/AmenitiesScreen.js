// screens/AmenitiesScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TEXT_DARK = "#111827";
const TEXT_MEDIUM = "#6B7280";
const TEXT_LIGHT = "#9CA3AF";
const BORDER_GRAY = "#E5E7EB";

export default function AmenitiesScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { property } = route.params || {};

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={TEXT_DARK} />
        </TouchableOpacity>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ABOUT THIS PLACE */}
        <Text style={styles.mainTitle}>About this place</Text>
        <Text style={styles.description}>
          Welcome to Studio 318, a space paradis nestled in a prime location.
          With stylish décor, modern amenities, and a serene atmosphere, your
          experience. Nestled above mystical blue waters, this architectural
          marvel offers a retreat that seamlessly blends luxury, comfort, and
          natural beauty.
        </Text>
        <Text style={styles.description}>
          Whether you're seeking a romantic getaway, a relaxing weekend, or an
          unforgettable experience with friends, Studio 318 has everything you
          need to create memories that last a lifetime.
        </Text>

        {/* THE SPACE */}
        <Text style={styles.sectionTitle}>The Space</Text>
        <Text style={styles.description}>
          Our tastefully designed bungalow feature traditional Indonesian-style
          thatched roofs, floor-to-ceiling windows, and direct access to the
          turquoise waters. Each villa offers plush bedding, high-end amenities,
          and a private deck with sunbeds perfect for sunbathing or stargazing
          at the oceanfront play.
        </Text>

        {/* DURING YOUR STAY */}
        <Text style={styles.sectionTitle}>During Your Stay</Text>
        <Text style={styles.description}>
          Guests can indulge in a variety of experiences, from snorkeling and
          kayaking in the crystal-clear waters to enjoying world-class cuisine at
          our overwater restaurant. The on-site spa offers rejuvenating
          treatments, while our attentive staff is available to arrange
          personalized excursions, romantic dinners, or special celebrations.
        </Text>

        {/* GUEST ACCESS */}
        <Text style={styles.sectionTitle}>Guest Access</Text>
        <Text style={styles.description}>
          • Private overwater bungalows with direct lagoon access
        </Text>
        <Text style={styles.description}>
          • Infinity pool with panoramic ocean views
        </Text>
        <Text style={styles.description}>
          • Fine dining restaurant and beachside bar
        </Text>
        <Text style={styles.description}>
          • Fully equipped spa and wellness center
        </Text>
        <Text style={styles.description}>
          • Complimentary snorkeling gear and kayaks, including gear
        </Text>
        <Text style={styles.description}>
          • 24-hour healthcare lounge service
        </Text>

        {/* WHAT INSPIRED THE DESIGN */}
        <Text style={styles.sectionTitle}>
          What Inspired the Design or Concept of Your Hotel?
        </Text>
        <Text style={styles.description}>
          Lagon de Chuuk (18) was inspired by the natural beauty of its
          surroundings and a commitment to sustainable luxury. The overwater
          bungalows are designed to minimize environmental impact while offering
          guests an unparalleled connection to nature. The Polynesian-style
          architecture melds modern comforts with traditional elements, creating
          a space that feels both timeless and contemporary.
        </Text>

        {/* UNIQUE EXPERIENCES */}
        <Text style={styles.sectionTitle}>
          What Unique Experiences or Activities Do You Offer to Guests?
        </Text>
        <Text style={styles.description}>
          • Sunset cruises aboard a private yacht
        </Text>
        <Text style={styles.description}>
          • Guided snorkeling & diving excursions to vibrant coral reefs
        </Text>
        <Text style={styles.description}>
          • Traditional Polynesian cultural performances
        </Text>
        <Text style={styles.description}>
          • Stargazing sessions with an in-house astronomer
        </Text>
        <Text style={styles.description}>
          • Private beachfront dinners for two romantic occasions
        </Text>

        {/* CUSTOMER SERVICE APPROACH */}
        <Text style={styles.sectionTitle}>
          What Is Your Approach to Customer Service?
        </Text>
        <Text style={styles.description}>
          At Lagon de Chuuk (18), we prioritize personalization and attention to
          detail. From the moment guests arrive, we aim to anticipate their
          needs, providing a warm, attentive service, ensuring that every
          moment of their stay is special. From welcome drinks to tailored
          excursions, we go the extra mile to create unforgettable experiences.
        </Text>

        {/* STORY OR VISION */}
        <Text style={styles.sectionTitle}>
          Is There a Story or Vision Behind the Creation of Your Hotel?
        </Text>
        <Text style={styles.description}>
          Lagon de Chuuk (18) was founded on a vision of offering travelers
          a sanctuary where they could reconnect with nature while enjoying
          world-class luxury. Inspired by the tranquility of the open and a
          passion for sustainability, we set out to create a haven where guests
          can unwind, explore, and make cherished memories in one of the most
          breathtaking settings on Earth.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: BORDER_GRAY,
  },

  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  mainTitle: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Manrope-SemiBold",
    color: TEXT_DARK,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: TEXT_DARK,
    marginTop: 24,
    marginBottom: 12,
  },

  description: {
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
    lineHeight: 22,
    marginBottom: 12,
  },
});
