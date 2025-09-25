// screens/ExploreHomeScreen.js
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';

const { width } = Dimensions.get('window');

const PRIMARY = '#000A63';
const CARD_BG = '#0F2D52';
const BORDER = '#E5E7EB';
const MUTED = '#6B7280';

const chips = ['All', 'Popular', 'Price', 'Amenities', 'Type'];

// ✅ Dummy data for now (will wire later)
const featured = {
  title: 'Lugar de grande 510, South Africa',
  price: 644.653,
  img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop',
};

const matches = [
  { id: 'm1', title: 'King Hotel, Nigeria', city: 'Lagos', price: 704.653, img: 'https://images.unsplash.com/photo-1551776235-dde6d4829808?q=80&w=1200&auto=format&fit=crop' },
  { id: 'm2', title: 'Royal Suites', city: 'Abuja', price: 499.0, img: 'https://images.unsplash.com/photo-1505691723518-36a5ac3b2c5f?w=1200&q=80&auto=format&fit=crop' },
];

const popular = [
  { id: 'p1', title: 'King Hotel, Nigeria', city: 'Lagos', price: 704.653, img: 'https://images.unsplash.com/photo-1501117716987-c8e2a3a67c47?q=80&w=1200&auto=format&fit=crop' },
  { id: 'p2', title: 'King Hotel, Nigeria', city: 'Lagos', price: 704.653, img: 'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1200&auto=format&fit=crop' },
  { id: 'p3', title: 'King House', city: 'Lagos', price: 704.653, img: 'https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1200&auto=format&fit=crop' },
];

