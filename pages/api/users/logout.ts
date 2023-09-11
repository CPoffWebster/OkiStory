import { setCookie } from '@/services/cookies';
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    setCookie(res, 'access_token', '', { path: '/' });
    // setCookie(res, 'access_token', '', { path: '/api', expires: new Date(1970, 1, 1) });
    return res.json({ logout: true });
}