import { createContext } from "react";

/* ================= TYPES ================= */

export interface SessionTestContextType  {
  registerSession: (sessionId: string) => void;
  sendAnswer: (
    sessionId: string,
    questionId: string,
    answer: string
  ) => void;
  connected: boolean;
}

/* ================= CONTEXT ================= */

export const SessionTestContext = createContext<SessionTestContextType | null>(null)