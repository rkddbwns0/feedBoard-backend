import passport from 'passport';
import { Strategy } from 'passport-local';
import { pgQuery } from '../database/dbConnection';
import { comparePassword } from '../component/encryption';

declare global {
    namespace Express {
        interface User {
            user_id: number;
            email: string;
            password?: string;
            nickname: string;
            profile_image: string;
        }
    }
}

interface User {
    user_id: number;
    email: string;
    password: string;
    nickname: string;
    profile_image: string;
}

passport.serializeUser((user, done) => {
    console.log('In serializeUser');
    console.log(user);
    done(null, user.user_id);
});

passport.deserializeUser(async (user_id, done) => {
    console.log('In deserializeUser');
    try {
        const findUser = await pgQuery<User>(
            'SELECT user_id, email, nickname, profile_image FROM users WHERE user_id = $1',
            [user_id]
        );
        const user = findUser?.rows[0];

        if (!user) throw new Error('존재하지 않는 유저입니다.');

        done(null, user);
    } catch (e) {
        done(e, null);
    }
});

export default passport.use(
    new Strategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            const result = await pgQuery<User>('SELECT * FROM users WHERE email = $1', [username]);
            const user = result?.rows[0];

            if (!user) throw new Error('존재하지 않는 사용자입니다.');

            const isPasswordValid = comparePassword(password, user.password);

            if (!isPasswordValid) throw new Error('비밀번호가 일치하지 않습니다.');
            done(null, user);
        } catch (e) {
            done(e, false);
        }
    })
);
