import type { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from "@/utils/withAuth";
import { connectToDb } from '@/services/database/database';
import { Locations } from '@/services/database/models/Locations';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.info('api/create/getLocations API Route Triggered');

    try {
        connectToDb();
        let locations = await Locations.getDefaultLocations();

        res.status(200).json({ locations });
    } catch (err) {
        console.error(`Error in api/create/getLocations: ${JSON.stringify(err)}`);
        res.status(500).json({ err });
    }
};

export default withAuth(handler);