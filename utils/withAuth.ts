// utils/withAuth.ts

import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { getSession } from "next-auth/react";

export const withAuth =
    (handler: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
        // console.log('THIS IS A MUST TODO - withAuth.ts 1');
        // const session = await getSession({ req });
        // console.log('THIS IS A MUST TODO - withAuth.ts 2');
        // if (!session) {
        //     res.status(401).json({ error: "Unauthorized" });
        //     return;
        // }
        return handler(req, res);
    };
