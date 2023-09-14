import { checkUserExists } from '@/services/users';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const user = await checkUserExists(req.body.email);
    if (user)
        return res.status(200).json(true);
    else
        return res.status(200).json(false);
}