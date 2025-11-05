import axios from "axios";
import Constants from "expo-constants";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { playNotificationSound } from "../utils/sound";
import { useAuth } from "./useAuth";

const NotificationsContext = createContext();
const API_BASE = Constants.expoConfig?.extra?.apiUrl || "http://192.168.100.6:4000";

export const NotificationsProvider = ({ children }) => {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const prevUnreadCount = useRef(0);

  // 🔄 Fetch notifications
  async function fetchNotifications() {
    if (!token) return;
    try {
      console.log("🔗 Fetching notifications from:", API_BASE);
      const res = await axios.get(`${API_BASE}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const items = res.data.items || res.data || [];
      setNotifications(items);

      const unread = items.filter((n) => !n.readAt).length;
      setUnreadCount(unread);
    } catch (err) {
      console.log("❌ Error fetching notifications:", err.message);
    }
  }

  // 🕒 Poll every 10 seconds
  useEffect(() => {
    if (!token) return;
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [token]);

  // 🔊 Play sound if new unread notifications appear
  useEffect(() => {
    if (unreadCount > prevUnreadCount.current) {
      playNotificationSound();
    }
    prevUnreadCount.current = unreadCount;
  }, [unreadCount]);

  // ✅ Mark all notifications as read
  async function markAllRead() {
    if (!token) return;
    try {
      await axios.patch(`${API_BASE}/api/notifications/read-all`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotifications();
    } catch (err) {
      console.log("❌ Error marking notifications read:", err.message);
    }
  }

  return (
    <NotificationsContext.Provider
      value={{ notifications, unreadCount, fetchNotifications, markAllRead }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationsContext);