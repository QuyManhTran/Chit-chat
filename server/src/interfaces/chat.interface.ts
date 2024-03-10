import { Call, MessageType } from '@customes/message.type';

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
    type: string;
    name?: string;
}

export interface INewAttachment {
    chatId: string;
    senderId: string;
    content: string;
    type: MessageType;
    name?: string;
}

export interface INewAudio {
    chatId: string;
    senderId: string;
    type: MessageType;
}

export interface IMessage {
    _id: string;
    chatId: string;
    senderId: string;
    content: string;
    type: string;
    name?: string;
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

export interface IOutGoing {
    sender: {
        id: string;
        name: string;
    };
    callerId: string;
    roomId: string;
    streamId: string;
    type: Call;
}

export interface IInComing {
    sender: {
        name: string;
        id: string;
    };
    roomId: string;
    streamId: string;
    type: Call;
}

export interface IZegoToken {
    appId: string;
    userId: string;
    serverId: string;
}
