import { Document, ObjectId, Schema } from 'mongoose';
export interface IToken extends Document {
    userId: string;
    token: string;
}

export const TokenSchema: Schema = new Schema<IToken>(
    {
        userId: { type: String, required: true, unique: true },
        token: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);
TokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });
