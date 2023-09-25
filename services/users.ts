
import { connectToDb } from './database/database';
import bcrypt from 'bcrypt';
import { UsersAttributes } from './database/models/Users';
var jwt = require('jsonwebtoken');


/**
 * Insert a user into the database
 * @param Email 
 * @param Password 
 */
export async function saveUser(email: string, password: string) {
    const db = connectToDb();
    const saltRounds = 11;
    const hash = bcrypt.hashSync(password, saltRounds);

    await db.tables.Users.create({ Email: email, Password: hash });
    console.log("User inserted: " + email);
}

/**
 * Checks if the user is logged in. If not, returns an error.
 * @param email
 * @param password
 * @returns { access_token } or { error }
 */
export async function checkLoginDB(email: string, password: string): Promise<{ access_token?: string, error?: string }> {
    if (!email || !password) {
        console.log(`Email: "${email}" or Password: "not shown" is invalid.`)
        return { error: 'Please provide a valid username and password' };
    }

    const db = connectToDb();
    let user: UsersAttributes | null;
    try {
        user = await db.tables.Users.findOne({ where: { Email: email } }) as unknown as UsersAttributes;

        if (user === null) {
            console.log(`Email: "${email}" not found.`)
            return { error: 'Please provide a valid username and password' };
        }

        const match = await bcrypt.compare(password, user.Password);
        if (!match) {
            console.log(`Email: "${email}" entered invalid password.`)
            return { error: 'Please provide a valid username and password' };
        }
    } catch (err) {
        console.error(`Error checkLoginDB for ${email}: ${err}`);
        return { error: 'Please provide a valid username & password' };
    }

    db.tables.Users.update({ LastLogin: new Date() }, { where: { Email: email } });
    const access_token = createTokenForUser_Internal(email);

    return { access_token };
}

/** Creates an authentication token good for 7 day */
export function createTokenForUser_Internal(email: string): string {
    return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7 day' });
}

/**
 * Checks if the user exists in the database
 * @param email 
 * @returns 
 */
export async function checkUserExists(email: string): Promise<boolean> {
    const db = connectToDb();
    const user = await db.tables.Users.findOne({ where: { Email: email } });
    return user !== null;
}

/**
 * Checks if the user and password are valid. If not, returns an error.
 * @param email
 * @param password
 * @returns { access_token } or { error }
 */
export async function verifyUserLogin(email: string, password: string): Promise<boolean> {
    if (!email || !password) {
        console.log(`Email: "${email}" or Password: "not shown" is invalid.`)
        return false;
    }

    const db = connectToDb();
    let user: UsersAttributes | null;
    try {
        user = await db.tables.Users.findOne({ where: { Email: email } }) as unknown as UsersAttributes;

        if (user === null) {
            console.log(`Email: "${email}" not found.`)
            return false;
        }

        const match = await bcrypt.compare(password, user.Password);
        if (!match) {
            console.log(`Email: "${email}" entered invalid password.`)
            return false;
        }
    } catch (err) {
        console.error(`Error checkLoginDB for ${email}: ${err}`);
        return false;
    }

    // db.tables.Users.update({ LastLogin: new Date() }, { where: { Email: email } });
    return true;
}