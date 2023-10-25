import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDb } from '../../services/database/database';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    // get API key first
    if (req.body.apiKey !== 'oahnsdpfoiuhjnpaowieuhr9283yr98h') {
        res.status(401).json({ message: 'Invalid key' });
        return;
    }
    const useDev: boolean = process.env.USE_DEV === 'reset';
    console.log('Initializing tables starting...');
    try {
        const db = connectToDb();
        db.createTables({ useDev });
        res.status(200).json({ message: 'Initialize tables success' });
    } catch (error) {
        console.error('Unable to initialize tables:', error);
        res.status(500).json({ message: 'Unable to initialize tables' });
    }
}
