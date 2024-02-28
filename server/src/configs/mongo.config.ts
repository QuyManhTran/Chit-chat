import mongoose from 'mongoose';
import envConfig from '@configs/env.config';
const MG_HOST = envConfig.MG_HOST;
const MG_DB = envConfig.MG_DB;

mongoose.set('strictQuery', true);
const uri = `${MG_HOST}/${MG_DB}`;
export const mongoConnect = async () => {
    try {
        await mongoose.connect(uri);
    } catch (error) {
        console.log(error);
    }
};
