import { Document, Schema } from 'mongoose';
export interface IMessage extends Document {
    chatId: string;
    senderId: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export const MessageSchema: Schema = new Schema<IMessage>(
    {
        chatId: {
            type: String,
            required: true,
        },
        senderId: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);
