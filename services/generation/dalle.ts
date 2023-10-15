import OpenAI from 'openai';
import { connectToDb } from '../database/database';
import { booksBucket, getStorage } from '../storage';
import { v4 as uuidv4 } from 'uuid';
import { Readable } from 'stream';
import axios from 'axios';
import { ImageGenerations } from '../database/models/ImageGenerations';
import { generatedImage } from '@/static-examples/exampleBook';


const openai = new OpenAI({
    apiKey: process.env["OPENAI_API_KEY"],
});

export async function testGenerateImage() {
    async function sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const prompt = "A cute baby sea otter";
    const size = '256x256'; // 256x256, 512x512, or 1024x1024 
    const image = generatedImage;
    await sleep(5000);
    await saveGeneratedImageRecord(prompt, image.data[0].url!, 0, 'test');

    console.log(image);
    return image.data;
}

export async function generateImage() {
    const prompt = "A cute illustration of Teddy Bear with a smile on its face, standing in front of a beautiful forest filled with vibrant green trees and colorful flowers.";
    const size = '256x256'; // 256x256, 512x512, or 1024x1024 

    const startTime = performance.now();
    const image = await openai.images.generate({
        prompt,
        size,
        n: 1
    });
    const endTime = performance.now();
    console.log(image);
    await saveGeneratedImageRecord(prompt, image.data[0].url!, endTime - startTime, size);

    return image.data;
}

async function saveGeneratedImageRecord(prompt: string, imageUrl: string, seconds: number, model: string) {
    connectToDb();
    const storage = getStorage();
    const imageBucket = storage.getBucket(booksBucket);


    // Download the image and convert it to a stream
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageStream = Readable.from(Buffer.from(response.data, 'binary'));

    const guid = uuidv4();
    const currentDate = new Date();
    const formattedDate = `${currentDate.getMonth() + 1}-${currentDate.getDate()}-${currentDate.getFullYear()}`;

    console.log('Uploading', `${formattedDate}/${guid}.png`, 'to', booksBucket);

    await imageBucket.upload(`${formattedDate}/${guid}.png`, imageStream);
    await ImageGenerations.saveOpenAIImageGeneration(guid, model, 'create', seconds, prompt, `${formattedDate}/${guid}.png`);
}