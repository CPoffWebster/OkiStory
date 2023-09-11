import { connectToDb } from './database/database';
import bcrypt from 'bcrypt';

/**
 * Insert a user into the database
 * @param user 
 * @param pwd 
 */
export async function saveUser(user: string, pwd: string) {
    const db = connectToDb();
    const saltRounds = 11;
    const hash = bcrypt.hashSync(pwd, saltRounds);

    await db.tables.Users.create({ Email: user, Password: hash });
    console.log("User inserted: " + user);
}