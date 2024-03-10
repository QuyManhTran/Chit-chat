import multer from 'multer';
const storage = multer.diskStorage({
    destination: '../server/src/public/audios', // Change this to your desired upload directory
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
    },
});
export const upload = multer({ storage });
