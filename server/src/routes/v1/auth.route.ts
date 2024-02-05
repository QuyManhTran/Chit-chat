import AuthController from '@controllers/auth.controller';
import { Router } from 'express';

const authRouter: Router = Router();

authRouter.post('/login', AuthController.login);
authRouter.post('/register', AuthController.register);

export default authRouter;
