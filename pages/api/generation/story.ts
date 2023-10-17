import type { NextApiRequest, NextApiResponse } from 'next';
// import { generateText, testGenerateText } from '@/services/generation/chatGPT';
// import { generateImage, testGenerateImage } from '@/services/generation/dalle';
import { initializeBookCreation } from '@/services/generation/bookCreation';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('api/generation/story API Route Triggered');

    const { locationID, characterID, themeID, userID } = req.body;

    // const generatedText = await generateText();
    // const generatedText = await testGenerateText();
    // const generatedText = await generateImage();
    // const generatedText = await testGenerateImage();

    // res.status(200).json({ generatedText });


    const guid = initializeBookCreation(locationID, characterID, themeID, userID);

    res.status(200).json({ bookGuid: guid });
}
