import UserController from '@controllers/user.controller';
import { Router } from 'express';
import verifyJWT from 'src/middlewares/verify.middleware';

const userRouter: Router = Router();

userRouter.get('/find-users', [verifyJWT], UserController.findUsers);
export default userRouter;
