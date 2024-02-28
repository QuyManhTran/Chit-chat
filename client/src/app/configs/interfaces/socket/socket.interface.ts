import { IMessage } from '@interfaces/chat/user.interface';

export interface IOnlineUser {
    userId: string;
    socketId: string;
}

export interface ISocketMessage {
    message: IMessage;
    callerId: string;
}
