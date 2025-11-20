// screens/BookingDetailsScreen.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY = "#000A63";
const MUTED = "#6B7280";
const BORDER_COLOR = "#E5E7EB";

export default function BookingDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { property } = route.params || {};

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Special requests state
  const [specialRequests, setSpecialRequests] = useState({
    earlyCheckIn: false,
    lateCheckOut: false,
    airportPickup: false,
    valetParking: false,
    restaurant: false,
    birthday: false,
    flowersInRoom: false,
    customizedCake: false,
    wheelchairRoom: false,
    grabBars: false,
  });

  const toggleRequest = (key) => {
    setSpecialRequests((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleContinue = async () => {
    if (!property?.id) {
      Alert.alert("Error", "Missing property id");
      return;
    }
    if (!checkIn || !checkOut) {
      Alert.alert("Missing dates", "Choose check-in and check-out dates.");
      return;
    }

    try {
      setSubmitting(true);

      const token = await AsyncStorage.getItem("auth_token");
      if (!token) {
        Alert.alert("Login required", "Please log in again to book.");
        setSubmitting(false);
        return;
      }

      // Compile selected special requests
      const selectedRequests = Object.keys(specialRequests)
        .filter((key) => specialRequests[key])
        .map((key) => key.replace(/([A-Z])/g, " $1").trim())
        .join(", ");

      const response = await fetch(
        "http://192.168.100.6:4000/api/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            propertyId: property.id,
            checkIn,
            checkOut,
            specialRequests: selectedRequests || notes,
          }),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        console.log("❌ Booking error:", response.status, data);
        Alert.alert("Error", data?.error || "Unable to book");
        setSubmitting(false);
        return;
      }

      navigation.navigate("ConfirmBookingScreen", {
        property,
        booking: data,
        checkIn,
        checkOut,
        guestName,
        email,
        phone,
        notes: selectedRequests || notes,
      });
    } catch (err) {
      console.log("❌ Booking exception:", err);
      Alert.alert("Error", "Unable to book");
    } finally {
      setSubmitting(false);
    }
  };

  const nightlyPrice =
    property?.nightlyPrice ??
    (typeof property?.price === "number" ? property.price : null);

  const rating = property?.rating ?? property?.averageRating ?? 0;

  // Process images same way as PropertyDetailsScreen
  const images = property?.images?.length
    ? property.images.map((img) => (typeof img === 'string' ? img : img.url || img))
    : [
        property?.image ||
          "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg",
      ];

  const mainImage = images[0];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {/* HEADER */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: BORDER_COLOR,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 17,
            fontWeight: "600",
            fontFamily: "Manrope-SemiBold",
          }}
        >
          Detail
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* PROPERTY HEADER IMAGE */}
        <View style={{ position: "relative" }}>
          <Image
            source={{
              uri: mainImage,
            }}
            style={{ width: "100%", height: 250 }}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              backgroundColor: "white",
              borderRadius: 20,
              padding: 8,
            }}
          >
            <Ionicons name="heart-outline" size={22} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          {/* PROPERTY TITLE & PRICE */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginTop: 20,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  fontFamily: "Manrope-SemiBold",
                  color: "#111",
                }}
              >
                {property?.title || property?.name || "Property"}
              </Text>
              {rating > 0 && (
                <View
                  style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}
                >
                  <Ionicons name="star" size={16} color="#FFC107" />
                  <Text
                    style={{
                      marginLeft: 4,
                      fontSize: 14,
                      fontWeight: "500",
                      color: "#111",
                    }}
                  >
                    {rating.toFixed(1)}
                  </Text>
                </View>
              )}
            </View>

            {nightlyPrice != null && (
              <View>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "700",
                    fontFamily: "Manrope-Bold",
                    color: "#111",
                  }}
                >
                  ₦{nightlyPrice.toLocaleString()}
                </Text>
              </View>
            )}
          </View>

          {/* PROPERTY DESCRIPTION */}
          {property?.description && (
            <Text
              style={{
                marginTop: 12,
                fontSize: 14,
                color: MUTED,
                lineHeight: 20,
                fontFamily: "Manrope-Regular",
              }}
              numberOfLines={3}
            >
              {property.description}
            </Text>
          )}

          {/* WHO'S THE GUEST */}
          <Text
            style={{
              marginTop: 30,
              fontWeight: "700",
              fontSize: 18,
              fontFamily: "Manrope-Bold",
            }}
          >
            Who's the guest?
          </Text>

          <View style={{ marginTop: 4 }}>
            <Text
              style={{
                fontSize: 13,
                color: MUTED,
                marginBottom: 12,
                fontFamily: "Manrope-Regular",
              }}
            >
              Name
            </Text>
            <TextInput
              placeholder="John Peter"
              value={guestName}
              onChangeText={setGuestName}
              style={inputStyle}
            />

            <Text
              style={{
                fontSize: 13,
                color: MUTED,
                marginBottom: 12,
                fontFamily: "Manrope-Regular",
              }}
            >
              Email
            </Text>
            <TextInput
              placeholder="johnpeter200@gmail.com"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              style={inputStyle}
              autoCapitalize="none"
            />

            <Text
              style={{
                fontSize: 13,
                color: MUTED,
                marginBottom: 12,
                fontFamily: "Manrope-Regular",
              }}
            >
              Phone Number
            </Text>
            <TextInput
              placeholder="07012345678"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              style={inputStyle}
            />
          </View>

          {/* BOOKING DATES */}
          <Text
            style={{
              marginTop: 30,
              fontWeight: "700",
              fontSize: 18,
              fontFamily: "Manrope-Bold",
            }}
          >
            Booking dates
          </Text>

          <View style={{ marginTop: 4 }}>
            <Text
              style={{
                fontSize: 13,
                color: MUTED,
                marginBottom: 12,
                fontFamily: "Manrope-Regular",
              }}
            >
              Check-in
            </Text>
            <TextInput
              placeholder="YYYY-MM-DD"
              value={checkIn}
              onChangeText={setCheckIn}
              style={inputStyle}
            />

            <Text
              style={{
                fontSize: 13,
                color: MUTED,
                marginBottom: 12,
                fontFamily: "Manrope-Regular",
              }}
            >
              Check-out
            </Text>
            <TextInput
              placeholder="YYYY-MM-DD"
              value={checkOut}
              onChangeText={setCheckOut}
              style={inputStyle}
            />
          </View>

          {/* MAKE SPECIAL REQUESTS */}
          <Text
            style={{
              marginTop: 30,
              fontWeight: "700",
              fontSize: 18,
              fontFamily: "Manrope-Bold",
            }}
          >
            Make special requests
          </Text>

          {/* Check-in and Check-out */}
          <Text
            style={{
              marginTop: 20,
              fontSize: 14,
              fontWeight: "600",
              color: "#111",
              fontFamily: "Manrope-SemiBold",
            }}
          >
            Check-in and Check-out
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10, gap: 10 }}>
            <ChipButton
              label="Early check-in"
              selected={specialRequests.earlyCheckIn}
              onPress={() => toggleRequest("earlyCheckIn")}
            />
            <ChipButton
              label="Late check-out"
              selected={specialRequests.lateCheckOut}
              onPress={() => toggleRequest("lateCheckOut")}
            />
          </View>

          {/* Transportation and Parking */}
          <Text
            style={{
              marginTop: 20,
              fontSize: 14,
              fontWeight: "600",
              color: "#111",
              fontFamily: "Manrope-SemiBold",
            }}
          >
            Transportation and Parking
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10, gap: 10 }}>
            <ChipButton
              label="Airport pick-up or drop-off"
              selected={specialRequests.airportPickup}
              onPress={() => toggleRequest("airportPickup")}
            />
            <ChipButton
              label="Valet parking"
              selected={specialRequests.valetParking}
              onPress={() => toggleRequest("valetParking")}
            />
            <ChipButton
              label="Restaurant"
              selected={specialRequests.restaurant}
              onPress={() => toggleRequest("restaurant")}
            />
          </View>

          {/* Special Occasions */}
          <Text
            style={{
              marginTop: 20,
              fontSize: 14,
              fontWeight: "600",
              color: "#111",
              fontFamily: "Manrope-SemiBold",
            }}
          >
            Special Occasions
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10, gap: 10 }}>
            <ChipButton
              label="Birthday"
              selected={specialRequests.birthday}
              onPress={() => toggleRequest("birthday")}
            />
            <ChipButton
              label="Flowers in the room"
              selected={specialRequests.flowersInRoom}
              onPress={() => toggleRequest("flowersInRoom")}
            />
            <ChipButton
              label="Customized cake"
              selected={specialRequests.customizedCake}
              onPress={() => toggleRequest("customizedCake")}
            />
          </View>

          {/* Accessibility Needs */}
          <Text
            style={{
              marginTop: 20,
              fontSize: 14,
              fontWeight: "600",
              color: "#111",
              fontFamily: "Manrope-SemiBold",
            }}
          >
            Accessibility Needs
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10, gap: 10 }}>
            <ChipButton
              label="Wheelchair-accessible room"
              selected={specialRequests.wheelchairRoom}
              onPress={() => toggleRequest("wheelchairRoom")}
            />
            <ChipButton
              label="Grab bars in the bathroom"
              selected={specialRequests.grabBars}
              onPress={() => toggleRequest("grabBars")}
            />
          </View>

          {/* PROPERTY SUMMARY AT BOTTOM */}
          <View
            style={{
              marginTop: 40,
              paddingTop: 24,
              borderTopWidth: 1,
              borderTopColor: BORDER_COLOR,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    fontFamily: "Manrope-SemiBold",
                    color: "#111",
                  }}
                >
                  {property?.title || property?.name || "Property"}
                </Text>
                {rating > 0 && (
                  <View
                    style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}
                  >
                    <Ionicons name="star" size={16} color="#FFC107" />
                    <Text
                      style={{
                        marginLeft: 4,
                        fontSize: 14,
                        fontWeight: "500",
                        color: "#111",
                      }}
                    >
                      {rating.toFixed(1)}
                    </Text>
                  </View>
                )}
              </View>

              {nightlyPrice != null && (
                <View>
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "700",
                      fontFamily: "Manrope-Bold",
                      color: "#111",
                    }}
                  >
                    ₦{nightlyPrice.toLocaleString()}
                  </Text>
                </View>
              )}
            </View>

            {property?.description && (
              <Text
                style={{
                  marginTop: 12,
                  fontSize: 14,
                  color: MUTED,
                  lineHeight: 20,
                  fontFamily: "Manrope-Regular",
                }}
                numberOfLines={3}
              >
                {property.description}
              </Text>
            )}
          </View>

          {/* CONTINUE BUTTON */}
          <TouchableOpacity
            style={{
              backgroundColor: PRIMARY,
              paddingVertical: 16,
              borderRadius: 10,
              marginTop: 30,
              opacity: submitting ? 0.7 : 1,
            }}
            onPress={handleContinue}
            disabled={submitting}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontSize: 16,
                fontWeight: "700",
                fontFamily: "Manrope-Bold",
              }}
            >
              {submitting ? "Booking..." : "Continue"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Chip Button Component
function ChipButton({ label, selected, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: selected ? PRIMARY : BORDER_COLOR,
        backgroundColor: selected ? `${PRIMARY}10` : "white",
      }}
    >
      <Text
        style={{
          fontSize: 13,
          color: selected ? PRIMARY : MUTED,
          fontWeight: selected ? "600" : "400",
          fontFamily: selected ? "Manrope-SemiBold" : "Manrope-Regular",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const inputStyle = {
  borderWidth: 1,
  borderColor: BORDER_COLOR,
  borderRadius: 10,
  padding: 14,
  marginBottom: 20,
  fontSize: 15,
  fontFamily: "Manrope-Regular",
  backgroundColor: "#FAFAFA",
};
