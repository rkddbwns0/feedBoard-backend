import multer from 'multer';
import path from 'path';

export const storage = multer({
    storage: multer.diskStorage({
        destination: (req, file, done) => {
            console.log(file);
            done(null, path.join(__dirname, '../uploads'));
        },

        filename: (req, file, done) => {
            const basename = path.basename(file.originalname, path.extname(file.originalname));
            done(null, basename + '_' + Date.now() + '.webp');
        },
    }),

    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter: (req, file, done) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            done(null, true);
        } else {
            done(new Error('확장자가 잘못되었습니다'));
        }
    },
});
