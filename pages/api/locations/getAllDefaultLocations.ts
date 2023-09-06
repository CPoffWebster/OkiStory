import { exampleDefaultLocations } from '@/static-examples/exampleDefaultLocations';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json({ defaultLocations: exampleDefaultLocations });
}