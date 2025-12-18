import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  
  // NOTIFICATION STATE
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // ANSWER QUEUE STATE
  const [answerQueue, setAnswerQueue] = useState([]);

  const userId = localStorage.getItem("userId");
  const lastSessionIdRef = useRef(null);

  // ==================
  // MAIN SOCKET SETUP
  // ==================
  useEffect(() => {
    if (!userId) {
      console.log("User not logged in, skipping socket connection");
      return;
    }

    const SOCKET_URL = "https://toeic-master-be.onrender.com";
    console.log("Connecting to socket server:", SOCKET_URL);

    const newSocket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      auth: {
        token: localStorage. getItem("token"),
      },
    });

    setSocket(newSocket);

    // ==================
    // CONNECTION EVENTS
    // ==================
    newSocket.on("connect", () => {
      console.log("✓ Connected to socket server:", newSocket.id);
      setConnected(true);
      newSocket.emit("register", userId);
      
      // Gửi các answers trong queue khi reconnect
      flushAnswerQueue(newSocket);
    });

    newSocket.on("connected", (data) => {
      console. log("✓ Registered with server:", data);
    });

    newSocket.on("disconnect", (reason) => {
      console. log("✗ Disconnected:", reason);
      setConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setConnected(false);
    });

    newSocket.on("reconnect_attempt", (attemptNumber) => {
      console.log(`Reconnection attempt ${attemptNumber}... `);
    });

    newSocket.on("reconnect", (attemptNumber) => {
      console.log(`✓ Reconnected after ${attemptNumber} attempts`);
      setConnected(true);
      newSocket.emit("register", userId);
      
      // Re-register session và flush answer queue
      if (lastSessionIdRef.current) {
        registerSession(lastSessionIdRef.current);
      }
      flushAnswerQueue(newSocket);
    });

    // ==================
    // NOTIFICATION EVENTS
    // ==================
    newSocket.on("notification", (notification) => {
      console.log("New notification:", notification);

      // Cập nhật danh sách notifications
      setNotifications((prev) => [notification, ...prev]);

      // Tăng unread count
      if (!notification.read) {
        setUnreadCount((prev) => prev + 1);
        console.log("Unread count:", unreadCount + 1);
      }

      // Hiển thị browser notification
      showBrowserNotification(notification);

      // Phát âm thanh
      playNotificationSound();
    });

    // ==================
    // ANSWER ACK EVENTS
    // ==================
    newSocket.on("answer_ack", (data) => {
      console.log("✓ Answer saved on server:", data);
    });

    // Cleanup
    return () => {
      console.log("Disconnecting socket...");
      newSocket.close();
      setSocket(null);
      setConnected(false);
    };
  }, [userId]);

  // ==================
  // HELPER FUNCTIONS
  // ==================

  /**
   * Gửi các answers trong queue khi socket ready
   */
  const flushAnswerQueue = (socketInstance) => {
    if (answerQueue.length === 0) return;

    console.log(`Flushing ${answerQueue.length} queued answers... `);
    answerQueue.forEach((answer) => {
      socketInstance.emit("submit_answer", answer);
    });
    setAnswerQueue([]);
  };

  /**
   * Hiển thị browser notification
   */
  const showBrowserNotification = (notification) => {
    if (! ("Notification" in window)) {
      return;
    }

    if (Notification.permission === "granted") {
      new Notification(notification. title, {
        body: notification.message,
        icon: notification.icon || "/logo192.png",
        badge: "/logo192.png",
        tag: notification.id,
        data: notification,
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(notification. title, {
            body: notification.message,
            icon: notification.icon || "/logo192.png",
          });
        }
      });
    }
  };

  /**
   * Phát âm thanh notification
   */
  const playNotificationSound = () => {
    const audio = new Audio("/sounds/notification.mp3");
    audio.volume = 0.3;
    audio.play().catch((e) => console.log("Cannot play sound:", e));
  };

  /**
   * Đánh dấu notification là đã đọc
   */
  const markAsRead = (notificationId) => {
    if (socket) {
      socket.emit("mark-as-read", notificationId);

      setNotifications((prev) =>
        prev.map((notif) =>
          notif. id === notificationId ?  { ...notif, read: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  /**
   * Xóa tất cả notifications
   */
  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  /**
   * Đăng ký session
   */
  const registerSession = (sessionId) => {
    if (! socket) {
      console.warn("⚠ Socket not connected yet");
      return;
    }
    console.log("Registering to session room:", sessionId);
    lastSessionIdRef.current = sessionId;
    socket.emit("register_session", {
      userId,
      sessionId,
    });
  };

  /**
   * Gửi đáp án (auto-queue nếu socket chưa ready)
   */
  const sendAnswer = (sessionId, questionId, answer) => {
    const answerData = {
      sessionId,
      questionId,
      answer,
      timestamp: Date.now(),
    };

    if (!socket || !connected) {
      console.warn(
        "⚠ Socket not connected → Queueing answer for later dispatch"
      );
      // Queue answer để gửi khi socket ready
      setAnswerQueue((prev) => [...prev, answerData]);
      return;
    }

    console.log("Sending answer to server:", answerData);
    socket.emit("submit_answer", answerData);
  };

  const value = {
    // Socket state
    socket,
    connected,
    
    // Notification state & methods
    notifications,
    unreadCount,
    markAsRead,
    clearNotifications,
    
    // Session & Answer methods
    registerSession,
    sendAnswer,
    
    // Queue info (optional - có thể dùng để debug)
    answerQueueLength: answerQueue.length,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};