import { ConversationSchema, IConversation } from '@models/schemas/conversation.schema';
import { model } from 'mongoose';

export const ConversationModel = model<IConversation>('Conversation', ConversationSchema);
