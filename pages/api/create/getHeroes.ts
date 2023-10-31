import type { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from "@/utils/withAuth";
import { connectToDb } from '@/services/database/database';
import { Characters } from '@/services/database/models/Characters';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log('api/create/getHeroes API Route Triggered');

    connectToDb();
    let heroes = await Characters.getDefaultCharacters();

    res.status(200).json({ heroes });
};

export default withAuth(handler);