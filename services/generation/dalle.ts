import OpenAI from 'openai';
import { booksBucket, getStorage } from '../storage';
import { v4 as uuidv4 } from 'uuid';
import { Readable } from 'stream';
import axios from 'axios';
import { ImageGenerations, ImageGenerationsAttributes } from '../database/models/ImageGenerations';
import { generatedImage } from '@/static-examples/exampleBook';
import { compressImage } from '../imageCompression';


const openai = new OpenAI({
    apiKey: process.env["OPENAI_API_KEY"],
});

/**
 * Generate an image using the OpenAI API
 * If the model is 'test', it will use the example image after a delay
 * @param prompt generate image from this prompt
 * @param generation generated image record
 * @param model model to use
 * @param size size of the image
 * @returns 
 */
export async function generateImage(prompt: string, generation: ImageGenerationsAttributes, model: string, size: string) {

    console.log('STARTED: generateImage:', model)

    let endTime = 0;
    const startTime = performance.now();

    if (model === 'test') {
        const image = generatedImage;
        await new Promise(resolve => setTimeout(resolve, 5000));
        const endTime = performance.now();
        await updateGeneratedImageRecord(image.data[0].url!, generation, endTime - startTime);
    } else {
        try {
            const image = await openai.images.generate({
                model: model,
                prompt,
                size: size as "1024x1024" | "256x256" | "512x512" | "1792x1024" | "1024x1792" | null | undefined,
                n: 1
            });
            endTime = performance.now();
            console.log('generateImage Image Generated:', image);
            await updateGeneratedImageRecord(image.data[0].url!, generation, endTime - startTime);
        } catch (err) {
            console.log('Error generating image:', err);
        }
    }

    console.log('DONE: generateImage', endTime - startTime, 'ms');
}

/**
 * Upload the generated text to GCS and update the database record
 * @param generation database record
 * @param generatedText generated text
 * @param seconds time it took to generate the text
 */
async function updateGeneratedImageRecord(imageUrl: string, generation: ImageGenerationsAttributes, seconds: number) {
    const storage = getStorage();
    const imageBucket = storage.getBucket(booksBucket);

    // Download the image and convert it to a stream
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageStream = Readable.from(Buffer.from(response.data, 'binary'));

    // Compress the image using sharp
    const compressedImage = await compressImage(imageStream);

    const guid = uuidv4();
    const currentDate = new Date();
    const formattedDate = `${currentDate.getMonth() + 1}-${currentDate.getDate()}-${currentDate.getFullYear()}`;
    generation.GCSLocation = `${formattedDate}/${guid}.png`;

    console.log('Uploading', generation.GCSLocation, 'to', booksBucket);
    await imageBucket.upload(generation.GCSLocation, compressedImage);

    let price = 0;
    switch (generation.Model.toLowerCase()) {
        case ('dall-e-3'):
            price = .08;
            break;
        case ('test'):
            price = 0;
            break;
    }
    generation.APICallMilliSeconds = seconds;
    generation.EstimatedPrice = price;
    await ImageGenerations.updateGeneration(generation);
}