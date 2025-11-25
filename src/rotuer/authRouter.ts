import express, { Request, Response } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { jwtAuthorize } from '../component/jwt-authorize';

const router = express();

router.post('/login', (req: Request, res: Response, next: any) => {
    passport.authenticate('local', (err: any, user: any, info: any) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: err instanceof Error ? err.message : '알 수 없는 오류' });
        }

        if (!user) {
            return res.status(401).json({ message: info.message });
        }

        return req.login(user, { session: false }, (err) => {
            if (err) {
                console.error(err);
                return next(err);
            }

            const payload = {
                user_id: user.user_id,
                email: user.email,
                nickname: user.nickname,
                profile_image: user.profile_image,
            };

            const accessToken = jwt.sign(payload, process.env.JWT_SECRET || '', { expiresIn: '1h' });

            const refreshToken = jwt.sign(payload, process.env.JWT_SECRET || '', { expiresIn: '7d' });

            return res.status(200).json({ accessToken, refreshToken });
        });
    })(req, res, next);
});

router.get('/me', jwtAuthorize, (req: Request, res: Response) => {
    res.status(200).json({ user: req.user });
});

router.post('/logout', (req: Request, res: Response) => {
    if (!req.user) return res.sendStatus(401);

    res.status(200).json({ message: '로그아웃 되었습니다.' });
});

export default router;
