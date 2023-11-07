import type { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from "@/utils/withAuth";
import { connectToDb } from '@/services/database/database';
import { Locations } from '@/services/database/models/Locations';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log('api/create/getLocation API Route Triggered');

    const { guid } = req.body;

    connectToDb();
    let location = await Locations.getLocation(guid);

    res.status(200).json({ location });
};

export default withAuth(handler);