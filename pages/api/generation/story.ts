import type { NextApiRequest, NextApiResponse } from 'next';
import { generateText } from '@/services/generation/openAI';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('api/generation/story API Route Triggered');

    const generatedText = await generateText();


    res.status(200).json({ message: generatedText });
}
