import ChatController from '@controllers/chat.controller';
import verifyJWT from 'src/middlewares/verify.middleware';
import { Router } from 'express';

const chatRouter: Router = Router();

chatRouter.post('/create-conversation', [verifyJWT], ChatController.createConversation);
chatRouter.get('/preview-chats', [verifyJWT], ChatController.previewChats);
export default chatRouter;
