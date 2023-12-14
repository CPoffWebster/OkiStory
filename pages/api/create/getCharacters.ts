import type { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from "@/utils/withAuth";
import { connectToDb } from '@/services/database/database';
import { Characters } from '@/services/database/models/Characters';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.info('api/create/getCharacters API Route Triggered');

    try {
        connectToDb();
        let characters = await Characters.getDefaultCharacters();

        res.status(200).json({ characters });
    } catch (err) {
        console.error(`Error in api/create/getCharacters: ${JSON.stringify(err)}`);
        res.status(500).json({ err });
    }
};

export default withAuth(handler);