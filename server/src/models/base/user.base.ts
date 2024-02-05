import { model } from 'mongoose';
import { IUser, UserSchema } from '../schemas/user.schema';

export const UserModel = model<IUser>('User', UserSchema);
