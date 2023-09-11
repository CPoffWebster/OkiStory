// import * as bcrypt from 'bcrypt';
import { connectToDb } from './database/database';


export async function saveUser(user: string, pwd: string, admin: boolean = false) {
    const db = connectToDb();
    // const saltRounds = 10;
    // const hash = bcrypt.hashSync(pwd, saltRounds);
    const hash = pwd;

    await db.tables.Users.create({ Email: user, Password: hash });
    console.log("inserted " + user);
}