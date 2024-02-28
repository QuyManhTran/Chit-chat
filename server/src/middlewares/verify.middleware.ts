import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from '@customes/auth.type';
import envConfig from '@configs/env.config';
import { UserModel } from '@models/base/user.base';
import { genAccessToken } from '@utils/generate';
import { TokenModel } from '@models/base/token.base';
const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];
    jwt.verify(token, envConfig.ACCESS_SECRET_TOKEN, async (error, decoded) => {
        if (error && error.name !== 'TokenExpiredError') return res.sendStatus(403);
        if (error && error.name === 'TokenExpiredError') {
            const cookies = req?.cookies;
            if (!cookies.jwt) return res.sendStatus(403);
            const token = await TokenModel.findOne({
                token: cookies.jwt,
            });
            if (!token) return res.sendStatus(403);
            const user = await UserModel.findById(token.userId);
            if (!user) return res.sendStatus(403);
            res.locals.accessToken = genAccessToken({
                _id: user._id,
                email: user.email,
                name: user.name,
            });
        }
        // handle refresh token
        next();
    });
};

export default verifyJWT;
