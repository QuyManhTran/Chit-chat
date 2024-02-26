export interface INewConversation {
    firstId: string;
    secondId: string;
}

export interface IPreviewChats {
    userId: string;
}

export interface IMessage {
    chatId: string;
    senderId: string;
    content: string;
}
