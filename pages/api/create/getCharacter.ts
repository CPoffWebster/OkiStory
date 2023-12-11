import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDb } from '@/services/database/database';
import { Characters } from '@/services/database/models/Characters';
import { withBaseURL } from '@/utils/withBaseURL';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log('api/create/getCharacters API Route Triggered');

    const { guid } = req.body;

    try {
        connectToDb();
        let character = await Characters.getCharacter(guid);

        res.status(200).json({ character });
    } catch (err) {
        console.error('Error in api/create/getCharacter', err);
        res.status(500).json({ err });
    }
};

export default withBaseURL(handler);