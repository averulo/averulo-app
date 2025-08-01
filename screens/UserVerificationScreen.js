import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { Dimensions, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const idTypes = [
  { label: "National Drivers Licence", value: "drivers-license" },
  { label: "Passport", value: "passport" },
  { label: "National Identification Number", value: "national-id" },
];

export default function UserVerificationScreen({ navigation }) {
  const [selectedIdType, setSelectedIdType] = useState(idTypes[0].value);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verify</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.skip}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Main Title */}
      <Text style={styles.bigTitle}>User Verification</Text>

      {/* ID Type Input */}
      <Text style={styles.inputLabel}>Please select your preferred ID</Text>
      <View style={styles.dropdownBox}>
        <Picker
          selectedValue={selectedIdType}
          onValueChange={(itemValue) => setSelectedIdType(itemValue)}
          style={styles.picker}
          mode="dropdown"
        >
          {idTypes.map(type => (
            <Picker.Item key={type.value} label={type.label} value={type.value} />
          ))}
        </Picker>
      </View>

      {/* Card Illustration */}
      <View style={styles.illustrationWrap}>
        <Image
          source={require('../assets/images/id-card-illustration.png')}
          style={styles.illustrationImg}
          resizeMode="contain"
        />
      </View>

      {/* "Get your ID card ready" */}
      <Text style={styles.guidelineTitle}>Get your ID card ready</Text>
      <Text style={styles.guidelineSubtitle}>You'll capture the front and back of the ID</Text>

      {/* Guideline Image */}
      <View style={styles.guidelineWrap}>
        <Image
          source={require('../assets/images/guidelines.png')}
          style={styles.guidelineImg}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.guidelineHint}>No Crop, No Blur, No Glare</Text>

      {/* Please avoid using (bottom card) */}
      <View style={styles.bottomCard}>
        <Text style={styles.avoidTitle}>Please avoid using</Text>
        <Text style={styles.avoidItem}>• <Text style={styles.avoidText}>Expired ID</Text></Text>
        <Text style={styles.avoidItem}>• <Text style={styles.avoidText}>Photocopied or printed ID</Text></Text>
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={styles.continueBtn}
        onPress={() => navigation.navigate('TakePhotoOfID', { idType: selectedIdType })}
      >
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#fff', paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 50 : 20,
    justifyContent: 'flex-start'
  },
  header: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 14, justifyContent: 'space-between',
  },
  backArrow: { fontSize: 28, color: '#000A63', fontWeight: 'bold' },
  headerTitle: { fontSize: 20, color: '#000A63', fontWeight: 'bold', textAlign: 'center' },
  skip: { fontSize: 16, color: '#000A63', fontWeight: '600' },
  bigTitle: {
    fontSize: 28, fontWeight: 'bold', marginBottom: 16, color: '#000A63', alignSelf: 'center',
  },
  inputLabel: {
    fontSize: 16, color: '#333', fontWeight: '500', marginBottom: 6,
  },
  dropdownBox: {
    borderWidth: 1, borderColor: '#A5B4FC', borderRadius: 8, marginBottom: 32, backgroundColor: '#fff',
    justifyContent: 'center', minHeight: 48,
  },
  picker: { height: 44, width: '100%' },

  illustrationWrap: { alignItems: 'center', marginBottom: 8 },
  illustrationImg: {
    width: screenWidth * 0.42,
    height: screenWidth * 0.22,
    marginBottom: 2,
  },

  guidelineTitle: {
    color: '#000A63', fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 12,
  },
  guidelineSubtitle: {
    color: '#666', fontSize: 15, textAlign: 'center', marginBottom: 4,
  },
  guidelineWrap: { alignItems: 'center', marginTop: 10 },
  guidelineImg: {
    width: screenWidth * 0.75,
    height: screenWidth * 0.18,
  },
  guidelineHint: {
    color: '#000A63', fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginTop: 7, marginBottom: 4,
  },

  bottomCard: {
    backgroundColor: '#F5F8FF',
    borderRadius: 12,
    padding: 16,
    marginTop: 28,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E7E9F7',
  },
  avoidTitle: {
    fontWeight: 'bold',
    color: '#b38a00',
    fontSize: 18,
    marginBottom: 3,
  },
  avoidItem: { fontSize: 16, color: '#b38a00', marginTop: 2 },
  avoidText: { color: '#b38a00', fontWeight: '500' },

  continueBtn: {
    backgroundColor: '#000A63',
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 18,
    width: '100%',
    alignSelf: 'center',
  },
  continueText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
});