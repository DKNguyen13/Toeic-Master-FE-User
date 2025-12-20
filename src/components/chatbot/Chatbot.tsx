import socketService from "../../service/socket";
import { config } from "../../config/env.config";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Send, MessageCircle, X, Minimize2, Sparkles, Bot, User } from "lucide-react";

// Types
interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  isLoading?: boolean;
}

interface ChatbotProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  socketUrl?: string;
}

// Loading Dots
const LoadingDots = () => (
  <div className="flex space-x-1 items-center">
    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
  </div>
);

// Message Bubble
const MessageBubble = ({ message }: { message: Message }) => {
  const isBot = message.sender === "bot";
  return (
    <div className={`flex items-start gap-3 ${isBot ? "" : "flex-row-reverse"} animate-slideIn`}>
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isBot
            ? "bg-blue-500 shadow-lg"
            : "bg-gradient-to-br from-green-400 to-blue-500 shadow-lg"
        }`}
      >
        {isBot ? <Bot className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-white" />}
      </div>
      <div className={`flex flex-col ${isBot ? "items-start" : "items-end"} max-w-[75%]`}>
        <div
          className={`rounded-2xl px-4 py-3 shadow-md ${
            isBot ? "bg-white border border-gray-100" : "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
          }`}
        >
          {message.isLoading ? (
            <LoadingDots />
          ) : (
            <p className={`text-sm leading-relaxed ${isBot ? "text-gray-800" : "text-white"} whitespace-pre-line`}>{message.text}</p>
          )}
        </div>
        <span className="text-xs text-gray-400 mt-1 px-1">
          {message.timestamp.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
};

// Chat container
const ChatContainer = ({ messages }: { messages: Message[] }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
      {messages.map((m) => (
        <MessageBubble key={m.id} message={m} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

  // Chat Input
const ChatInput = React.forwardRef<HTMLInputElement, {
  onSendMessage: (text: string) => void;
  disabled: boolean;
}>(({ onSendMessage, disabled }, ref) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  return (
    <div className="relative">
      <input
        ref={ref}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleSubmit(e)}
        placeholder="Nhập tin nhắn..."
        disabled={disabled}
        className="w-full pl-4 pr-12 py-3 rounded-xl border-2 border-gray-200 
                   focus:border-blue-500 focus:outline-none transition-colors
                   disabled:bg-gray-100 disabled:cursor-not-allowed
                   text-sm shadow-sm"
      />
      <button
        onClick={handleSubmit}
        disabled={disabled || !input.trim()}
        className="absolute right-2 top-1/2 -translate-y-1/2 
                   bg-gradient-to-r from-blue-500 to-blue-600 
                   text-white p-2 rounded-lg
                   hover:from-blue-600 hover:to-blue-700 
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-200 hover:scale-105 active:scale-95
                   shadow-md">
        <Send className="w-4 h-4" />
      </button>
    </div>
  );
});

// Main Chatbot
const Chatbot: React.FC<ChatbotProps> = ({ isOpen, setIsOpen, socketUrl = `${config.apiBaseUrl}` }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Xin chào! 👋 Tôi là Toeic Bot, trợ lý học tiếng Anh của bạn. Tôi có thể giúp gì cho bạn hôm nay?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [isConnected, setIsConnected] = useState(false);
  const [isWaitingResponse, setIsWaitingResponse] = useState(false);
  const chatInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isWaitingResponse) {
      chatInputRef.current?.focus();
    }
  }, [isWaitingResponse]);

  // Socket logic đúng
  useEffect(() => {
    if (isOpen) {
      const socket = socketService.connect(socketUrl);

      socket.on("connect", () => {
        setIsConnected(true);
      });

      socket.on("disconnect", () => {
        setIsConnected(false);
      });

      socket.on("response", (text: string) => {
        setMessages((prev) => prev.filter((m) => !m.isLoading));
        setMessages((prev) => [
          ...prev,
          { id: `bot-${Date.now()}`, text, sender: "bot", timestamp: new Date() },
        ]);
        setIsWaitingResponse(false);
      });

      socket.on("error", (err: string) => {
        console.error("Socket error:", err);
        setMessages((prev) => prev.filter((m) => !m.isLoading));
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            text: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.",
            sender: "bot",
            timestamp: new Date(),
          },
        ]);
        setIsWaitingResponse(false);
      });

      return () => {
        socket.off("connect");
        socket.off("disconnect");
        socket.off("response");
        socket.off("error");
        socketService.disconnect();
      };
    }
  }, [isOpen, socketUrl]);

  // Handle send message
  const handleSendMessage = useCallback((text: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text,
      sender: "user",
      timestamp: new Date(),
    };
    const loading: Message = {
      id: `loading-${Date.now()}`,
      text: "",
      sender: "bot",
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMessage, loading]);
    setIsWaitingResponse(true);

    const socket = socketService.getSocket();
    if (socket && socket.connected) {
      socket.emit("message", text);
    } else {
      console.error("Socket not connected");
      setMessages((prev) => prev.filter((m) => !m.isLoading));
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          text: "Không thể kết nối đến server. Vui lòng thử lại.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
      setIsWaitingResponse(false);
    }
  }, []);

  const toggleChatbot = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={toggleChatbot}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl
                   transition-all duration-300 ease-out hover:scale-110 active:scale-95
                   flex items-center justify-center z-50 group
                   ${
                     isOpen
                       ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                       : " bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                   }`}
        aria-label={isOpen ? "Đóng chatbot" : "Mở chatbot"}>
        {isOpen ? (
          <X className="w-6 h-6 text-white transition-transform duration-300 group-hover:rotate-90" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white transition-transform duration-300 group-hover:rotate-12" />
        )}
        {!isOpen && <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20"></span>}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[550px] z-[9999] animate-scaleIn origin-bottom-right">
          <div className="w-full h-full bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden backdrop-blur-xl">
            {/* Header */}
            <div className="relative bg-blue-600 text-white p-4 shadow-lg">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full blur-2xl"></div>
              </div>
              <div className="relative flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border-2 border-white/30">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${
                        isConnected ? "bg-green-400" : "bg-red-400"
                      }`}
                    ></div>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold tracking-wide">Toeic Master</h2>
                    <p className="text-xs text-blue-100">{isConnected ? "Trực tuyến" : "Mất kết nối"}</p>
                  </div>
                </div>
                <button
                  onClick={toggleChatbot}
                  className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                  aria-label="Thu nhỏ chatbot"
                >
                  <Minimize2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <ChatContainer messages={messages} />

            <div className="p-4 bg-white border-t border-gray-100">
              <ChatInput
                  ref={chatInputRef}
                  onSendMessage={handleSendMessage}
                  disabled={!isConnected || isWaitingResponse}
                />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-slideIn { animation: slideIn 0.3s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.2s ease-out; }
      `}</style>
    </>
  );
};

export default Chatbot;
