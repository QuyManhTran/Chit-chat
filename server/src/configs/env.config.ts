import { DotenvParseOutput, config } from 'dotenv';
import path from 'path';

export interface ENV_VAL extends DotenvParseOutput {
    FRONTEND: string;
    PORT: string;
    MG_HOST: string;
    MG_DB: string;
    ACCESS_SECRET_TOKEN: string;
    REFRESH_SECRET_TOKEN: string;
}

const data = config({
    path: path.resolve(process.cwd(), '.env'),
}).parsed;

const envConfig = {
    ...data,
} as ENV_VAL;
export default envConfig;
