// MainLayout.tsx
import React, { useState } from "react";
import Header from "./common/Header";
import Footer from "./common/Footer";
import Chatbot from "../components/chatbot/Chatbot";
import FloatingDictionary from "../components/common/ActionMenu/FloatingActionMenu";
const MainLayout = ({ children }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Header />
			<main className="min-h-screen">
				{React.cloneElement(children, { setIsOpen })} {/* Truyền setIsOpen xuống component con */}
			</main>
			<FloatingDictionary/>
			<Chatbot isOpen={isOpen} setIsOpen={setIsOpen} socketUrl="http://localhost:8081"/>
			<Footer />
		</>
	);
};

export default MainLayout;
