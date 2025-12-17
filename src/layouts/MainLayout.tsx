// MainLayout.tsx
import React, { useState } from "react";
import Header from "./common/Header";
import Footer from "./common/Footer";
import Chatbot from "../components/chatbot/Chatbot";
import FloatingDictionary from "../components/common/ActionMenu/FloatingActionMenu";
import { useLocation } from "react-router-dom";
const MainLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const pathname = location.pathname;

  const isDoingTest = pathname.startsWith("/session/") && !pathname.startsWith("/session/view");

  const isSessionPage = pathname.startsWith("/session");

  const shouldShowChatbot = !isDoingTest;

  return (
    <>
      <Header />

      <main className="min-h-screen">
        {children}
      </main>

      <FloatingDictionary />

      {shouldShowChatbot && (
        <Chatbot
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          socketUrl="http://localhost:8081"
        />
      )}

      {!isSessionPage && <Footer />}
    </>
  );
};

export default MainLayout;
