import bcrypt from 'bcrypt';
const saltRounds: number = 10;

export const genHashPassword = async (password: string): Promise<string> => {
    const salt: string = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(password, salt);
};
