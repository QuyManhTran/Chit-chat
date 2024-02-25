import { Router } from 'express';
import authRouter from './auth.route';
import chatRouter from './chat.route';
const v1Router: Router = Router();
v1Router.use('/auth', authRouter);
v1Router.use('/chat', chatRouter);
export default v1Router;
