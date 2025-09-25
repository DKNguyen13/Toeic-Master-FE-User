// src/ChatbotPage.tsx

import React, { useState } from "react";
import ChatBot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import config from "../../ChatbotConfig";
import MessageParser from "../../MessageParser";
import ActionProvider from "../../ActionProvider";
import IConfig from "react-chatbot-kit/build/src/interfaces/IConfig";

interface ChatbotProps {
  isOpen: boolean;
  setIsOpen: (status: boolean) => void;
}
const Chatbot: React.FC<ChatbotProps> = ({ isOpen, setIsOpen }) => {
  // State để kiểm tra trạng thái mở/đóng chatbot

  // Hàm để mở/đóng chatbot
  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Nút để mở/đóng chatbot */}
      <button
        onClick={toggleChatbot}
        className={
          "fixed bottom-5 right-5 bg-blue-600 text-white p-4 rounded-full shadow-lg z-50"
        }
      >
        {isOpen ? "Đóng" : "Mở Chatbot"}
      </button>

      {/* Chatbot sẽ chỉ hiển thị khi isOpen là true */}
      {isOpen && (
        <div className="chatbot-page fixed bottom-5 right-5 z-50 w-96">
          <div className="chatbot-container bg-white rounded-lg shadow-lg p-4">
            <div className="flex justify-between items-center my-2">
              <h2 className="text-center text-2xl mb-4">Chat với TOEIC Bot</h2>
              <button
                className="bg-blue-600 text-white p-4 rounded-full shadow-lg z-50"
                onClick={toggleChatbot}
              >
                {isOpen ? "Đóng" : "Mở Chatbot"}
              </button>
            </div>
            <ChatBot
              config={config as IConfig}
              messageParser={MessageParser}
              actionProvider={ActionProvider}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
