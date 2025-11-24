import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import passport from 'passport';
import userRouter from './rotuer/userRouter';
import postRouter from './rotuer/postRouter';
import commentRouter from './rotuer/commentRouter';
import authRouter from './rotuer/authRouter';
import newsAPIRouter from './rotuer/newsAPIRouter';
import './passport/local-strategy';
import session from 'express-session';

const app = express();
dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    session({
        secret: process.env.SESSION_SECRET || 'secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000,
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());

const server = http.createServer(app);
const PORT = process.env.PORT;

server.listen(PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

app.use('/user', userRouter);
app.use('/post', postRouter);
app.use('/comment', commentRouter);
app.use('/auth', authRouter);
app.use('/news', newsAPIRouter);
