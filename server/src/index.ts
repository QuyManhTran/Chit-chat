import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
dotenv.config();

const app: Express = express();
app.use(
    cors({
        origin: process.env.FRONTEND,
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
app.use(cookieParser());
const port: number | string = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Chit chat server');
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
