import { Document, Schema } from 'mongoose';
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
}

export const UserSchema: Schema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true },
        name: { type: String, required: true, index: true },
        password: { type: String, required: true, unique: true },
    },
    {
        timestamps: true,
    }
);
