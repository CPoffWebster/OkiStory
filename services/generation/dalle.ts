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
 * @param model model to use
 * @param generation generated image record
 * @returns 
 */
export async function generateImage(prompt: string, model: "256x256" | "512x512" | "1024x1024" | 'test', generation: ImageGenerationsAttributes) {
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
            const size: "256x256" | "512x512" | "1024x1024" = model; // 256x256, 512x512, or 1024x1024 

            const image = await openai.images.generate({
                prompt,
                size,
                n: 1
            });
            endTime = performance.now();
            console.log('generateImage Image Generated:', image);
            await updateGeneratedImageRecord(image.data[0].url!, generation, endTime - startTime);
        } catch (err) {
            console.log('error:', err);
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
    switch (generation.Model) {
        case ('1024x1024'):
            price = .02;
            break;
        case ('512x512'):
            price = .018;
            break;
        case ('256x256'):
            price = .016;
            break;
        case ('test'):
            price = 0;
            break;
    }
    generation.APICallMilliSeconds = seconds;
    generation.EstimatedPrice = price;
    await ImageGenerations.updateGeneration(generation);
}