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

    interface Request {
        user: User;
    }
}
