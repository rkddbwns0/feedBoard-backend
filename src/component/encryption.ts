import bcrypt from 'bcrypt';

export const encryptPassword = (password: string) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
};

export const comparePassword = (password: string, hash: string) => {
    const result = bcrypt.compareSync(password, hash);
    if (!result) {
        throw new Error('비밀번호가 일치하지 않습니다.');
    }
    return result;
};
