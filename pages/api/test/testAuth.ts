import type { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from "@/utils/withAuth";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    // Your API route logic here
    res.status(200).json({ data: "This is a protected route." });
};

export default withAuth(handler);