import type { NextApiRequest, NextApiResponse } from 'next';
import { initializeTables } from '../../services/database/database';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('Initializing tables starting...');
    try {
        initializeTables();
        res.status(200).json({ message: 'Initialize tables success' });
    } catch (error) {
        console.error('Unable to initialize tables:', error);
        res.status(500).json({ message: 'Unable to initialize tables' });
    }
}
