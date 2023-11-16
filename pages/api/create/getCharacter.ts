import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDb } from '@/services/database/database';
import { Characters } from '@/services/database/models/Characters';
import { withBaseURL } from '@/utils/withBaseURL';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log('api/create/getCharacters API Route Triggered');

    const { guid } = req.body;

    connectToDb();
    let character = await Characters.getCharacter(guid);

    res.status(200).json({ character });
};

export default withBaseURL(handler);