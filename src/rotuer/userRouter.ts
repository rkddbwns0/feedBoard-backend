import express, { Request, Response } from 'express';
import { encryptPassword } from '../component/encryption';
import { pgQuery } from '../database/dbConnection';
import { storage } from '../component/upload';
import fs from 'fs';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('userRouter');
});

router.post('/', storage.single('profile_image'), async (req: Request, res: Response) => {
    try {
        const { email, password, nickname } = req.body;

        const findUser = await pgQuery('SELECT * FROM users WHERE email = $1', [email]);

        const user = findUser?.rows[0];

        if (user) {
            if (req.file) {
                fs.unlinkSync(req.file?.path);
            }
            return res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
        }

        if (!req.file) {
            return res.status(400).json({ message: '이미지를 업로드 해 주세요.' });
        }

        const imagePath = req.file?.path;

        const created_timestamp = new Date();
        const encryptedPassword = encryptPassword(password);
        const values = [email, encryptedPassword, nickname, imagePath, created_timestamp];

        const result = await pgQuery(
            'INSERT INTO public.users (email, password, nickname, profile_image, created_timestamp) VALUES ($1, $2, $3, $4, $5)',
            values
        );

        res.status(200).json({ message: '회원가입이 완료되었습니다.' });
    } catch (e) {
        if (req.file) {
            fs.unlinkSync(req.file?.path);
            console.error(e);
        }
        res.status(500).json({ message: '회원가입 실패', error: e instanceof Error ? e.message : '알 수 없는 오류' });
    }
});

router.get('/check-email/:email', async (req: Request, res: Response) => {
    try {
        const { email } = req.params;

        const findUser = await pgQuery('SELECT * FROM users WHERE email = $1', [email]);

        const user = findUser?.rows[0];

        if (user) {
            return res.status(409).json({ message: '이미 존재하는 이메일입니다.' });
        }

        return res.status(200).json({ message: '사용 가능한 이메일입니다.' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: '이메일 확인 실패' });
    }
});

router.get('/check-nickname/:nickname', async (req: Request, res: Response) => {
    try {
        const { nickname } = req.params;

        const findUser = await pgQuery('SELECT * FROM users WHERE nickname = $1', [nickname]);

        const user = findUser?.rows[0];

        if (user) {
            return res.status(409).json({ message: '이미 존재하는 닉네임입니다.' });
        }

        return res.status(200).json({ message: '사용 가능한 닉네임입니다.' });
    } catch (e) {
        res.status(500).json({ message: '닉네임 중복 확인 실패' });
    }
});

export default router;
