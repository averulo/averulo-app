import { StyleSheet, Text, View } from 'react-native';

export default function EditProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>👤 Edit Profile Screen (placeholder)</Text>
      <Text style={styles.sub}>Here user will update their name, avatar, etc.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  text: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  sub: { color: 'gray' },
});