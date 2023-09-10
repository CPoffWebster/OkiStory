import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDb, initializeTables } from '../../services/database/database';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('API Route Triggered');
  // connectToDb();
  initializeTables();
  res.status(200).json({ message: 'Hello from test API' });
}
