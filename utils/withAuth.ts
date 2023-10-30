import { getServerAuthSession } from "@/server/auth";
import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { getServerSession } from "next-auth";
// import authOptions from "../pages/api/auth/[...nextauth]";

export const withAuth = (handler: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        // console.log('look here', req)
        // console.log(res)
        const session = await getServerAuthSession({ req, res }); // await getServerSession(req, res, authOptions);
        console.log('Session:', session);

        if (!session) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        return handler(req, res);
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
