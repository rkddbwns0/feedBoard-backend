import passport from 'passport';
import dotenv from 'dotenv';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { pgQuery } from '../database/dbConnection';

dotenv.config();

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET!,
};

export default () => {
    passport.use(
        'jwt',
        new JwtStrategy(options, async (payload: any, done: any) => {
            try {
                const findUser = await pgQuery(
                    'SELECT user_id, email, nickname, profile_image FROM users WHERE user_id = $1',
                    [payload.user_id]
                );
                const user = findUser?.rows[0];
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: '존재하지 않는 사용자입니다.' });
                }
            } catch (e) {
                done(e, false, { message: '인증 오류 발생' });
            }
        })
    );
};
