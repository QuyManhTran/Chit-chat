import { IToken, TokenSchema } from '@models/schemas/token.schema';
import { model } from 'mongoose';

export const TokenModel = model<IToken>('Token', TokenSchema);
