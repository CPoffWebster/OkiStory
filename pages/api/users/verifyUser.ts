import { checkCookies } from '@/services/cookies';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const user = await checkCookies(req);
    if (user)
        return res.status(200).json({ Email: user.Email });
    else
        return res.status(401).json({ error: 'Not logged in' });

    // if (!hasAccess) {
    //     console.log({ hasAccess })
    //     // return redirect('/login');
    // }

    // return await getOrderInfo();
}