import * as jwt from 'jsonwebtoken';

export const JWTTokenOpt: jwt.SignOptions = {
    expiresIn: '30s',
};

export const JWTRefreshOpt: jwt.SignOptions = {
    expiresIn: '86400s',
};
