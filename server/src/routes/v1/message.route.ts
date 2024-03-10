import { upload } from '@configs/multer.config';
import MessageController from '@controllers/message.controller';
import { Router } from 'express';
import verifyJWT from 'src/middlewares/verify.middleware';

const msgRoute: Router = Router();

msgRoute.post('/new-message/text', [verifyJWT], MessageController.newMessage);
msgRoute.post('/new-message/attachment', [verifyJWT], MessageController.newAttachment);
msgRoute.post(
    '/new-message/audio',
    [verifyJWT],
    upload.single('audio'),
    MessageController.newAudio
);
msgRoute.get('/get-messages', [verifyJWT], MessageController.getMessages);
export default msgRoute;
