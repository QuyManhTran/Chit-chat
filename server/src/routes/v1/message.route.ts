import MessageController from '@controllers/message.controller';
import { Router } from 'express';
import verifyJWT from 'src/middlewares/verify.middleware';

const msgRoute: Router = Router();

msgRoute.post('/new-message', [verifyJWT], MessageController.newMessage);
msgRoute.get('/get-messages', [verifyJWT], MessageController.getMessages);
export default msgRoute;
