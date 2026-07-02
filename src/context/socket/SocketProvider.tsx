import {
  useEffect,
  useState,
  ReactNode,
  useMemo,
} from "react";
import { io, Socket } from "socket.io-client";
import { config } from "../../config/env.config";
import { SocketContext } from "./socket.context";

interface Props {
  children: ReactNode;
}

export const SocketProvider = ({ children }: Props) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  const userId = localStorage.getItem("userId");

  /* ================= SOCKET INIT ================= */

  useEffect(() => {
    if (!userId) return;

    const newSocket: Socket = io(config.apiBaseUrl, {
      transports: ["websocket", "polling"], // fallback
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      auth: {
        token: localStorage.getItem("token") || "",
      },
    });

    setSocket(newSocket);

    /* ================= EVENTS ================= */

    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id);
      setConnected(true);

      // register user
      newSocket.emit("register", userId);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
      setConnected(false);
    });

    newSocket.on("connect_error", (err) => {
      console.error("⚠️ Socket error:", err.message);
      setConnected(false);
    });

    newSocket.on("reconnect", () => {
      console.log("🔄 Reconnected");
      setConnected(true);

      // đăng ký lại user
      newSocket.emit("register", userId);
    });

    return () => {
      console.log("🛑 Closing socket...");
      newSocket.removeAllListeners();
      newSocket.close();
    };
  }, [userId]);

  /* ================= CONTEXT ================= */

  const value = useMemo(
    () => ({
      socket,
      connected,
    }),
    [socket, connected]
  );

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};