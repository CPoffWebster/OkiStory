import type { NextApiRequest, NextApiResponse } from 'next';
import { initializeBookCreation } from '@/services/generation/bookCreation';
import { withAuth } from "@/utils/withAuth";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log('api/generation/story API Route Triggered');

    const { locationID, characterID, themeID, userID } = req.body;
    const guid = initializeBookCreation(locationID, characterID, themeID, userID);

    res.status(200).json({ bookGuid: guid });
};

export default withAuth(handler);