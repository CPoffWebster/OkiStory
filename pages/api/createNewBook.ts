import { exampleBook } from '@/static-examples/exampleBook';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json({ book: exampleBook });
}