const business = [
  { id: 'b1', title: 'King House', img: 'https://images.unsplash.com/photo-1505691723518-36a5ac3b2c5f?w=1200&q=80&auto=format&fit=crop' },
  { id: 'b2', title: 'King House', img: 'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=1200&q=80&auto=format&fit=crop' },
  { id: 'b3', title: 'King House', img: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80&auto=format&fit=crop' },
];

export default function ExploreHomeScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [activeChip, setActiveChip] = useState('All');

  // ✅ Checklist reflects real user data; card shows only if something is missing
  const steps = [
    { label: 'Phone Number', done: !!user?.phone },
    { label: 'Profile', done: !!user?.name },
    { label: 'KYC Verified', done: user?.kycStatus === 'VERIFIED' },
  ];
  const needsCompletion = steps.some(s => !s.done);

  const goComplete = () => {
  if (!user?.phone) {
    navigation.navigate('AddPhoneScreen');   // ✅ goes to AddPhoneScreen
  } else if (!user?.name) {
    navigation.navigate('EditProfileScreen'); // ✅ goes to EditProfileScreen
  } else if (user?.kycStatus !== 'VERIFIED') {
    navigation.navigate('UserVerificationScreen'); // ✅ full KYC flow
  }
};

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* 1) Header */}
        <View style={styles.header}>
          <View style={styles.meRow}>
            <Image source={require('../assets/icons/guest.png')} style={styles.avatar} />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.welcomeMuted}>Welcome!</Text>
              <Text style={styles.welcomeName}>{user?.name || user?.email || 'Guest'}</Text>
            </View>
          </View>
          <View style={styles.headerIcons}>
            <Ionicons name="notifications-outline" size={22} color="#111827" />
            <View style={{ width: 12 }} />
            <Ionicons name="menu" size={22} color="#111827" />
          </View>
        </View>

        {/* 2) Search bar (static for now) */}
        <View style={styles.search}>
          <Ionicons name="search" size={18} color={MUTED} />
          <Text style={styles.searchText}>Search for location, hotel</Text>
        </View>

        {/* 3) Chips */}
        <FlatList
          horizontal
          data={chips}
          keyExtractor={(it) => it}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 4 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setActiveChip(item)}
              style={[styles.chip, activeChip === item && { backgroundColor: PRIMARY }]}
            >
              <Text style={[styles.chipText, activeChip === item && { color: '#fff' }]}>{item}</Text>
            </TouchableOpacity>
          )}
        />

        {/* 4) KYC/Profile Card */}
        {needsCompletion && (
          <View style={styles.profileCard}>
            <Text style={styles.profileTitle}>Complete your profile</Text>
            {steps.map((s) => (
              <View key={s.label} style={styles.rowItem}>
                <View style={[styles.dot, { backgroundColor: s.done ? '#16a34a' : '#ef4444' }]} />
                <Text style={styles.rowText}>{s.label}</Text>
              </View>
            ))}
            <TouchableOpacity style={styles.completeBtn} onPress={goComplete}>
              <Text style={styles.completeBtnText}>Complete Now</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 5) Recommend Hotels (highlight card) */}
        <Text style={styles.sectionCaption}>Recommend Hotels</Text>
        <TouchableOpacity activeOpacity={0.9} style={styles.recommendCard}>
          <Image source={{ uri: featured.img }} style={styles.recommendImg} />
          <View style={{ paddingHorizontal: 8, paddingBottom: 8 }}>
            <Text style={styles.recommendTitle} numberOfLines={2}>{featured.title}</Text>
            <Text style={styles.recommendMeta}>3,002km • South Africa</Text>
            <Text style={styles.recommendPrice}>${featured.price.toLocaleString()}</Text>
          </View>
        </TouchableOpacity>

        {/* 6) Find Your Hotel CTA */}
        <View style={styles.findCard}>
          <Text style={styles.findTitle}>Find Your hotel</Text>
          <Text style={styles.findSub}>Explore the best properties across Africa with ease and confidence</Text>
          <TouchableOpacity style={styles.searchCta}>
            <Text style={styles.searchCtaText}>Start your Search</Text>
          </TouchableOpacity>
        </View>

        {/* 7) Your Matches */}
        <Text style={styles.sectionTitle}>Your Matches</Text>
        {matches.map((m) => (
          <View key={m.id} style={styles.matchCard}>
            <Image source={{ uri: m.img }} style={styles.matchImg} />
            <View style={{ padding: 12 }}>
              <Text style={styles.matchTitle}>{m.title}</Text>
              <Text style={styles.matchMeta}>{m.city} • Wonderful · 1.0 reviews</Text>
              <Text style={styles.matchPrice}>${m.price.toLocaleString()}</Text>
              <TouchableOpacity style={styles.viewNow}>
                <Text style={styles.viewNowText}>View Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* 8) Most Popular */}
        <Text style={styles.sectionTitle}>Most popular hotels</Text>
        <FlatList
          horizontal
          data={popular}
          keyExtractor={(it) => it.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 8 }}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          renderItem={({ item }) => (
            <View style={styles.popCard}>
              <Image source={{ uri: item.img }} style={styles.popImg} />
              <View style={{ padding: 8 }}>
                <Text style={styles.popTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.popMeta}>{item.city}</Text>
                <Text style={styles.popPrice}>${item.price.toLocaleString()}</Text>
              </View>
            </View>
          )}
        />

        {/* 9) Featured Deals (big card) */}
        <Text style={styles.sectionTitle}>Featured Deals and Promotions</Text>
        <TouchableOpacity activeOpacity={0.9} style={styles.featuredBig}>
          <Image source={{ uri: featured.img }} style={styles.featuredBigImg} />
          <View style={{ padding: 12 }}>
            <Text style={styles.featuredTitle} numberOfLines={2}>{featured.title}</Text>
            <Text style={styles.featuredMeta}>2.6km • Murtala, Nsammad</Text>
            <Text style={styles.featuredPrice}>${featured.price.toLocaleString()}</Text>
          </View>
        </TouchableOpacity>

        {/* 10) Business Travelers */}
        <Text style={styles.sectionTitle}>Business Travelers</Text>
        <FlatList
          horizontal
          data={business}
          keyExtractor={(it) => it.id}
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          contentContainerStyle={{ paddingVertical: 8, paddingBottom: 12 }}
          renderItem={({ item }) => (
            <View style={styles.bizCard}>
              <Image source={{ uri: item.img }} style={styles.bizImg} />
              <Text style={styles.bizTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.bizPrice}>$704,653</Text>
            </View>
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 28, backgroundColor: '#fff' },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  meRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 32, height: 32, borderRadius: 16 },
  welcomeMuted: { color: MUTED, fontSize: 12 },
  welcomeName: { color: '#111827', fontWeight: '600' },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },

  search: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: BORDER, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 12, marginBottom: 10 },
  searchText: { marginLeft: 8, color: MUTED, fontSize: 14 },

  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: BORDER, marginRight: 8, backgroundColor: '#fff' },
  chipText: { color: '#111827', fontSize: 13 },

  profileCard: { borderWidth: 1, borderColor: BORDER, borderRadius: 12, padding: 14, marginTop: 8, marginBottom: 10, backgroundColor: '#fff' },
  profileTitle: { fontWeight: '600', marginBottom: 10, color: '#111827' },
  rowItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  rowText: { color: '#111827' },
  completeBtn: { backgroundColor: PRIMARY, paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  completeBtnText: { color: '#fff', fontWeight: '600' },

  sectionCaption: { fontSize: 13, color: MUTED, marginTop: 8, marginBottom: 6 },
  sectionTitle: { color: '#111827', fontWeight: '700', fontSize: 16, marginTop: 12, marginBottom: 8 },

  recommendCard: { borderWidth: 1, borderColor: BORDER, borderRadius: 12, overflow: 'hidden', marginBottom: 14, backgroundColor: '#fff' },
  recommendImg: { width: '100%', height: 120 },
  recommendTitle: { color: '#111827', fontWeight: '600', marginTop: 6 },
  recommendMeta: { color: MUTED, fontSize: 12, marginTop: 2 },
  recommendPrice: { color: '#111827', fontWeight: '700', marginTop: 2 },

  findCard: { borderWidth: 1, borderColor: BORDER, borderRadius: 12, padding: 14, marginBottom: 14, backgroundColor: '#fff' },
  findTitle: { color: '#111827', fontWeight: '700', fontSize: 16, marginBottom: 4 },
  findSub: { color: MUTED, fontSize: 12, marginBottom: 10 },
  searchCta: { backgroundColor: PRIMARY, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  searchCtaText: { color: '#fff', fontWeight: '600' },

  matchCard: { borderWidth: 1, borderColor: BORDER, borderRadius: 12, overflow: 'hidden', marginBottom: 14, backgroundColor: '#fff' },
  matchImg: { width: '100%', height: width * 0.42 },
  matchTitle: { color: '#111827', fontWeight: '700' },
  matchMeta: { color: MUTED, fontSize: 12, marginTop: 2 },
  matchPrice: { color: '#111827', fontWeight: '800', marginTop: 4 },
  viewNow: { alignSelf: 'flex-start', borderWidth: 1, borderColor: BORDER, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginTop: 8 },
  viewNowText: { color: '#111827', fontWeight: '600' },

  popCard: { width: width * 0.42, borderWidth: 1, borderColor: BORDER, borderRadius: 12, overflow: 'hidden', backgroundColor: '#fff' },
  popImg: { width: '100%', height: 110 },
  popTitle: { color: '#111827', fontWeight: '600', marginTop: 6 },
  popMeta: { color: MUTED, fontSize: 12, marginTop: 2 },
  popPrice: { color: '#111827', fontWeight: '700', marginTop: 2 },

  featuredBig: { borderWidth: 1, borderColor: BORDER, borderRadius: 12, overflow: 'hidden', marginBottom: 8, backgroundColor: '#fff' },
  featuredBigImg: { width: '100%', height: 140 },
  featuredTitle: { color: '#111827', fontWeight: '700', marginTop: 6 },
  featuredMeta: { color: MUTED, fontSize: 12, marginTop: 2 },
  featuredPrice: { color: '#111827', fontWeight: '800', marginTop: 4 },

  bizCard: { width: 110, borderWidth: 1, borderColor: BORDER, borderRadius: 12, overflow: 'hidden', backgroundColor: '#fff' },
  bizImg: { width: '100%', height: 90 },
  bizTitle: { color: '#111827', fontWeight: '600', marginTop: 6, paddingHorizontal: 8 },
  bizPrice: { color: '#111827', fontWeight: '700', paddingHorizontal: 8, marginBottom: 8 },
});