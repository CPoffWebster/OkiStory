import { exampleDefaultCharacters } from '@/static-examples/exampleDefaultCharacters';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json({ defaultCharacters: exampleDefaultCharacters });
}