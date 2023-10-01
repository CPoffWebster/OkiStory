import type { NextApiRequest, NextApiResponse } from 'next';
import { generateText, testGenerateText } from '@/services/generation/chatGPT';
import { generateImage } from '@/services/generation/dalle';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('api/generation/story API Route Triggered');

    // const generatedText = await generateText();
    // const generatedText = await testGenerateText();
    const generatedText = await generateImage();


    res.status(200).json({ generatedText });
}
