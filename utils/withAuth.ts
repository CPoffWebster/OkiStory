// utils/withAuth.ts

import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { getSession } from "next-auth/react";

export const withAuth =
    (handler: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
        const session = await getSession({ req });
        if (!session) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        return handler(req, res);
    };
