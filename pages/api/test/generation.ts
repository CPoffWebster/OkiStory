// import { connectToDb } from '@/services/database/database';
// import { BooksAttributes } from '@/services/database/models/Books';
// import { TextGenerationsAttributes } from '@/services/database/models/TextGenerations';
// import { bookPrompt, getStoryIDs } from '@/services/generation/bookPrompting';
// import { generateText } from '@/services/generation/chatGPT';
// import type { NextApiRequest, NextApiResponse } from 'next';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     connectToDb();
//     const newBook: BooksAttributes = {
//         GUID: '123',
//         LocationGUID: "7133c535-39bd-4a8d-aa4d-c4c5863418c1",
//         CharacterGUID: "d7acfd01-892e-431d-a0f1-96c4744c31c6",
//         ThemeGUID: "0",
//         StyleGUID: '0',
//         UserEmail: "charlespoff799@gmail.com"
//     };
//     const [character, location, theme, style] = await getStoryIDs(newBook);
//     const prompt = bookPrompt(character, location, theme);

//     const txtGen: TextGenerationsAttributes = {
//         Company: 'OpenAI',
//         Model: "gpt-3.5-turbo",
//         InputCharacters: prompt.length,
//     };
//     const generation = await generateText(prompt, "gpt-3.5-turbo", txtGen);
//     res.status(200).json({ message: generation });
// }
