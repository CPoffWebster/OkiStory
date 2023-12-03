import OpenAI from 'openai';
import { TextGenerations, TextGenerationsAttributes } from '../database/models/TextGenerations';
import { getStorage, textGenerationsBucket } from '../storage';
import { v4 as uuidv4 } from 'uuid';
import { Readable } from 'stream';
import { generatedTextStory } from '@/static-examples/exampleBook';
import { EventEmitter } from 'events';

export const textGenerationEmitter = new EventEmitter();

const openai = new OpenAI({
    apiKey: process.env["OPENAI_API_KEY"],
});

/**
 * Generate text using the OpenAI API
 * If the model is 'test', it will use the example text
 * @param prompt generate text from this prompt
 * @param model model to use
 * @param generation generated text record
 */
export async function generateText(prompt: string, model: string, generation: TextGenerationsAttributes) {
    console.log('STARTED: generateText:', model)
    let generatedText = ''; // `{ "response": "Hello World" }`
    let endTime = 0;
    const startTime = performance.now();

    if (model === 'test') {
        const streamText = JSON.stringify(generatedTextStory);
        for (const char of streamText) {
            generatedText += char;
            textGenerationEmitter.emit('textGenerated', generatedText);
            await new Promise(resolve => setTimeout(resolve, .01))
        }

        const endTime = performance.now();
        await updateGeneratedTextRecord(prompt, generation, generatedText, endTime - startTime);
    } else {
        try {
            const stream = await openai.chat.completions.create({
                model: model,
                messages: [{ role: 'user', content: prompt }],
                stream: true,
            });

            for await (const part of stream) {
                generatedText += part.choices[0]?.delta?.content || '';
                textGenerationEmitter.emit('textGenerated', generatedText);
            }

            endTime = performance.now();
            // return generatedText;
            await updateGeneratedTextRecord(prompt, generation, generatedText, endTime - startTime);
        } catch (error) {
            console.log('error:', error);
        }
    }

    console.log('DONE: generateText', endTime - startTime, 'ms');
};

/**
 * Upload the generated text to GCS and update the database record
 * @param prompt prompt used to generate the text
 * @param generation database record
 * @param generatedText generated text
 * @param seconds time it took to generate the text
 */
async function updateGeneratedTextRecord<T>(prompt: string, generation: TextGenerationsAttributes, generatedText: string, seconds: number) {
    const storage = getStorage();
    const textBucket = storage.getBucket(textGenerationsBucket);
    const generatedTextOutput: T = JSON.parse(generatedText);
    const dataStream = Readable.from(JSON.stringify(JSON.stringify({
        ...generatedTextOutput,
        prompt
    })));


    const guid = uuidv4();
    const currentDate = new Date();
    const formattedDate = `${currentDate.getMonth() + 1}-${currentDate.getDate()}-${currentDate.getFullYear()}`;

    generation.GCSLocation = `${formattedDate}/${guid}.json`;
    console.log('Uploading', generation.GCSLocation, 'to', textGenerationsBucket)
    await textBucket.upload(generation.GCSLocation, dataStream);

    let inputPrice = 0;
    let outputPrice = 0;
    switch (generation.Model.toLowerCase()) {
        case 'gpt-3.5-turbo':
            inputPrice = 0.0000015;
            outputPrice = 0.000002;
            break;
        case 'gpt-4':
            inputPrice = 0.00003;
            outputPrice = 0.00006;
            break;
        case 'test':
            inputPrice = 0;
            outputPrice = 0;
            break;
    }
    generation.OutputCharacters = generatedText.length;
    generation.APICallMilliSeconds = seconds;
    generation.EstimatedPrice = (generation.InputCharacters * inputPrice) + (generation.OutputCharacters * outputPrice);
    await TextGenerations.updateGeneration(generation);
}