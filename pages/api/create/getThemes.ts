import type { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from "@/utils/withAuth";
import { connectToDb } from '@/services/database/database';
import { Locations } from '@/services/database/models/Locations';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log('api/create/getThemes API Route Triggered');

    connectToDb();
    let themes = await Locations.getDefaultLocations();

    res.status(200).json({ themes });
};

export default withAuth(handler);