// screens/ViewBookingDetailsScreen.js
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY = "#000A63";
const MUTED = "#6B7280";
const BORDER_COLOR = "#E5E7EB";

export default function ViewBookingDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const {
    property,
    booking,
    checkIn,
    checkOut,
    guestName,
    email,
    phone,
    notes,
  } = route.params || {};

  if (!property || !booking) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <Text>No booking data found.</Text>
      </SafeAreaView>
    );
  }

  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const nights = Math.max(
    1,
    Math.ceil((end - start) / (1000 * 60 * 60 * 24))
  );

  const nightly = property.nightlyPrice || property.price || 0;
  const breakdown = booking.feesJson || {};

  // Backend returns breakdown with: base, cleaning, service, tax, subtotal, total (in KOBO)
  const baseAmount = breakdown.base || nightly * nights;
  const cleaningFee = breakdown.cleaning || 5000;
  const serviceFee = breakdown.service || Math.round(baseAmount * 0.10);
  const subtotalBeforeTax = breakdown.subtotal || (baseAmount + cleaningFee + serviceFee);
  const taxAmount = breakdown.tax || Math.round(subtotalBeforeTax * 0.075);

  // Convert total from KOBO to NGN if it exists
  const totalNGN = booking.totalAmount
    ? booking.totalAmount / 100
    : subtotalBeforeTax + taxAmount;

  const rating = property?.rating ?? property?.averageRating ?? 0;

  // Process images same way as PropertyDetailsScreen
  const images = property?.images?.length
    ? property.images.map((img) => (typeof img === 'string' ? img : img.url || img))
    : [
        property?.image ||
          "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg",
      ];

  const mainImage = images[0];
  const secondImage = images[1] || images[0];

  // Parse special requests from notes if available
  const specialRequestsArray = notes ? notes.split(", ") : [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
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

          {/* Back Button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              backgroundColor: "white",
              borderRadius: 20,
              padding: 8,
              width: 40,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>

          {/* Print Icon */}
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              backgroundColor: "white",
              borderRadius: 20,
              padding: 8,
              width: 40,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="print-outline" size={22} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          {/* BOOKING ID BOX */}
          <View
            style={{
              padding: 16,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: BORDER_COLOR,
              backgroundColor: "#FAFAFA",
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: MUTED,
                marginBottom: 6,
                fontFamily: "Manrope-Regular",
              }}
            >
              Booking ID
            </Text>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: "#111",
                fontFamily: "Manrope-Bold",
              }}
            >
              {booking.bookingCode || booking.id || "495060735"}
            </Text>
          </View>

          {/* DATES AND GUESTS */}
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <View
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: BORDER_COLOR,
                borderRadius: 10,
                padding: 14,
                backgroundColor: "#FAFAFA",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  color: "#111",
                  fontFamily: "Manrope-Medium",
                }}
              >
                {checkIn || "10/12/2024"}
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: BORDER_COLOR,
                borderRadius: 10,
                padding: 14,
                backgroundColor: "#FAFAFA",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  color: "#111",
                  fontFamily: "Manrope-Medium",
                }}
              >
                {checkOut || "15/6/2024"}
              </Text>
            </View>

            <TouchableOpacity
              style={{
                justifyContent: "center",
                paddingHorizontal: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: PRIMARY,
                  fontFamily: "Manrope-Medium",
                }}
              >
                Edit
              </Text>
            </TouchableOpacity>
          </View>

          {/* GUESTS */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <View
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: BORDER_COLOR,
                borderRadius: 10,
                padding: 14,
                backgroundColor: "#FAFAFA",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  color: "#111",
                  fontFamily: "Manrope-Medium",
                }}
              >
                1 guest
              </Text>
            </View>

            <TouchableOpacity
              style={{
                justifyContent: "center",
                paddingHorizontal: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: PRIMARY,
                  fontFamily: "Manrope-Medium",
                }}
              >
                Edit
              </Text>
            </TouchableOpacity>
          </View>

          {/* WHO'S THE GUEST */}
          <Text
            style={{
              fontWeight: "700",
              fontSize: 18,
              fontFamily: "Manrope-Bold",
              marginBottom: 16,
            }}
          >
            Who's the guest?
          </Text>

          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 13,
                color: MUTED,
                marginBottom: 8,
                fontFamily: "Manrope-Regular",
              }}
            >
              Name
            </Text>
            <View style={readOnlyInputStyle}>
              <Text style={inputTextStyle}>{guestName || "John Peter"}</Text>
            </View>

            <Text
              style={{
                fontSize: 13,
                color: MUTED,
                marginBottom: 8,
                fontFamily: "Manrope-Regular",
              }}
            >
              Email
            </Text>
            <View style={readOnlyInputStyle}>
              <Text style={inputTextStyle}>
                {email || "Johnpeter200@gmail.com"}
              </Text>
            </View>

            <Text
              style={{
                fontSize: 13,
                color: MUTED,
                marginBottom: 8,
                fontFamily: "Manrope-Regular",
              }}
            >
              Phone Number
            </Text>
            <View style={readOnlyInputStyle}>
              <Text style={inputTextStyle}>{phone || "07012345678"}</Text>
            </View>
          </View>

          {/* MAKE SPECIAL REQUESTS */}
          {specialRequestsArray.length > 0 && (
            <>
              <Text
                style={{
                  fontWeight: "700",
                  fontSize: 18,
                  fontFamily: "Manrope-Bold",
                  marginBottom: 16,
                }}
              >
                Make special requests
              </Text>

              {/* Check-in and Check-out */}
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#111",
                  fontFamily: "Manrope-SemiBold",
                  marginBottom: 10,
                }}
              >
                Check-in and Check-out
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 20, gap: 10 }}>
                {specialRequestsArray.includes("early check in") && (
                  <ReadOnlyChip label="Early check-in" />
                )}
                {specialRequestsArray.includes("late check out") && (
                  <ReadOnlyChip label="Late check-out" />
                )}
              </View>

              {/* Transportation and Parking */}
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#111",
                  fontFamily: "Manrope-SemiBold",
                  marginBottom: 10,
                }}
              >
                Transportation and Parking
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 20, gap: 10 }}>
                {specialRequestsArray.includes("airport pick up or drop off") && (
                  <ReadOnlyChip label="Airport pick-up or drop-off" />
                )}
                {specialRequestsArray.includes("valet parking") && (
                  <ReadOnlyChip label="Valet parking" />
                )}
                {specialRequestsArray.includes("restaurant") && (
                  <ReadOnlyChip label="Restaurant" />
                )}
              </View>

              {/* Special Occasions */}
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#111",
                  fontFamily: "Manrope-SemiBold",
                  marginBottom: 10,
                }}
              >
                Special Occasions
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 20, gap: 10 }}>
                {specialRequestsArray.includes("birthday") && (
                  <ReadOnlyChip label="Birthday" />
                )}
                {specialRequestsArray.includes("flowers in the room") && (
                  <ReadOnlyChip label="Flowers in the room" />
                )}
                {specialRequestsArray.includes("customized cake") && (
                  <ReadOnlyChip label="Customized cake" />
                )}
              </View>

              {/* Accessibility Needs */}
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#111",
                  fontFamily: "Manrope-SemiBold",
                  marginBottom: 10,
                }}
              >
                Accessibility Needs
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 20, gap: 10 }}>
                {specialRequestsArray.includes("wheelchair accessible room") && (
                  <ReadOnlyChip label="Wheelchair-accessible room" />
                )}
                {specialRequestsArray.includes("grab bars in the bathroom") && (
                  <ReadOnlyChip label="Grab bars in the bathroom" />
                )}
              </View>
            </>
          )}

          {/* ROOM IMAGE & TITLE */}
          <View style={{ marginBottom: 24 }}>
            <Image
              source={{
                uri: secondImage,
              }}
              style={{
                width: "100%",
                height: 200,
                borderRadius: 12,
                backgroundColor: "#ddd",
              }}
              resizeMode="cover"
            />

            <Text
              style={{
                marginTop: 12,
                fontSize: 15,
                fontWeight: "600",
                color: "#111",
                fontFamily: "Manrope-SemiBold",
              }}
            >
              {property.roomType || property.title || "Deluxe double room"}
            </Text>
          </View>

          {/* PRICE DETAILS */}
          <View>
            <Text
              style={{
                fontSize: 17,
                fontWeight: "700",
                color: "#111",
                marginBottom: 16,
                fontFamily: "Manrope-Bold",
              }}
            >
              Price details
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: MUTED,
                  fontFamily: "Manrope-Regular",
                }}
              >
                {baseAmount.toLocaleString()} X {nights} nights
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#111",
                  fontFamily: "Manrope-SemiBold",
                }}
              >
                N{baseAmount.toLocaleString()}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: MUTED,
                  fontFamily: "Manrope-Regular",
                }}
              >
                Service
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#111",
                  fontFamily: "Manrope-SemiBold",
                }}
              >
                N{serviceFee.toLocaleString()}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: MUTED,
                  fontFamily: "Manrope-Regular",
                }}
              >
                Tax
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#111",
                  fontFamily: "Manrope-SemiBold",
                }}
              >
                N{taxAmount.toLocaleString()}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingTop: 16,
                borderTopWidth: 1,
                borderTopColor: BORDER_COLOR,
                marginBottom: 24,
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "700",
                  color: "#111",
                  fontFamily: "Manrope-Bold",
                }}
              >
                Total (USD)
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "700",
                  color: "#111",
                  fontFamily: "Manrope-Bold",
                }}
              >
                N{totalNGN.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Read-only Chip Component
function ReadOnlyChip({ label }) {
  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: BORDER_COLOR,
        backgroundColor: "#F9FAFB",
      }}
    >
      <Text
        style={{
          fontSize: 13,
          color: MUTED,
          fontFamily: "Manrope-Regular",
        }}
      >
        {label}
      </Text>
    </View>
  );
}

const readOnlyInputStyle = {
  borderWidth: 1,
  borderColor: BORDER_COLOR,
  borderRadius: 10,
  padding: 14,
  marginBottom: 20,
  backgroundColor: "#FAFAFA",
};

const inputTextStyle = {
  fontSize: 15,
  fontFamily: "Manrope-Regular",
  color: "#111",
};
