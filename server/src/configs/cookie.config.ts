import { CookieOptions } from 'express';

export const cookieSecureOption: CookieOptions = {
    httpOnly: true,
    secure: true,
};

export function withAge(age: number | undefined): CookieOptions {
    return {
        ...cookieSecureOption,
        maxAge: age,
    };
}

export enum TTL {
    ONE_DAY = 86400 * 1000,
    ONE_HOUR = 3600 * 1000,
}
