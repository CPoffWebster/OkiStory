import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDb } from '../../../services/database/database';
import { withAuthAdmin } from '@/utils/withAuthAdmin';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const useDev: boolean = process.env.USE_DEV === 'reset';
    console.log('initializeTables starting...');
    try {
        const db = connectToDb();
        db.createTables({ useDev });
        res.status(200).json({ message: 'Initialize tables success' });
    } catch (error) {
        console.error('Unable to initialize tables:', error);
        res.status(500).json({ message: 'Unable to initialize tables' });
    }
}

export default withAuthAdmin(handler);