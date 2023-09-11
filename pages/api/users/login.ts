import { setCookie } from '@/services/cookies';
import { checkLoginDB } from '@/services/users';
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let { email, password } = req.body;
    const result = await checkLoginDB(email, password);

    if (result.error) {
        res.status(400).json({ error: result.error });
        return;
    }

    setCookie(res, 'access_token', result.access_token, { path: '/' });
    // setCookie(res, 'access_token', '', { path: '/api', expires: new Date(1970, 1, 1) });
    return res.json({ access_token: result.access_token });
}