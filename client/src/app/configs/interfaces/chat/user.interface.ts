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

export interface IConversation {
    _id: string;
    name: string;
    members: string[];
    callerId: string;
    latestMessage: string;
    isReaded: boolean;
    createAt: Date;
    updatedAt: Date;
    __v: number;
}
