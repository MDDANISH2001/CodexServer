import bcrypt from 'bcrypt';

export const hashing = {
    SALT: 10,
    passwordHash(plainPwd: string){
        return bcrypt.hashSync(plainPwd, this.SALT);
    },
    matchPassword(plainPwd: string, dbPwd: string){
        return bcrypt.compareSync(plainPwd, dbPwd)
    }
}