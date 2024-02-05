import { ILocalData, IResponseData } from '@interfaces/auth.interface';
import { Response as _Response, Request as _Request, NextFunction as _NextFunction } from 'express';

export type Response = _Response<IResponseData, ILocalData>;
export type Request = _Request;
export type NextFunction = _NextFunction;
