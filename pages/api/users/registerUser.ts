import { saveUser } from '@/services/users';
import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Register a new user
 * @param req 
 * @param res 
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { email, password } = req.body;
    console.log("Register User: Email", email);

    try {
        await saveUser(email, password);
        res.status(200).json({ email, password });
    } catch (error) {
        res.status(500).json({ error: error });
    }
}