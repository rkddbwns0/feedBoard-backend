import passport from 'passport';
import { Strategy } from 'passport-local';
import { pgQuery } from '../database/dbConnection';
import { comparePassword } from '../component/encryption';

passport.serializeUser((user: any, done) => {
    console.log('In serializeUser');
    console.log(user);
    done(null, user.user_id);
});

passport.deserializeUser(async (user_id, done) => {
    console.log('In deserializeUser');
    try {
        const findUser = await pgQuery<Express.User>(
            'SELECT user_id, email, nickname, profile_image FROM users WHERE user_id = $1',
            [user_id]
        );
        const user = findUser?.rows[0];

        if (!user) return done(null, false);

        return done(null, user);
    } catch (e) {
        return done(e, false);
    }
});

export default passport.use(
    new Strategy({ usernameField: 'email' }, async (username, password, done) => {
        console.log('In local strategy');
        try {
            const result = await pgQuery<{ password: string }>('SELECT * FROM users WHERE email = $1', [username]);
            const user = result?.rows[0];

            if (!user) return done(null, false, { message: '존재하지 않는 사용자입니다.' });

            const isPasswordValid = comparePassword(password, user?.password!);

            if (!isPasswordValid) return done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
            return done(null, user);
        } catch (e) {
            return done(e, false);
        }
    })
);
