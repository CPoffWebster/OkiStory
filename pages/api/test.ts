import { connectToDb } from '@/services/database/database';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('API Route Triggered');
  connectToDb();
  res.status(200).json({ message: 'Hello from test API' });
}
