// screens/ConfirmBookingScreen.js
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

export default function ConfirmBookingScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const {
    property,
    booking,
    checkIn,
    checkOut,
    guests,
    guestName,
    email,
    phone,
    notes,
  } = route.params || {};

  const numGuests = guests || booking?.guests || 1;

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
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
          Review
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* MAIN CONTENT */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* PROPERTY CARD WITH GUEST INFO */}
        <View
          style={{
            flexDirection: "row",
            gap: 16,
            marginBottom: 20,
          }}
        >
          <Image
            source={{
              uri: mainImage,
            }}
            style={{
              width: 120,
              height: 90,
              borderRadius: 10,
              backgroundColor: "#ddd",
            }}
            resizeMode="cover"
          />

          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                fontFamily: "Manrope-SemiBold",
                color: "#111",
              }}
            >
              {property.title || property.name}
            </Text>
            {rating > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 4,
                }}
              >
                <Ionicons name="star" size={14} color="#FFC107" />
                <Text
                  style={{
                    marginLeft: 4,
                    fontSize: 13,
                    fontWeight: "500",
                    color: "#111",
                  }}
                >
                  {rating.toFixed(1)}
                </Text>
              </View>
            )}
            <Text
              style={{
                fontSize: 13,
                color: MUTED,
                marginTop: 6,
                fontFamily: "Manrope-Regular",
              }}
            >
              {guestName || "Guest"}
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: MUTED,
                fontFamily: "Manrope-Regular",
              }}
            >
              {email || ""}
            </Text>
          </View>
        </View>

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
            onPress={() => {
              navigation.navigate("BookingDetailsScreen", {
                property,
                checkIn,
                checkOut,
                guests: numGuests,
                guestName,
                email,
                phone,
                notes,
              });
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
              {numGuests} {numGuests === 1 ? 'guest' : 'guests'}
            </Text>
          </View>

          <TouchableOpacity
            style={{
              justifyContent: "center",
              paddingHorizontal: 12,
            }}
            onPress={() => {
              navigation.navigate("BookingDetailsScreen", {
                property,
                checkIn,
                checkOut,
                guests: numGuests,
                guestName,
                email,
                phone,
                notes,
              });
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
              ₦{nightly.toLocaleString()} × {nights} nights
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#111",
                fontFamily: "Manrope-SemiBold",
              }}
            >
              ₦{baseAmount.toLocaleString()}
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
              Cleaning fee
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#111",
                fontFamily: "Manrope-SemiBold",
              }}
            >
              ₦{cleaningFee.toLocaleString()}
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
              Service fee (10%)
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#111",
                fontFamily: "Manrope-SemiBold",
              }}
            >
              ₦{serviceFee.toLocaleString()}
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
              Tax (7.5%)
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#111",
                fontFamily: "Manrope-SemiBold",
              }}
            >
              ₦{taxAmount.toLocaleString()}
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
              Total (NGN)
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "700",
                color: "#111",
                fontFamily: "Manrope-Bold",
              }}
            >
              ₦{totalNGN.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* BOOK ANOTHER ROOM LINK */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginBottom: 16 }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "#111",
              fontSize: 15,
              fontFamily: "Manrope-Medium",
            }}
          >
            Book another room
          </Text>
        </TouchableOpacity>

        {/* BOOK NOW BUTTON - Fake Simulation */}
        <TouchableOpacity
          style={{
            backgroundColor: PRIMARY,
            paddingVertical: 16,
            borderRadius: 12,
          }}
          onPress={() => {
            // Navigate directly to booking in progress (fake payment simulation)
            navigation.navigate("BookingInProgressScreen", {
              bookingId: booking.id,
              totalAmount: booking.totalAmount || totalNGN * 100,
              property,
              booking,
              checkIn,
              checkOut,
              guests: numGuests,
              guestName,
              email,
              phone,
              notes,
            });
          }}
        >
          <Text
            style={{
              color: "#fff",
              textAlign: "center",
              fontSize: 16,
              fontWeight: "700",
              fontFamily: "Manrope-Bold",
            }}
          >
            BOOK NOW
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
