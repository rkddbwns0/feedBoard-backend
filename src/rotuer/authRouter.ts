import express, { Request, Response } from 'express';
import passport from 'passport';

const router = express();

router.post('/', passport.authenticate('local'), (req: Request, res: Response) => {
    res.send(200);
});

router.get('/status', (req: Request, res: Response) => {
    console.log('In side /auth/status endpoint');
    console.log(req.session);
    console.log(req.user);

    return req.user ? res.send(req.user) : res.sendStatus(401);
});

router.post('/logout', (req: Request, res: Response) => {
    if (!req.user) return res.sendStatus(401);

    req.logout((err) => {
        if (err) return res.sendStatus(400);
        res.send(200);
    });
});

export default router;
