import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDb } from '../../services/database/database';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    // get API key first
    if (req.body.apiKey !== 'oahnsdpfoiuhjnpaowieuhr9283yr98h') {
        res.status(401).json({ message: 'Invalid key' });
        return;
    }
    console.log('Seeding Database Started...');
    try {
        const db = connectToDb();
        db.seedData();
        res.status(200).json({ message: 'Seeding Database success' });
    } catch (error) {
        console.error('Unable to seed database:', error);
        res.status(500).json({ message: 'Unable to seed database' });
    }
}
