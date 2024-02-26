import { Response, Request } from '@customes/auth.type';
import { IMessage } from '@interfaces/chat.interface';
import { ConversationModel } from '@models/base/conversation.base';
import { MessageModel } from '@models/base/message.base';

export default class MessageController {
    static newMessage = async (req: Request, res: Response) => {
        const accessToken = res.locals.accessToken;
        const { chatId, senderId, content } = <IMessage>req.body;
        try {
            const message = await MessageModel.create({ chatId, senderId, content });
            await ConversationModel.findOneAndUpdate(
                { _id: chatId, members: { $in: [senderId] } },
                {
                    latestMsg: {
                        content,
                        senderId,
                        date: new Date(),
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
