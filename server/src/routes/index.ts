import { Express } from 'express';
import v1Router from './v1';
export const route = (app: Express): void => {
    app.use('/v1', v1Router);
};
