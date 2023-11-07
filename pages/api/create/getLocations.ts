import type { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from "@/utils/withAuth";
import { connectToDb } from '@/services/database/database';
import { Locations } from '@/services/database/models/Locations';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log('api/create/getLocations API Route Triggered');

    connectToDb();
    let locations = await Locations.getDefaultLocations();

    res.status(200).json({ locations });
};

export default withAuth(handler);