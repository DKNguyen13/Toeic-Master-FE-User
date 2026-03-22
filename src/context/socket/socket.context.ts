import { createContext } from "react";
import { Socket } from "socket.io-client";

/* ================= TYPES ================= */

export interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
}

/* ================= CONTEXT ================= */

export const SocketContext = createContext<SocketContextType | null>(null);