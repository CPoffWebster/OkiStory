
import { connectToDb } from './database/database';
import bcrypt from 'bcrypt';
import { Users, UsersAttributes } from './database/models/Users';
import { Profile } from 'next-auth';
import { CredentialInput } from 'next-auth/providers/credentials';
import { PaidAccounts } from './database/models/PaidAccounts';

/**
 * Checks if the user and password are valid. If not, returns an error.
 * @param email
 * @param password
 * @returns { access_token } or { error }
 */
export async function verifyUserLogin(email: string, password: string): Promise<boolean> {
    if (!email || !password) {
        console.info(`Email: "${email}" or Password: "not shown" is invalid.`)
        return false;
    }

    connectToDb();
    let user: UsersAttributes | null;
    try {
        const user = await Users.getUserByEmail(email);

        if (user === null) {
            console.info(`Email: "${email}" not found.`)
            return false;
        }

        if (!user.Password) {
            console.info(`Email: "${email}" has no password.`)
            return false;
        }

        const match = await bcrypt.compare(password, user.Password);
        if (!match) {
            console.info(`Email: "${email}" entered invalid password.`)
            return false;
        }

        await Users.updateUser({ ...user, LastLogin: new Date() });
    } catch (err) {
        console.error(`Error checkLoginDB for ${email}; error: ${JSON.stringify(err)}`);
        return false;
    }

    return true;
}

/**
 * Verifies if the user exists in the database. If not, creates a new account.
 * @param profile provider profile
 * @returns 
 */
export async function verifyUserProvider(profile: Profile | any) {
    const { iss, sub, email, email_verified, name, locale } = profile;
    connectToDb();
    const user = await Users.getUserByEmail(email);

    if (user !== null) {
        if (user.Password === null && user.Provider === iss) {
            console.info(`Email: "${email}" found under provider: "${iss}".`);
            await Users.updateUser({ ...user, LastLogin: new Date() });
            return user;
        } else {
            throw new Error(`Email: "${email}" found under provider: "${iss}".`);
        }
    }

    if (user === null) {
        console.info(`Email: "${email}" not found under provider: "${iss}". Creating new account.`);
        const newUser: UsersAttributes = {
            Email: email,
            Provider: iss,
            ProviderAccountId: sub,
            UserName: name,
            VerifiedEmail: email_verified,
            Language: locale,
        }
        const createdUser = await Users.createUser(newUser);
        await PaidAccounts.createPaidAccount({ UserID: createdUser.id!, SubscriptionType: 'EarlyUser', AmountOfGenerations: 0 });
        return newUser;
    }
}