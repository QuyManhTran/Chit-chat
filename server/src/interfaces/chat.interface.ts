export interface INewConversation {
    firstId: string;
    secondId: string;
}

export interface IPreviewChats {
    userId: string;
}

export interface INewMessage {
    chatId: string;
    senderId: string;
    content: string;
}

export interface IMessage {
    _id: string;
    chatId: string;
    senderId: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

export interface ISocketMessage {
    message: IMessage;
    callerId: string;
}

export interface IGetMessages {
    chatId: string;
}
