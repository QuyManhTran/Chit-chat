import { v2 as _cloudinary } from 'cloudinary';
import envConfig from './env.config';

const cloudinary = _cloudinary;
cloudinary.config({
    cloud_name: envConfig.CLOUDINARY_NAME,
    api_key: envConfig.CLOUDINARY_KEY,
    api_secret: envConfig.CLOUDINARY_SECRET,
});

export default cloudinary;
