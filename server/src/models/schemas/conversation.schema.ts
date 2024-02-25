import { Document, Schema } from 'mongoose';
export interface IConversation extends Document {
    members: string[];
    latestMsg: {
        content: string;
        date: Date;
    };
}

export const ConversationSchema: Schema = new Schema<IConversation>(
    {
        members: {
            type: [String],
            required: true,
        },
        latestMsg: {
            type: Object,
            properties: {
                content: String,
                date: Date,
            },
        },
    },
    {
        timestamps: true,
    }
);
