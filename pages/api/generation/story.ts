import type { NextApiRequest, NextApiResponse } from 'next';
import { initializeBookCreation } from '@/services/generation/bookCreation';
import { withAuth } from "@/utils/withAuth";
import { Users } from '@/services/database/models/Users';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log('api/generation/story API Route Triggered');

    const { locationGUID, characterGUID, themeGUID } = req.body;

    const user = await Users.getUserBySession(req, res);
    const guid = await initializeBookCreation(locationGUID, characterGUID, themeGUID, user.id!);

    res.status(200).json({ bookGuid: guid });
};

export default withAuth(handler);