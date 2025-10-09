import { Text, TouchableOpacity, View } from 'react-native';
import { useNotifications } from '../hooks/useNotifications';

export default function NotificationBell({ onPress }) {
  const { unreadCount } = useNotifications(); // 🧠 this pulls data from the provider

  return (
    <TouchableOpacity onPress={onPress} style={{ position: 'relative' }}>
      <Text style={{ fontSize: 24 }}>🔔</Text>
      {unreadCount > 0 && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            backgroundColor: '#FF3B30',
            borderRadius: 8,
            width: 16,
            height: 16,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontSize: 10 }}>{unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}