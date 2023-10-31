import type { NextApiRequest, NextApiResponse } from 'next';
import { initializeBookCreation } from '@/services/generation/bookCreation';
import { withAuth } from "@/utils/withAuth";
import { getServerAuthSession } from '../auth/[...nextauth]';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log('api/generation/story API Route Triggered');

    const { locationGUID, characterGUID, themeGUID } = req.body;

    const session = await getServerAuthSession(req, res);
    const guid = await initializeBookCreation(locationGUID, characterGUID, themeGUID, session!.user.email!);

    res.status(200).json({ bookGuid: guid });
};

export default withAuth(handler);