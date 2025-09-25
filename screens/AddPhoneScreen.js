import { StyleSheet, Text, View } from 'react-native';

export default function AddPhoneScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>📱 Add Phone Screen (placeholder)</Text>
      <Text style={styles.sub}>Here user will enter their phone number.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  text: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  sub: { color: 'gray' },
});