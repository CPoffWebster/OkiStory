import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDb } from '@/services/database/database';
import { Locations } from '@/services/database/models/Locations';
import { withBaseURL } from '@/utils/withBaseURL';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.info('api/create/getLocation API Route Triggered');

    const { guid } = req.body;

    try {
        connectToDb();
        let location = await Locations.getLocation(guid);

        res.status(200).json({ location });
    } catch (err: any) {
        console.error('Error in api/create/getLocation', err.toString())
        res.status(500).json({ err });
    }
};

export default withBaseURL(handler);