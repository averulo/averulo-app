// screens/PaymentScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY_DARK = "#04123C";
const TEXT_DARK = "#111827";
const TEXT_MEDIUM = "#6B7280";
const BORDER_GRAY = "#E5E7EB";

export default function PaymentScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const {
    bookingId,
    totalAmount,
    property,
    booking,
    checkIn,
    checkOut,
    guestName,
    email,
    phone,
    notes,
  } = route.params || {};

  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const [focusedField, setFocusedField] = useState("");

  const formatCardNumber = (text) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, "");
    // Add space every 4 digits
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    return formatted.slice(0, 19); // Max 16 digits + 3 spaces
  };

  const formatExpiryDate = (text) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, "");
    // Add slash after 2 digits
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 6);
    }
    return cleaned;
  };

  const handlePayment = () => {
    // Validate fields
    if (!cardNumber || !expiryDate || !cvv || !billingAddress) {
      alert("Please fill in all payment details");
      return;
    }

    // Navigate to booking in progress
    navigation.replace("BookingInProgressScreen", {
      bookingId,
      property,
      booking,
      checkIn,
      checkOut,
      guestName,
      email,
      phone,
      notes,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={TEXT_DARK} />
        </TouchableOpacity>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* PAYMENT METHOD ICONS */}
          <View style={styles.paymentMethodsContainer}>
            <Image
              source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" }}
              style={styles.paymentIcon}
              resizeMode="contain"
            />
            <Image
              source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" }}
              style={styles.paymentIcon}
              resizeMode="contain"
            />
            <Image
              source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" }}
              style={styles.paymentIcon}
              resizeMode="contain"
            />
          </View>

          {/* CARD NUMBER */}
          <Text style={styles.label}>Card number</Text>
          <TextInput
            style={[styles.input, focusedField === "cardNumber" && styles.focusedInput]}
            placeholder="1234 5678 3445 5653"
            value={cardNumber}
            onChangeText={(text) => setCardNumber(formatCardNumber(text))}
            onFocus={() => setFocusedField("cardNumber")}
            onBlur={() => setFocusedField("")}
            keyboardType="number-pad"
            maxLength={19}
          />

          {/* EXPIRATION DATE */}
          <Text style={styles.label}>Expiration (mm/yyyy)</Text>
          <TextInput
            style={[styles.input, focusedField === "expiry" && styles.focusedInput]}
            placeholder="03/2026"
            value={expiryDate}
            onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
            onFocus={() => setFocusedField("expiry")}
            onBlur={() => setFocusedField("")}
            keyboardType="number-pad"
            maxLength={7}
          />

          {/* CVV */}
          <Text style={styles.label}>CVV</Text>
          <TextInput
            style={[styles.input, focusedField === "cvv" && styles.focusedInput]}
            placeholder="111"
            value={cvv}
            onChangeText={(text) => setCvv(text.replace(/\D/g, "").slice(0, 4))}
            onFocus={() => setFocusedField("cvv")}
            onBlur={() => setFocusedField("")}
            keyboardType="number-pad"
            maxLength={4}
            secureTextEntry
          />

          {/* BILLING ADDRESS SECTION */}
          <Text style={styles.sectionTitle}>Billing address</Text>

          <Text style={styles.label}>Street address</Text>
          <TextInput
            style={[styles.input, focusedField === "address" && styles.focusedInput]}
            placeholder="2 Free Wine road"
            value={billingAddress}
            onChangeText={setBillingAddress}
            onFocus={() => setFocusedField("address")}
            onBlur={() => setFocusedField("")}
          />

          <Text style={styles.label}>City</Text>
          <TextInput
            style={[styles.input, focusedField === "city" && styles.focusedInput]}
            placeholder="Lagos"
            value={city}
            onChangeText={setCity}
            onFocus={() => setFocusedField("city")}
            onBlur={() => setFocusedField("")}
          />

          <Text style={styles.label}>ZIP</Text>
          <TextInput
            style={[styles.input, focusedField === "zip" && styles.focusedInput]}
            placeholder="111"
            value={zipCode}
            onChangeText={setZipCode}
            onFocus={() => setFocusedField("zip")}
            onBlur={() => setFocusedField("")}
            keyboardType="number-pad"
          />

          <Text style={styles.label}>Country</Text>
          <TextInput
            style={[styles.input, focusedField === "country" && styles.focusedInput]}
            placeholder="Nigeria"
            value={country}
            onChangeText={setCountry}
            onFocus={() => setFocusedField("country")}
            onBlur={() => setFocusedField("")}
          />
        </ScrollView>

        {/* FIXED PAY NOW BUTTON */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
            <Text style={styles.payButtonText}>Pay Now</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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

  paymentMethodsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 24,
  },

  paymentIcon: {
    width: 50,
    height: 30,
  },

  label: {
    fontSize: 13,
    fontWeight: "400",
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
    marginBottom: 8,
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: TEXT_DARK,
    marginTop: 24,
    marginBottom: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 15,
    fontFamily: "Manrope-Regular",
    color: TEXT_DARK,
    backgroundColor: "#FFFFFF",
  },

  focusedInput: {
    borderColor: PRIMARY_DARK,
    borderWidth: 2,
  },

  footer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: BORDER_GRAY,
  },

  payButton: {
    backgroundColor: PRIMARY_DARK,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  payButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
  },
});
