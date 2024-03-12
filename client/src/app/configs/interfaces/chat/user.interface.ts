import { Call, MessageType } from '@enums/chat.enum';
import { ZegoStreamList } from 'zego-express-engine-webrtc/sdk/code/zh/ZegoExpressEntity.web';
import { ZegoUser } from 'zego-express-engine-webrtc/sdk/src/common/zego.entity';

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

export interface INewAudio {
    chatId: string;
    senderId: string;
    type: MessageType;
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
    appId: number;
    userId: string;
    serverId: string;
}

export interface ILoginRoom {
    roomID: string;
    user: ZegoUser;
}

export type RoomUserUpdateCallBack = (
    roomID: string,
    updateType: 'DELETE' | 'ADD',
    userList: ZegoUser[]
) => void;

export type RoomStreamUpdateCallBack = (
    roomID: string,
    updateType: 'DELETE' | 'ADD',
    streamList: ZegoStreamList[],
    extendedData: string
) => void;

export interface INewConversation {
    caller: {
        id: string;
        name: string;
    };
    senderId: string;
}
