import { Response, Request } from '@customes/auth.type';
import { IGetMessages, INewMessage } from '@interfaces/chat.interface';
import { ConversationModel } from '@models/base/conversation.base';
import { MessageModel } from '@models/base/message.base';

export default class MessageController {
    static getMessages = async (req: Request, res: Response) => {
        const accessToken = res.locals.accessToken;
        const { chatId } = <IGetMessages>(<unknown>req.query);
        try {
            const messages = await MessageModel.find({ chatId: chatId })
                .sort({ createdAt: -1 })
                .limit(50);
            res.status(200).json(
                accessToken ? { data: messages, accessToken: accessToken } : { data: messages }
            );
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Something went wrong!' });
        }
    };

    static newMessage = async (req: Request, res: Response) => {
        const accessToken = res.locals.accessToken;
        const { chatId, senderId, content, type, name } = <INewMessage>req.body;
        try {
            const message = await MessageModel.create(
                name
                    ? { chatId, senderId, content, type, name }
                    : { chatId, senderId, content, type }
            );
            await ConversationModel.findOneAndUpdate(
                { _id: chatId, members: { $in: [senderId] } },
                {
                    latestMsg: {
                        content,
                        senderId,
                        date: new Date(),
                        type,
                    },
                }
            );
            res.status(200).json(
                accessToken ? { data: message, accessToken: accessToken } : { data: message }
            );
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'something went wrong!' });
        }
    };
}
