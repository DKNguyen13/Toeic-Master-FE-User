// src/ActionProvider.js

class ActionProvider {
    constructor(createChatBotMessage, setStateFunc, createCustomMessage) {
        this.createChatBotMessage = createChatBotMessage;
        this.setState = setStateFunc;
        this.createCustomMessage = createCustomMessage;
    }

    greet() {
        const greetingMessage = this.createChatBotMessage("Chào bạn! Tôi có thể giúp gì cho bạn?", { type: "bot" });
        this.updateChatbotState(greetingMessage);
    }

    provideHelp() {
        const helpMessage = this.createChatBotMessage("Nếu bạn cần trợ giúp, bạn có thể hỏi về các bài học TOEIC.", { type: "bot" });
        this.updateChatbotState(helpMessage);
    }

    unknownMessage() {
        const unknownMessage = this.createChatBotMessage("Xin lỗi, tôi không hiểu. Bạn có thể hỏi tôi điều khác không?", { type: "bot" });
        this.updateChatbotState(unknownMessage);
    }

    updateChatbotState(message) {
        this.setState(prevState => ({
            ...prevState,
            messages: [...prevState.messages, message]
        }));
    }
}

export default ActionProvider;
