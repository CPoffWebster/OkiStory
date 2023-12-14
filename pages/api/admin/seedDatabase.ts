import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDb } from '../../../services/database/database';
import { withAuthAdmin } from '@/utils/withAuthAdmin';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.info('Seeding Database Started...');
    try {
        const db = connectToDb();
        db.seedData();
        res.status(200).json({ message: 'Seeding Database success' });
    } catch (error: any) {
        console.error('Unable to seed database:', error.toString());
        res.status(500).json({ message: 'Unable to seed database' });
    }
}

export default withAuthAdmin(handler);