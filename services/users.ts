
import { connectToDb } from './database/database';
import bcrypt from 'bcrypt';
import { UsersAttributes } from './database/models/Users';
import { Profile } from 'next-auth';
import { CredentialInput } from 'next-auth/providers/credentials';

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

        if (!user.Password) {
            console.log(`Email: "${email}" has no password.`)
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

    db.tables.Users.update({ LastLogin: new Date() }, { where: { Email: email } });
    return true;
}

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
 * Verifies if the user exists in the database. If not, creates a new account.
 * @param profile provider profile
 * @returns 
 */
export async function verifyUserProvider(profile: Profile | any) {
    const { iss, sub, email, email_verified, name, locale } = profile;
    const db = connectToDb();
    const user = await db.tables.Users.findOne({ where: { Email: email } }) as unknown as UsersAttributes;

    if (user !== null) {
        if (user.Password === null && user.Provider === iss) {
            console.log(`Email: "${email}" found under provider: "${iss}".`);
            await db.tables.Users.update({ LastLogin: new Date() }, { where: { Email: email } });
            return true;
        } else {
            throw new Error(`Email: "${email}" found under provider: "${iss}".`);
        }
    }

    if (user === null) {
        console.log(`Email: "${email}" not found under provider: "${iss}". Creating new account.`);
        await db.tables.Users.create({
            Email: email,
            Provider: iss,
            ProviderAccountId: sub,
            UserName: name,
            VerifiedEmail: email_verified,
            Language: locale,
        });
        return true;
    }
}