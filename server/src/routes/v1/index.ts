import { Router } from 'express';
import authRouter from './auth.route';
import chatRouter from './chat.route';
import msgRoute from './message.route';
const v1Router: Router = Router();
v1Router.use('/auth', authRouter);
v1Router.use('/chat', chatRouter);
v1Router.use('/message', msgRoute);
export default v1Router;
