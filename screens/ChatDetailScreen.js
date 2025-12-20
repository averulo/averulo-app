// screens/ChatDetailScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Design colors
const PRIMARY_DARK = "#04123C";
const TEXT_DARK = "#012232";
const TEXT_MEDIUM = "#3E5663";
const TEXT_LIGHT = "#5F737D";
const BG_GRAY = "#F1F3F4";
const BG_LIGHT = "#F9FAFB";
const BORDER_GRAY = "#D4DADC";
const MESSAGE_SENT = "#04123C";
const MESSAGE_RECEIVED = "#F1F3F4";

export default function ChatDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { conversationId, name, avatar } = route.params || {};

  const [message, setMessage] = useState("");

  // Sample messages
  const [messages] = useState([
    {
      id: 1,
      text: "Hi John, I'm Oputa, staying in Room 201. I have a concern regarding the air conditioning unit in my room. It seems to be malfunctioning, and the temperature is quite uncomfortable.",
      sender: "other",
      time: "19:30",
    },
    {
      id: 2,
      text: "Good evening Dr. Oputa. Thank you for reaching out. I apologize for the inconvenience. I'll send our maintenance team to your room right away to address the issue.",
      sender: "me",
      time: "19:32",
    },
    {
      id: 3,
      text: "Thank you for your prompt response. I appreciate it.",
      sender: "other",
      time: "19:33",
    },
    {
      id: 4,
      text: "You're welcome! Our team should be there within the next 15 minutes. Is there anything else I can help you with?",
      sender: "me",
      time: "19:34",
    },
  ]);

  const handleSend = () => {
    if (message.trim()) {
      // TODO: Send message logic
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const renderMessage = ({ item }) => {
    const isMe = item.sender === "me";
    return (
      <View
        style={[
          styles.messageContainer,
          isMe ? styles.messageContainerMe : styles.messageContainerOther,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isMe ? styles.messageBubbleMe : styles.messageBubbleOther,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isMe ? styles.messageTextMe : styles.messageTextOther,
            ]}
          >
            {item.text}
          </Text>
        </View>
        <Text style={styles.messageTime}>{item.time}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color={TEXT_DARK} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <View style={styles.avatarSmall}>
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>{name?.[0]?.toUpperCase()}</Text>
              )}
            </View>
            <Text style={styles.headerName}>{name || "Chat"}</Text>
          </View>

          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="ellipsis-vertical" size={20} color={TEXT_DARK} />
          </TouchableOpacity>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            Keep in mind that Averulo is not responsible for any issues that may
            arise during your stay. Please contact the property directly for
            assistance.
          </Text>
        </View>

        {/* Messages List */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
        />

        {/* Message Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Type a message..."
              placeholderTextColor={TEXT_LIGHT}
              style={styles.textInput}
              value={message}
              onChangeText={setMessage}
              multiline
            />
            <TouchableOpacity style={styles.micButton}>
              <Ionicons name="mic-outline" size={22} color={TEXT_MEDIUM} />
            </TouchableOpacity>
          </View>
          {message.trim().length > 0 && (
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Ionicons name="send" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_GRAY,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  headerCenter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  avatarSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: PRIMARY_DARK,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Manrope",
  },
  headerName: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Manrope",
    color: TEXT_DARK,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  disclaimer: {
    backgroundColor: BG_GRAY,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_GRAY,
  },
  disclaimerText: {
    fontSize: 12,
    fontFamily: "Manrope",
    color: TEXT_MEDIUM,
    lineHeight: 16,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  messageContainerMe: {
    alignItems: "flex-end",
  },
  messageContainerOther: {
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 4,
  },
  messageBubbleMe: {
    backgroundColor: MESSAGE_SENT,
    borderBottomRightRadius: 4,
  },
  messageBubbleOther: {
    backgroundColor: MESSAGE_RECEIVED,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    fontFamily: "Manrope",
    lineHeight: 20,
  },
  messageTextMe: {
    color: "#FFFFFF",
  },
  messageTextOther: {
    color: TEXT_DARK,
  },
  messageTime: {
    fontSize: 11,
    fontFamily: "Manrope",
    color: TEXT_LIGHT,
    marginHorizontal: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: BORDER_GRAY,
    gap: 8,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BG_LIGHT,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 44,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Manrope",
    color: TEXT_DARK,
    maxHeight: 100,
  },
  micButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: PRIMARY_DARK,
    justifyContent: "center",
    alignItems: "center",
  },
});
