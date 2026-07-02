import {
  useEffect,
  useState,
  useRef,
  ReactNode,
  useMemo,
} from "react";
import { SessionTestContext } from "./sessionTest.context";
import { useSocket } from "../socket/useSocket";

/* ================= TYPES ================= */

interface AnswerQueueItem {
  sessionId: string;
  questionId: string;
  answer: string;
  timestamp: number;
}

interface Props {
  children: ReactNode;
}

const STORAGE_KEY = "toeic_answer_queue";

/* ================= PROVIDER ================= */

export const SessionTestProvider = ({ children }: Props) => {
  const { socket, connected } = useSocket(); // dùng socket global

  const [answerQueue, setAnswerQueue] = useState<AnswerQueueItem[]>([]);
  const answerQueueRef = useRef<AnswerQueueItem[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const userId = localStorage.getItem("userId");
  const lastSessionIdRef = useRef<string | null>(null);

  /* ================= LOAD QUEUE ================= */

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed: AnswerQueueItem[] = JSON.parse(stored);
      setAnswerQueue(parsed);
      answerQueueRef.current = parsed;
    }
  }, []);

  const persistQueue = (queue: AnswerQueueItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  };

  /* ================= FLUSH ================= */

  const flushQueue = () => {
    if (!socket) return;

    const queue = answerQueueRef.current;
    if (!queue.length) return;

    socket.emit("submit_bulk_answer", queue);

    answerQueueRef.current = [];
    setAnswerQueue([]);
    persistQueue([]);
  };

  /* ================= CORE ================= */

  const registerSession = (sessionId: string) => {
    if (!socket) return;

    lastSessionIdRef.current = sessionId;

    socket.emit("register_session", {
      userId,
      sessionId,
    });
  };

  const sendAnswer = (
    sessionId: string,
    questionId: string,
    answer: string
  ) => {
    const data: AnswerQueueItem = {
      sessionId,
      questionId,
      answer,
      timestamp: Date.now(),
    };

    setAnswerQueue((prev) => {
      // Xóa đáp án cũ của cùng question
      const filtered = prev.filter(
        (q) => q.questionId !== data.questionId
      );

      // Thêm đáp án mới
      const updated = [...filtered, data];
      answerQueueRef.current = updated;
      persistQueue(updated);
      return updated;
    });

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (socket && connected) {
        flushQueue();
      }
    }, 1000);
  };

  /* ================= AUTO FLUSH WHEN CONNECT ================= */

  useEffect(() => {
    if (connected && socket) {
      // reconnect → gửi lại queue
      if (lastSessionIdRef.current) {
        registerSession(lastSessionIdRef.current);
      }

      flushQueue();
    }
  }, [connected]);

  /* ================= VISIBILITY ================= */

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && socket && connected) {
        flushQueue();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );
  }, [socket, connected]);

  /* ================= MULTI TAB ================= */

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        const updated = JSON.parse(e.newValue);
        answerQueueRef.current = updated;
        setAnswerQueue(updated);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  /* ================= CONTEXT ================= */

  const value = useMemo(
    () => ({
      registerSession,
      sendAnswer,
      connected,
    }),
    [connected]
  );

  return (
    <SessionTestContext.Provider value={value}>
      {children}
    </SessionTestContext.Provider>
  );
};