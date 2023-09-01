import { exampleBook } from '@/static-book/exampleBook';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('request: ', req.body)
    res.status(200).json({ book: exampleBook });
}