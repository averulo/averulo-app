// screens/ChatScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../hooks/useAuth";

// Design colors
const PRIMARY_DARK = "#04123C";
const TEXT_DARK = "#012232";
const TEXT_MEDIUM = "#3E5663";
const TEXT_LIGHT = "#5F737D";
const BG_GRAY = "#F1F3F4";
const BORDER_GRAY = "#D4DADC";

export default function ChatScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  // Sample conversations data
  const [conversations] = useState([
    {
      id: 1,
      name: "Dr Kina Oputa",
      avatar: "https://i.pravatar.cc/150?img=5",
      lastMessage: "Hi John, I'm Oputa, staying in Room...",
      time: "19:30",
      unread: 0,
    },
  ]);

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Messages</Text>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="create-outline" size={22} color={PRIMARY_DARK} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={TEXT_LIGHT} />
          <TextInput
            placeholder="Search conversations"
            placeholderTextColor={TEXT_LIGHT}
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Conversations List */}
        {conversations.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="chatbubbles-outline" size={48} color={PRIMARY_DARK} />
            </View>
            <Text style={styles.emptyTitle}>No messages yet</Text>
            <Text style={styles.emptySubtitle}>
              Start a conversation with a property host or support team
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredConversations}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.conversationCard}
                activeOpacity={0.7}
                onPress={() => {
                  navigation.navigate("ChatDetailScreen", {
                    conversationId: item.id,
                    name: item.name,
                    avatar: item.avatar,
                  });
                }}
              >
                <View style={styles.avatar}>
                  {item.avatar ? (
                    <Image source={{ uri: item.avatar }} style={styles.avatarImage} />
                  ) : (
                    <Text style={styles.avatarText}>
                      {item.name[0]?.toUpperCase()}
                    </Text>
                  )}
                </View>

                <View style={styles.conversationContent}>
                  <View style={styles.conversationHeader}>
                    <Text style={styles.conversationName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.conversationTime}>{item.time}</Text>
                  </View>

                  <View style={styles.messageRow}>
                    <Text
                      style={[
                        styles.lastMessage,
                        item.unread && styles.unreadMessage,
                      ]}
                      numberOfLines={1}
                    >
                      {item.lastMessage}
                    </Text>
                    {item.unread > 0 && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadBadgeText}>{item.unread}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Manrope",
    color: TEXT_DARK,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: BG_GRAY,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BG_GRAY,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    fontFamily: "Manrope",
    color: TEXT_DARK,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: BG_GRAY,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    fontFamily: "Manrope",
    color: TEXT_DARK,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: "Manrope",
    color: TEXT_MEDIUM,
    textAlign: "center",
    lineHeight: 20,
  },
  conversationCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_GRAY,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: PRIMARY_DARK,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Manrope",
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Manrope",
    color: TEXT_DARK,
    flex: 1,
  },
  conversationTime: {
    fontSize: 12,
    fontFamily: "Manrope",
    color: TEXT_LIGHT,
    marginLeft: 8,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  lastMessage: {
    fontSize: 13,
    fontFamily: "Manrope",
    color: TEXT_MEDIUM,
    flex: 1,
  },
  unreadMessage: {
    fontWeight: "600",
    color: TEXT_DARK,
  },
  unreadBadge: {
    backgroundColor: PRIMARY_DARK,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  unreadBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
    fontFamily: "Manrope",
  },
});
