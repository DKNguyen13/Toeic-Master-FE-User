// MainLayout.tsx
import React, { useState } from "react";
import Header from "./common/Header";
import Footer from "./common/Footer";
import Chatbot from "../pages/Chatbot/Chatbot";

const MainLayout = ({ children }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Header />
			<main className="min-h-screen p-4">
				{React.cloneElement(children, { setIsOpen })} {/* Truyền setIsOpen xuống component con */}
			</main>
			<Chatbot isOpen={isOpen} setIsOpen={setIsOpen} />
			<Footer />
		</>
	);
};

export default MainLayout;
