import envConfig from '@configs/env.config';
import { sign } from 'jsonwebtoken';
import * as JWTOpt from '@configs/jwt.config';
export interface IUserPayload {
    _id: string;
    email: string;
    name: string;
}

export const genAccessToken = (payload: IUserPayload): string => {
    const accessToken = sign(payload, envConfig.ACCESS_SECRET_TOKEN, JWTOpt.JWTTokenOpt);
    return accessToken;
};

export const genRefreshToken = (payload: IUserPayload): string => {
    const refreshToken = sign(payload, envConfig.REFRESH_SECRET_TOKEN, JWTOpt.JWTRefreshOpt);
    return refreshToken;
};
