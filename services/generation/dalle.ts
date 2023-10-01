import OpenAI from 'openai';
import { connectToDb } from '../database/database';
import { booksBucket, getStorage } from '../storage';
import { v4 as uuidv4 } from 'uuid';
import { Readable } from 'stream';
import axios from 'axios';
import { ImageGenerations } from '../database/models/ImageGenerations';


const openai = new OpenAI({
    apiKey: process.env["OPENAI_API_KEY"],
});

export async function generateImage() {
    const prompt = "A cute baby sea otter";
    const size = '256x256'; // 256x256, 512x512, or 1024x1024 

    const startTime = performance.now();
    const image = await openai.images.generate({
        prompt,
        size,
        n: 1
    });
    const endTime = performance.now();
    saveGeneratedImageRecord(prompt, image.data[0].url!, endTime - startTime, size);



    console.log(image);
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
    await ImageGenerations.saveOpenAIImageGeneration(guid, model, 'create', seconds, prompt, imageUrl, `${formattedDate}/${guid}.png`);
}