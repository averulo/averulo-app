import { getFavorites } from '@/lib/api'; // GET /api/favorites/me
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export default function SavedScreen() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      try {
        const res = await getFavorites(token);
        setItems(res.items || []);
      } catch (e) {
        setErr("Failed to load favorites.");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  if (loading) return <ActivityIndicator />;
  if (err) return <Text>{err}</Text>;
  if (!items.length) return <Text style={{ padding: 16 }}>No favorites yet.</Text>;

  return (
    <FlatList
      data={items}
      keyExtractor={item => item.id}
      contentContainerStyle={{ padding: 16, gap: 12 }}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => navigation.navigate('PropertyDetails', { id: item.id })}
          style={{ padding: 12, borderWidth: 1, borderColor: "#ccc", borderRadius: 10 }}
        >
          <Text style={{ fontSize: 16, fontWeight: "600" }}>{item.title}</Text>
          <Text>{item.city}</Text>
          <Text>₦{item.nightlyPrice?.toLocaleString()} / night</Text>
        </Pressable>
      )}
    />
  );
}