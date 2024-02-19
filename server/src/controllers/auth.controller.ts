import { IFireBase, ILoginByPassword, IRegisterByPassword } from '@interfaces/auth.interface';
import { UserModel } from '@models/base/user.base';
import { IUserPayload, genAccessToken, genRefreshToken } from '@utils/generate';
import { TTL, withAge } from '@configs/cookie.config';
import validator from 'validator';
import { genHashPassword } from '@configs/password.config';
import { Request, Response } from '@customes/auth.type';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import envConfig from '@configs/env.config';
import { TokenModel } from '@models/base/token.base';
export default class AuthController {
    /**
     *
     * @param req request
     * @param res response
     * @returns response when login
     */
    static login = async (req: Request, res: Response) => {
        const data = <ILoginByPassword>req.body;
        try {
            const user = await UserModel.findOne({ email: data.email });
            if (!user) return res.status(400).json({ message: 'Invalid email or password...' });
            const isValidPassword: boolean = await bcrypt.compare(data.password, user.password);
            if (!isValidPassword)
                return res.status(400).json({ message: 'Invalid email or password...' });
            const payload: IUserPayload = {
                _id: user._id,
                email: user.email,
                name: user.name,
            };
            const accessToken: string = genAccessToken(payload);
            const refreshToken: string = genRefreshToken(payload);
            await this.newRefreshToken(res, refreshToken, payload);
            res.cookie('jwt', refreshToken, withAge(TTL.ONE_DAY)).status(200).json({
                data: payload,
                accessToken: accessToken,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Something went wrong!' });
        }
    };

    /**
     *
     * @param req Request
     * @param res Response
     * @returns response when register
     */

    static register = async (req: Request, res: Response) => {
        const data = <IRegisterByPassword>req.body;
        try {
            if (!data.name || !data.email || !data.password)
                return res.status(400).json({ message: 'All fields are required...' });
            if (!validator.isEmail(data.email))
                return res.status(400).json({ message: `Email isn't not valid` });
            let user = await UserModel.findOne({ email: data.email });
            if (user) return res.status(400).json({ message: 'Account already exists' });
            const hashedPass = await genHashPassword(data.password);
            user = await UserModel.create({
                email: data.email,
                name: data.name,
                password: hashedPass,
            });
            const payload: IUserPayload = {
                _id: user._id,
                email: user.email,
                name: user.name,
            };
            const accessToken = genAccessToken(payload);
            const refreshToken = genRefreshToken(payload);
            await this.newRefreshToken(res, refreshToken, payload);
            res.cookie('jwt', refreshToken, withAge(TTL.ONE_DAY)).status(200).json({
                data: payload,
                accessToken: accessToken,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Something went wrong!' });
        }
    };

    /**
     *
     * @param req Request
     * @param res Response
     * @returns user infor or error
     */

    static firebase = async (req: Request, res: Response) => {
        const data = <IFireBase>req.body;
        try {
            if (!data.name || !data.email || !data.password)
                return res.status(400).json({ message: 'All fields are required...' });
            if (!validator.isEmail(data.email))
                return res.status(400).json({ message: `Email isn't not valid` });
            let user = await UserModel.findOne({ email: data.email });
            if (!user) {
                const hashedPass = await genHashPassword(data.password);
                user = await UserModel.create({
                    email: data.email,
                    name: data.name,
                    password: hashedPass,
                });
                const payload: IUserPayload = {
                    _id: user._id,
                    email: user.email,
                    name: user.name,
                };
                const accessToken = genAccessToken(payload);
                const refreshToken = genRefreshToken(payload);
                await this.newRefreshToken(res, refreshToken, payload);
                return res.cookie('jwt', refreshToken, withAge(TTL.ONE_DAY)).status(200).json({
                    data: payload,
                    accessToken: accessToken,
                });
            }
            const isValidPassword: boolean = await bcrypt.compare(data.password, user.password);
            if (!isValidPassword)
                return res.status(400).json({ message: 'Invalid email or password...' });

            const payload: IUserPayload = {
                _id: user._id,
                email: user.email,
                name: user.name,
            };
            const accessToken = genAccessToken(payload);
            const refreshToken = genRefreshToken(payload);
            await this.newRefreshToken(res, refreshToken, payload);
            res.cookie('jwt', refreshToken, withAge(TTL.ONE_DAY)).status(200).json({
                data: payload,
                accessToken: accessToken,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Something went wrong!' });
        }
    };

    static loginByRefreshToken = async (req: Request, res: Response) => {
        const cookies = req.cookies;
        if (!cookies?.jwt) return res.sendStatus(401);
        const refreshToken = cookies.jwt as string;
        jwt.verify(refreshToken, envConfig.REFRESH_SECRET_TOKEN, async (error, decoded) => {
            if (error && error.name !== 'TokenExpiredError') return res.sendStatus(403);
            if (error && error.name === 'TokenExpiredError') {
                await TokenModel.findOneAndDelete({ token: refreshToken });
                return res.sendStatus(401);
            }
            console.log('decoded', decoded);
            try {
                const token = await TokenModel.findOne({
                    token: refreshToken,
                });
                if (!token) return res.sendStatus(403);
                const user = await UserModel.findById(token.userId);
                if (!user) return res.sendStatus(403);
                const payload: IUserPayload = {
                    _id: user._id,
                    email: user.email,
                    name: user.name,
                };
                const accessToken: string = genAccessToken(payload);
                res.status(200).json({ data: payload, accessToken: accessToken });
            } catch (error) {
                res.status(500).json({ message: 'Something went wrong !' });
            }
        });
    };

    static newRefreshToken = async (res: Response, token: string, user: IUserPayload) => {
        await TokenModel.findOneAndDelete({ userId: user._id });
        await TokenModel.create({ userId: user._id, token: token });
    };
}
