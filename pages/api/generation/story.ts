import type { NextApiRequest, NextApiResponse } from 'next';
import { initializeBookCreation } from '@/services/generation/bookCreation';
import { withAuth } from "@/utils/withAuth";
import { Users } from '@/services/database/models/Users';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    const { locationGUID, characterGUID, themeGUID } = req.body;
    console.info(`api/generation/story API Route Triggered; locationGUID: ${locationGUID}, characterGUID: ${characterGUID}, themeGUID: ${themeGUID}`);

    try {
        const user = await Users.getUserBySession(req, res);
        if (!user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const guid = await initializeBookCreation(locationGUID, characterGUID, themeGUID, user.id!);

        res.status(200).json({ bookGuid: guid });
    } catch (err) {
        console.error(`Error in api/generation/story; locationGUID: ${locationGUID}, characterGUID: ${characterGUID}, themeGUID: ${themeGUID}, error: ${JSON.stringify(err)}`);
        res.status(500).json({ err });
    }

};

export default withAuth(handler);