import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { getSession } from "next-auth/react";
import { decode } from 'jsonwebtoken';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";
import { getToken } from "next-auth/jwt";

export const withAuth = (handler: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        // const token = req.cookies['next-auth.session-token'];
        // if (token) {
        //     // const decoded = decode(token, { complete: true });
        //     // console.log('Decoded JWT:', decoded);
        //     const decoded = decode(token);
        //     console.log('Manual Decode:', decoded);
        // }
        // const session = await getSession({ req });
        // const session = await getServerSession(req, res, authOptions)

        // if (!session) {
        //     return res.status(401).json({ message: 'Unauthorized' });
        // }

        // const data = await getServerSession(req, res, authOptions);

        // console.log(data);


        return handler(req, res);
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};