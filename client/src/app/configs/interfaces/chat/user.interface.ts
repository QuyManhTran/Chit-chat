export interface IUserInfor {
    _id: string;
    name: string;
    email: string;
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

export interface INewMessage {
    chatId: string;
    senderId: string;
    content: string;
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
    };
    isReaded: boolean;
    createAt: Date;
    updatedAt: Date;
    __v: number;
}
