import { createBooking, getProperty, getPublicBlocks, initPayment, quote, toggleFavorite } from "@/lib/api"; // you already have these
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, Linking, ScrollView, Text, TextInput, View } from "react-native";
import { useAuth } from '../hooks/useAuth';


export default function PropertyDetailsScreen({ route }) {
  const { id: propertyId } = route.params;
  const { token } = useAuth();
  const [prop, setProp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [isFavorite, setIsFavorite] = useState(false);
  const [blocked, setBlocked] = useState([]);

  const [checkIn, setCheckIn] = useState("");   // "YYYY-MM-DD"
  const [checkOut, setCheckOut] = useState(""); // "YYYY-MM-DD"
  const [pricing, setPricing] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const p = await getProperty(propertyId, token || undefined);
        if (!mounted) return;
        setProp(p);
        setIsFavorite(Boolean(p?.isFavorite));
      } catch (e) {
        if (mounted) setErr(e?.message || "Failed to load property");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [propertyId, token]);

  useEffect(() => {
    getPublicBlocks(propertyId).then(setBlocked).catch(() => setBlocked([]));
  }, [propertyId]);

  useEffect(() => {
    if (checkIn && checkOut) {
      quote(propertyId, checkIn, checkOut).then(setPricing).catch(() => setPricing(null));
    } else {
      setPricing(null);
    }
  }, [propertyId, checkIn, checkOut]);

  async function onToggleFav() {
    if (!token) return Alert.alert("Sign in", "Please sign in first.");
    try {
      await toggleFavorite(propertyId, token, !isFavorite);
      setIsFavorite(!isFavorite);
    } catch (e) {
      Alert.alert("Error", e?.message || "Failed to toggle favorite");
    }
  }

  async function onBookAndPay() {
    if (!token) return Alert.alert("Sign in", "Please sign in first.");
    if (!checkIn || !checkOut || !pricing) return Alert.alert("Select dates", "Pick check-in and check-out.");
    try {
      setBusy(true);
      const b = await createBooking(token, propertyId, checkIn, checkOut);
      const p = await initPayment(token, b.id);
      // open Paystack checkout in device browser
      if (p?.authorization_url) {
        await Linking.openURL(p.authorization_url);
      } else {
        Alert.alert("Payment", "Failed to get payment link");
      }
    } catch (e) {
      Alert.alert("Booking failed", e?.message || "Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <View style={{ padding: 20 }}><ActivityIndicator /></View>;
  if (err || !prop) return <View style={{ padding: 20 }}><Text style={{ color: "red" }}>{err || "Not found"}</Text></View>;

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>{prop.title}</Text>
      <Text style={{ color: "#666", marginBottom: 8 }}>{prop.city}</Text>
      {!!prop.description && <Text style={{ marginBottom: 12 }}>{prop.description}</Text>}
      {prop.avgRating > 0 && <Text style={{ marginBottom: 12 }}>★ {prop.avgRating.toFixed(1)} · {prop.reviewsCount} review(s)</Text>}

      <View style={{ padding: 12, borderWidth: 1, borderColor: "#ddd", borderRadius: 12, gap: 8 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontSize: 18, fontWeight: "600" }}>₦{prop.nightlyPrice?.toLocaleString()} / night</Text>
          <Text onPress={onToggleFav} style={{ textDecorationLine: "underline" }}>
            {isFavorite ? "★ Favorited" : "☆ Add to favorites"}
          </Text>
        </View>

        <View style={{ gap: 8 }}>
          <Text>Check-in (YYYY-MM-DD)</Text>
          <TextInput
            placeholder="2025-11-10"
            value={checkIn}
            onChangeText={setCheckIn}
            autoCapitalize="none"
            style={{ borderWidth: 1, borderColor: "#ddd", padding: 10, borderRadius: 8 }}
          />
          <Text>Check-out (YYYY-MM-DD)</Text>
          <TextInput
            placeholder="2025-11-12"
            value={checkOut}
            onChangeText={setCheckOut}
            autoCapitalize="none"
            style={{ borderWidth: 1, borderColor: "#ddd", padding: 10, borderRadius: 8 }}
          />
        </View>

        {blocked?.length > 0 && (
          <Text style={{ fontSize: 12, color: "#666" }}>
            Blocked: {blocked.map(b => `${b.startDate.slice(0,10)}→${b.endDate.slice(0,10)}`).join(", ")}
          </Text>
        )}

        {pricing && (
          <View style={{ marginTop: 6 }}>
            <Text>Nights: {pricing.nights}</Text>
            <Text>Base: ₦{pricing.base.toLocaleString()}</Text>
            <Text>Cleaning: ₦{pricing.cleaning.toLocaleString()}</Text>
            <Text>Service: ₦{pricing.service.toLocaleString()}</Text>
            <Text>Tax: ₦{pricing.tax.toLocaleString()}</Text>
            <Text style={{ fontWeight: "700", marginTop: 4 }}>
              Total: ₦{(pricing.total / 100).toLocaleString()}
            </Text>
          </View>
        )}

        <Button title={busy ? "Redirecting…" : "Book & Pay"} disabled={!pricing || busy} onPress={onBookAndPay} />
      </View>
    </ScrollView>
  );
}