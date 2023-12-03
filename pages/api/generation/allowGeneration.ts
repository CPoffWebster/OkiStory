import type { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from "@/utils/withAuth";
import { Users } from '@/services/database/models/Users';
import { Books } from '@/services/database/models/Books';
import { serializeTableObject } from '@/services/database/modelSerialize';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log('api/generation/allowGeneration API Route Triggered');

    const user = await Users.getUserBySession(req, res);
    if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const mostRecentBook = await Books.findOne({
        order: [['createdAt', 'DESC']],
    });

    res.status(200).json({ mostRecentBook: mostRecentBook ? serializeTableObject(mostRecentBook) : null });
};

export default withAuth(handler);