import axios from "axios";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { API_BASE } from "../lib/api";
import { playNotificationSound } from "../utils/sound";
import { useAuth } from "./useAuth";


const NotificationsContext = createContext();


export const NotificationsProvider = ({ children }) => {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const prevUnreadCount = useRef(0);
  const abortControllerRef = useRef(null);

  // 🔄 Fetch notifications with abort support
  const fetchNotifications = useCallback(async () => {
    if (!token) return;

    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      console.log("🔗 Fetching notifications from:", API_BASE);
      const res = await axios.get(`${API_BASE}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: abortControllerRef.current.signal,
      });

      const items = res.data.items || res.data || [];
      setNotifications(items);

      const unread = items.filter((n) => !n.readAt).length;
      setUnreadCount(unread);
    } catch (err) {
      // Ignore abort errors
      if (err.name === 'CanceledError' || err.name === 'AbortError') return;
      console.log("❌ Error fetching notifications:", err.message);
    }
  }, [token]);

  // 🕒 Poll every 10 seconds with proper cleanup
  useEffect(() => {
    if (!token) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);

    return () => {
      clearInterval(interval);
      // Cancel any in-flight request on cleanup
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [token, fetchNotifications]);

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