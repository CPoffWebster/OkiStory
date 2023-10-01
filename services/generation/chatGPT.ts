import OpenAI from 'openai';
import { connectToDb } from '../database/database';
import { TextGenerations } from '../database/models/TextGenerations';
import { getStorage, textGenerationsBucket } from '../storage';
import { v4 as uuidv4 } from 'uuid';
import { Readable } from 'stream';
import { generatedTextStory } from '@/static-examples/exampleBook';

const openai = new OpenAI({
    apiKey: process.env["OPENAI_API_KEY"],
});

export async function testGenerateText() {
    async function sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const startTime = performance.now();
    const streamText = JSON.stringify(generatedTextStory);

    // Calculate the time to sleep between each character so the total duration is approx 45 seconds
    const sleepTime = Math.floor(30000 / streamText.length);

    let generatedText = '';

    for (const char of streamText) {
        generatedText += char;
        console.log(`Generated Text  ${(performance.now() - startTime).toFixed(2)}: ${generatedText}`)
        await sleep(sleepTime);
    }

    const endTime = performance.now();

    // Your code to save or use generatedText
    // For example: saveGeneratedTextRecord(prompt, generatedText, endTime - startTime, 'Simulated Model');
    console.log(`Generated Text: ${generatedText}`);
    console.log(`Time taken for API call: ${(endTime - startTime).toFixed(2)}ms`);
}

export async function generateText() {
    const startTime = performance.now();
    try {
        const model = 'gpt-3.5-turbo'; // 'gpt-4
        const prompt = textPrompt;
        // const prompt = "Say Hello World"; // textPrompt;
        // const generatedText = `{ "response": "Hello World" }`;
        const stream = await openai.chat.completions.create({
            model: model,
            messages: [{ role: 'user', content: prompt }],
            stream: true,
        });

        let generatedText = '';
        for await (const part of stream) {
            generatedText += part.choices[0]?.delta?.content || '';
        }

        const endTime = performance.now();
        saveGeneratedTextRecord(prompt, generatedText, endTime - startTime, model);

        return generatedText;
    } catch (error) {
        console.log('error:', error);
        return '';
    }
};

/**
 * Saves the generated text to the database and to Google Cloud Storage
 * @param prompt 
 * @param generatedText 
 * @param seconds 
 * @param model 
 */
async function saveGeneratedTextRecord(prompt: string, generatedText: string, seconds: number, model: string) {
    connectToDb();
    const storage = getStorage();
    const textBucket = storage.getBucket(textGenerationsBucket);

    const generatedTextOutput: generatedTextOutput = JSON.parse(generatedText);
    const dataStream = Readable.from(JSON.stringify(JSON.stringify({
        ...generatedTextOutput,
        prompt
    })));


    const guid = uuidv4();
    const currentDate = new Date();
    const formattedDate = `${currentDate.getMonth() + 1}-${currentDate.getDate()}-${currentDate.getFullYear()}`;

    console.log('Uploading', `${formattedDate}/${guid}.json`, 'to', textGenerationsBucket)
    await textBucket.upload(`${formattedDate}/${guid}.json`, dataStream);
    await TextGenerations.saveOpenAITextGeneration(guid, prompt.length, generatedText.length, seconds, model);
}

const childrenAge = 5;

const characters = [
    "Teddy Bear",
    "Raccoon",
    "Pink Pig"
];

const settings = [
    "Forest",
    "Desert",
    "Grasslands"
];

const themes = [
    {
        name: "Responsibility and Ethics",
        desc: "Stories that teach children about the importance of being responsible, making moral choices, and understanding the consequences of their actions, whether in everyday situations or grand adventures."
    },
    {
        name: "Problem-Solving and Critical Thinking",
        desc: "Stories where characters face puzzles, mysteries, or challenges that require logic, reasoning, and out-of-the-box solutions to resolve."
    },
    {
        name: "Acceptance and Self-Love",
        desc: "Narratives that highlight the importance of self-acceptance, understanding one's unique qualities, and realizing that everyone has a special place in the world."
    },
    {
        name: "Growth and Change",
        desc: "Narratives that follow characters as they grow, evolve, and navigate transitions, such as moving homes, growing older, or gaining a new sibling."
    },
    {
        name: "Empathy and Kindness",
        desc: "Stories that teach the importance of being kind, understanding different perspectives, and showing compassion to others, even if they seem different."
    },
    {
        name: "Understanding Emotions",
        desc: "Books that delve into feelings, helping children identify, understand, and express their emotions, from happiness and love to anger and sadness."
    },
    {
        name: "Discovery and Adventure",
        desc: "Tales of exploration, whether it's discovering a new world, going on a treasure hunt, or learning about the wonders of the universe."
    },
    {
        name: "Family and Relationships",
        desc: "Stories focusing on family bonds, the joy of having siblings, or adjusting to a new family structure (like with blended families or adoption)."
    },
    {
        name: "Courage and Bravery",
        desc: "Narratives where characters face their fears, whether it's starting a new school, facing a bully, or venturing into an unknown place."
    },
    {
        name: "Friendship and Unity",
        desc: "Stories that emphasize the importance of friends and coming together to overcome challenges. They demonstrate how diverse groups can work together for a common cause."
    }
];


const textPrompt = `
You are a seasoned writer specializing in children's books that captivate young minds and hearts. 
Your stories are not only engaging but also memorable, staying with children for a lifetime. 
You have a unique talent for describing art in picture books in such a way that an AI could easily generate those images.


Please create a children's storybook aimed at children aged ${childrenAge}. 
The story should be simple, utilizing basic action words and straightforward descriptions. 
The narrative should be structured in a way that makes it easy to create matching images.

The narrative should be well-structured with a distinct beginning, middle, and end, avoiding any cliffhangers or abrupt stops. 
Each page, inclusive of the title page, should come with an accompanying image description. 
These descriptions should be crafted to suit hand-drawn, simple designs appropriate for picture books. 
Consistency is key: ensure that the characters and settings maintain a uniform style throughout the story, both in textual description and in the envisioned artwork.


The output should strictly follow this structure:
{
    "title": "",
    "titleImageDescription": "",
    "character": "",
    "setting": "",
    "theme": "",
    "pages": [
        {
            "pageNumber": 1,
            "text": "",
            "imageDescription": ""
        }
    ]
}

Given the directions above, create a story with the following parameters:
Character: ${characters[0]}
Setting: ${settings[0]}
Theme: ${themes[0].name}; ${themes[0].desc}
`
interface generatedTextOutput {
    title: string;
    titleImageDescription: string;
    character: string;
    setting: string;
    theme: string;
    pages: generatedTextPage[];
}

interface generatedTextPage {
    pageNumber: number;
    text: string;
    imageDescription: string;
}