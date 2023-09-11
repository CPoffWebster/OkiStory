import { saveUser } from '@/services/users';
import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Register a new user
 * @param req 
 * @param res 
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { email, password } = req.body;
    console.log("email", email, "password", password)
    // console.log('TEST!!')

    try {
        await saveUser(email, password, false);

        res.status(200).json({ email, password });

    } catch (error) {
        res.status(500).json({ error: error });
    }
}