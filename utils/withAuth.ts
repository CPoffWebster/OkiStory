import { getServerAuthSession } from "@/pages/api/auth/[...nextauth]";
import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";

export const withAuth = (handler: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const session = await getServerAuthSession(req, res);

        if (!session) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        return handler(req, res);
    } catch (error: any) {
        console.error('Authentication error:', error.toString());
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
