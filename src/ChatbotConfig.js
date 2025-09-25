// src/ChatbotConfig.js

// Define the configuration
const config = {
    botName: "TOEIC Bot",
    initialMessages: [
        {
            message: "Chào bạn! Tôi là TOEIC Bot. Bạn muốn luyện tập với tôi thế nào?",
            type: "bot",  // "bot" means this message is from the bot
        }
    ],
    customComponents: {
        // Custom components like a header or footer for your chatbot
    },
    customStyles: {
        botMessageBox: {
            backgroundColor: "#0D47A1",
        },
        chatButton: {
            backgroundColor: "#0D47A1",
        },
    },
};

export default config;
