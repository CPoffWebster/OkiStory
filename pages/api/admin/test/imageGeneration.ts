// import { connectToDb } from '@/services/database/database';
// import { ImageGenerations, ImageGenerationsAttributes } from '@/services/database/models/ImageGenerations';
// import { generateImage } from '@/services/generation/dalle';
// import { withAuthAdmin } from '@/utils/withAuthAdmin';
// import type { NextApiRequest, NextApiResponse } from 'next';

// const handler = async (req: NextApiRequest, res: NextApiResponse) => {
//     connectToDb();

//     const prompt = `You are a seasoned artist specializing in children's book art that captivate young minds and hearts.
//     Your art is not only engaging but also memorable, staying with children for a lifetime.
    
//     Image Description: Rosie approaching the oasis, with palm trees and a pond surrounded by sand.
//     Character: Pink Pig (Description: The pig is plump and rosy pink, with a curly tail, large floppy ears, and a joyful expression.)
//     Setting: Desert (Description: The desert landscape showcases tall sand dunes. There's an oasis with palm trees and a pond, providing a hint of life in the vast expanse.)
//     Style: Illustration for children's books.`;
//     const generation: ImageGenerationsAttributes = {
//         Company: 'OpenAI',
//         Model: "dall-e-3",
//         Size: "1024x1024",
//         Type: 'create',
//         Input: prompt,
//     };
//     const imageGenerationWithID = await ImageGenerations.createGeneration(generation) as unknown as ImageGenerationsAttributes;
//     await generateImage(prompt, imageGenerationWithID, "dall-e-3", "1024x1024");

//     res.status(200).json({ message: generation });
// }

// export default withAuthAdmin(handler);