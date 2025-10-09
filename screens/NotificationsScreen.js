import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNotifications } from '../hooks/useNotifications';

export default function NotificationsScreen() {
  const { notifications, markAllRead } = useNotifications();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        <TouchableOpacity onPress={markAllRead}>
          <Text style={styles.markRead}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              !item.readAt ? styles.unread : null,
            ]}
          >
            <Text style={styles.titleText}>{item.title}</Text>
            <Text style={styles.bodyText}>{item.body}</Text>
            <Text style={styles.timeText}>
              {new Date(item.createdAt).toLocaleString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
  },
  markRead: {
    fontSize: 14,
    color: '#0066FF',
  },
  card: {
    backgroundColor: '#FFF',
    padding: 14,
    marginVertical: 6,
    borderRadius: 10,
    elevation: 1,
  },
  unread: {
    borderLeftWidth: 4,
    borderLeftColor: '#0066FF',
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  bodyText: {
    color: '#555',
    marginTop: 4,
  },
  timeText: {
    marginTop: 8,
    color: '#999',
    fontSize: 12,
  },
});