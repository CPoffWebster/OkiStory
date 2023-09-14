import { saveUser } from '@/services/users';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const user = await saveUser(req.body.email, req.body.password);
    res.status(200).json({ message: 'User successfully registered' });
}