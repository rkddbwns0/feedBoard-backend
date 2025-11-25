import { NextFunction, Request, Response } from 'express';
import passport from 'passport';

export const jwtAuthorize = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', { session: false }, (err: any, user: any, info: any) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.json({ message: info.message });
        }

        req.user = user;
        next();
    })(req, res, next);
};
