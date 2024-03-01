import { MessageType } from '@enums/chat.enum';

export interface IUserInfor {
    _id: string;
    name: string;
    email: string;
}

export interface ICaller {
    name: string;
    id: string;
}

export interface IMessage {
    _id: string;
    chatId: string;
    senderId: string;
    content: string;
    type: MessageType;
    name?: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

export interface INewMessage {
    chatId: string;
    senderId: string;
    content: string;
    type: MessageType;
    name?: string;
}

export interface IConversation {
    _id: string;
    name: string;
    members: string[];
    callerId: string;
    latestMsg?: {
        content: string;
        senderId: string;
        date: Date;
        type: MessageType;
    };
    isReaded: boolean;
    createAt: Date;
    updatedAt: Date;
    __v: number;
}
