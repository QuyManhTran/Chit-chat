import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import * as database from '@configs/mongo.config';
import envConfig from '@configs/env.config';
import { route } from '@routes/index';
dotenv.config();

const app: Express = express();
app.use(
    cors({
        origin: 'http://localhost:4200',
        credentials: true,
        methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE'],
    })
);
app.use(bodyParser.json());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(morgan('common'));
app.use(cookieParser());
route(app);
app.get('/', (req: Request, res: Response) => {
    res.status(200).json('Hello everyone, this is chit chat app');
});
const port: number | string = envConfig.PORT || 3000;

app.listen(port, async () => {
    await database.mongoConnect();
    console.log('[database]: Database connect successfully!');
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
