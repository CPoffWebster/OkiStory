import { NextApiResponse } from 'next';
import { serialize, CookieSerializeOptions } from 'cookie';
import { connectToDb } from './database/database';
import { UsersAttributes } from './database/models/Users';
import Cookies from 'universal-cookie';
import { IncomingMessage } from "http";
import { NextApiRequest } from "next";
import { NextApiRequestCookies } from "next/dist/server/api-utils";
var jwt = require('jsonwebtoken');

export const setCookie = (
    res: NextApiResponse,
    name: string,
    value: unknown,
    options: CookieSerializeOptions = {}
) => {
    const stringValue = typeof value === 'object' ? 'j:' + JSON.stringify(value) : String(value);

    if ('maxAge' in options && options.maxAge) {
        options.expires = new Date(Date.now() + options.maxAge);
        options.maxAge /= 1000;
    }

    res.setHeader('Set-Cookie', serialize(name, String(stringValue), options));
};

/**
 * A request that has cookies attached to it
 */
export type CookiefulRequest =
    (NextApiRequest | (IncomingMessage & {
        cookies: NextApiRequestCookies;
    }))

/**
 * Gets the header string from the request
 * @param req 
 * @param key 
 * @returns 
 */
export function getHeaderString(req: CookiefulRequest, key: string) {
    const value = req.headers[key];
    if (!value) { return ''; }
    if (typeof value === 'string') { return value; }
    return value.join('');
}

/**
 * Checks if the user has a valid cookie
 * @param req 
 * @returns 
 */
export async function checkCookies(req: CookiefulRequest): Promise<UsersAttributes | null> {
    const cookieObject = req.cookies;
    const access_token = getHeaderString(req, 'access_token');
    const cookies = new Cookies(cookieObject);
    const value = cookies.get('access_token');

    const tokenValue = value || access_token;
    const db = connectToDb();
    try {
        console.log(`tokenValue`, tokenValue)
        console.log(`process.env.JWT_SECRET`, process.env.JWT_SECRET)
        const tokenObject = jwt.verify(tokenValue, process.env.JWT_SECRET);
        console.log(`tokenObject`, tokenObject)
        const user = await db.tables.Users.findOne({ where: { Email: tokenObject.email } }) as unknown as UsersAttributes;
        console.log(`user`, user)
        if (!user) { return null }
        return user;
    } catch (err) {
        console.log('Error in verifyToken: ', tokenValue, err);
        const decoded = jwt.decode(tokenValue);
        if (decoded) {
            console.log(`tokenDecoded`, decoded);
        }
        return null;
    }
}