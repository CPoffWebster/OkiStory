import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { getSession } from "next-auth/react";

export const withAuth = (handler: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const token = req.cookies['next-auth.session-token'];
        if (token) {
            const decoded = decode(token, { complete: true });
            console.log('Decoded JWT:', decoded);
        }
        const session = await getSession({ req });

        if (!session) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        return handler(req, res);
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
