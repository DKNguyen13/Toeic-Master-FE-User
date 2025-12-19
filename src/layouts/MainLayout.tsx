// MainLayout.tsx
import Header from "./common/Header";
import Footer from "./common/Footer";
import { useState } from "react";
import { config } from "../config/env.config";
import { useLocation } from "react-router-dom";
import Chatbot from "../components/chatbot/Chatbot";
import FloatingDictionary from "../components/common/ActionMenu/FloatingActionMenu";

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
          socketUrl={`${config.apiBaseUrl}`}
        />
      )}

      {!isSessionPage && <Footer />}
    </>
  );
};

export default MainLayout;
