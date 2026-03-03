import bcrypt from 'bcryptjs';

export async function hashPassword(password: string) {
    try {
        const saltRounds = 10;
        const hashedPassword = bcrypt.hash(password , saltRounds);
        return hashedPassword;
    }
    catch (error) {
        throw new Error("Error Hashing Password !!!");
    };
};

export async function comparePasswords({ password , hashedPassword }: { password: string ; hashedPassword: string}) {
    try {
        const isMatch = await bcrypt.compare(password , hashedPassword);
        return isMatch;
    } 
    catch (error) {
        throw new Error("Error Comparing Passwords !!!");
    }
};