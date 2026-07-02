import {
  useEffect,
  useState,
  ReactNode,
  useMemo,
} from "react";
import { useSocket } from "../socket/useSocket";
import type {
  Notification,
  NotificationContextType,
} from "./notification.context";
import {
  NotificationContext,
} from "./notification.context";

/* ================= TYPES ================= */

interface Props {
  children: ReactNode;
}

const STORAGE_KEY = "toeic_notifications";

/* ================= PROVIDER ================= */

export const NotificationProvider = ({ children }: Props) => {
  const { socket } = useSocket();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  /* ================= LOAD FROM STORAGE ================= */

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      const parsed: Notification[] = JSON.parse(stored);

      setNotifications(parsed);
      setUnreadCount(parsed.filter((n) => !n.read).length);
    }
  }, []);

  /* ================= SAVE TO STORAGE ================= */

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  /* ================= SOCKET LISTENER ================= */

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (notification: Notification) => {
      console.log("🔔 New notification:", notification);

      setNotifications((prev) => {
        // tránh duplicate
        if (prev.some((n) => n.id === notification.id)) {
          return prev;
        }
        return [notification, ...prev];
      });

      if (!notification.read) {
        setUnreadCount((prev) => prev + 1);
      }

      showBrowserNotification(notification);
      playNotificationSound();
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [socket]);

  /* ================= ACTIONS ================= */

  const markAsRead = (id: string) => {
    if (!socket) return;

    socket.emit("mark-as-read", id);

    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );

    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  /* ================= HELPERS ================= */

  const showBrowserNotification = (notification: Notification) => {
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
      new Notification(notification.title, {
        body: notification.message,
        icon: notification.icon || "/logo192.png",
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(notification.title, {
            body: notification.message,
          });
        }
      });
    }
  };

  const playNotificationSound = () => {
    const audio = new Audio("/sounds/notification.mp3");
    audio.volume = 0.3;

    audio.play().catch(() => {});
  };

  /* ================= CONTEXT ================= */

  const value: NotificationContextType = useMemo(
    () => ({
      notifications,
      unreadCount,
      markAsRead,
      clearNotifications,
    }),
    [notifications, unreadCount]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
