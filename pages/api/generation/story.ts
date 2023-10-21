import type { NextApiRequest, NextApiResponse } from 'next';
import { initializeBookCreation } from '@/services/generation/bookCreation';
import { withAuth } from "@/utils/withAuth";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log('api/generation/story API Route Triggered');

    const { locationGUID, characterGUID, themeGUID, userEmail } = req.body;
    const guid = await initializeBookCreation(locationGUID, characterGUID, themeGUID, userEmail);

    res.status(200).json({ bookGuid: guid });
};

export default withAuth(handler);