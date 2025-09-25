import { listProperties } from "@/lib/api";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";

export default function PropertiesListScreen({ navigation }) {
  const [items, setItems] = useState([]);         // <- no <any[]>
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);           // <- no <string|null>

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const items = await listProperties(); // implement in lib/api.ts (or .js)
        if (!mounted) return;
        setItems(items || []);
      } catch (e) {
        if (mounted) setErr(e?.message || "Failed to load");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) return <View style={{ padding: 16 }}><ActivityIndicator /></View>;
  if (err) return <View style={{ padding: 16 }}><Text style={{ color: "red" }}>{err}</Text></View>;

  return (
    <FlatList
      data={items}
      keyExtractor={(it) => it.id}
      contentContainerStyle={{ padding: 16, gap: 12 }}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => navigation.navigate("PropertyDetails", { id: item.id })}
          style={{ padding: 12, borderWidth: 1, borderColor: "#ddd", borderRadius: 10 }}
        >
          <Text style={{ fontSize: 16, fontWeight: "600" }}>{item.title}</Text>
          <Text style={{ color: "#666" }}>{item.city}</Text>
          <Text>₦{item.nightlyPrice?.toLocaleString()} / night</Text>
        </Pressable>
      )}
    />
  );
}