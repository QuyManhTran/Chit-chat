import { Request, Response } from '@customes/auth.type';
import { INewConversation, IPreviewChats } from '@interfaces/chat.interface';
import { ConversationModel } from '@models/base/conversation.base';
import { UserModel } from '@models/base/user.base';

export default class ChatController {
    static createConversation = async (req: Request, res: Response) => {
        const accessToken = res.locals.accessToken;
        const { firstId, secondId } = <INewConversation>req.body;
        console.log(firstId, secondId);
        try {
            const conversation = await ConversationModel.findOne({
                members: { $all: [firstId, secondId] },
            });
            if (conversation)
                return res.status(200).json({ message: 'Conversation already exists' });
            const newConversation = await ConversationModel.create({
                members: [firstId, secondId],
            });
            res.status(200).json(
                accessToken
                    ? { data: newConversation, accessToken: accessToken }
                    : { data: newConversation }
            );
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Something went wrong!' });
        }
    };

    static previewChats = async (req: Request, res: Response) => {
        const accessToken = res.locals.accessToken;
        const { userId } = <IPreviewChats>(<unknown>req.query);
        try {
            const chats = await ConversationModel.find({
                members: { $in: [userId] },
            });
            const filterChats = await Promise.all(
                chats.map(async (chat) => {
                    const callerId = chat.members.find((member) => member != userId);
                    const filterChat = await UserModel.findById(callerId);
                    return {
                        ...chat.toObject(),
                        name: filterChat ? filterChat.name : 'Unknown',
                        callerId: filterChat ? filterChat._id : callerId,
                        isReaded: true,
                    };
                })
            );
            res.status(200).json(
                accessToken
                    ? { data: filterChats, accessToken: accessToken }
                    : { data: filterChats }
            );
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Something went wrong !' });
        }
    };
}
