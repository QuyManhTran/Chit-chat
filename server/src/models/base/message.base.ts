import { IMessage, MessageSchema } from '@models/schemas/message.schema';
import { model } from 'mongoose';

export const MessageModel = model<IMessage>('Message', MessageSchema);
