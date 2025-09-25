// src/MessageParser.js

class MessageParser {
    constructor(actionProvider) {
        this.actionProvider = actionProvider;
    }

    parse(message) {
        const lowercasedMessage = message.toLowerCase();

        if (lowercasedMessage.includes("hello") || lowercasedMessage.includes("hi")) {
            this.actionProvider.greet();
        } else if (lowercasedMessage.includes("help")) {
            this.actionProvider.provideHelp();
        } else {
            this.actionProvider.unknownMessage();
        }
    }
}

export default MessageParser;
