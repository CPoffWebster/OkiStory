import { connectToDb } from "../database/database";
import { Books, BooksAttributes } from "../database/models/Books";
import { ImageGenerations, ImageGenerationsAttributes } from "../database/models/ImageGenerations";
import { TextGenerations, TextGenerationsAttributes } from "../database/models/TextGenerations";
import { bookPrompt, getStoryIDs, imagePrompt } from "./bookPrompting";
import { generateText, textGenerationEmitter } from "./chatGPT";
import { v4 as uuidv4 } from 'uuid';
import { generateImage } from "./dalle";
import { Pages } from "../database/models/Pages";

class generatedTextOutput {
    title!: string;
    titleImageDescription!: string;
    pageCount!: number;
    pages!: generatedTextPage[];
}

class generatedTextPage {
    pageNumber!: number;
    text!: string;
    imageDescription!: string;
}

const propertyParsingNames = ['title', 'titleImageDescription', 'character', 'setting', 'theme', 'pageCount', 'pages'];
const propertyParsingListNames = ['pageNumber', 'text', 'imageDescription'];

export async function initializeBookCreation(locationGUID: string, characterGUID: string, themeGUID: string, userEmail: string) {
    connectToDb();
    const bookGUID = uuidv4();
    const newBook: BooksAttributes = {
        GUID: bookGUID,
        Title: '',
        // GeneratedTextID: null,
        // GeneratedImageID: null,
        LocationID: 0, // locationGUID
        CharacterID: 0, // characterGUID
        ThemeID: 0, // themeGUID
        UserID: 1, // userEmail
        // PageCount: null
    };
    initiateBookCreation(newBook);
    return bookGUID;
}

// Used as a buffer so no await is needed
async function initiateBookCreation(newBook: BooksAttributes) {
    createInRealTime(newBook);
}

/**
 * Creates a book in real time
 * As the text is generated, it is parsed and saved to the database for the book and each page
 * @param newBook 
 */
async function createInRealTime(newBook: BooksAttributes) {
    console.log('START: createInRealTime')

    let keyValueMap = new Map<string, string | number>();
    let pageList: generatedTextPage[] = [];
    let generatedText = '';
    let textIndex = 0;
    let currentPageIndex = 0;
    let bookOverall = true;

    // Create the text generation record
    const model = process.env.TEXT_GENERATION_MODEL || 'test'
    const [character, location, themeName, themeDesc, style] = await getStoryIDs(newBook.CharacterID, newBook.LocationID, newBook.ThemeID);
    const prompt = await bookPrompt(character, location, themeName, themeDesc);
    const generation: TextGenerationsAttributes = {
        Company: 'OpenAI',
        Model: model,
        InputCharacters: prompt.length,
    };
    const textGenerationWithID: TextGenerationsAttributes = await TextGenerations.createGeneration(generation);
    newBook.GeneratedTextID = textGenerationWithID.id!;
    newBook = await Books.createBook(newBook) as unknown as BooksAttributes;

    // Listen for the text generation event
    textGenerationEmitter.on('textGenerated', (newText: string) => {
        generatedText = newText.substring(textIndex);

        if (generatedText === ']}') return;

        if (bookOverall) {
            [keyValueMap, pageList, textIndex] = createBookInRealTime(generatedText, newText, keyValueMap, pageList, textIndex);
            if (textIndex !== 0) {
                bookOverall = false;
                saveBook(newBook, keyValueMap, character, location, style);
            }
        } else {
            const currTextIndex = textIndex;
            [pageList, textIndex, currentPageIndex] = createPagesInRealTime(generatedText, newText, pageList, textIndex, currentPageIndex);
            if (textIndex !== currTextIndex) {
                savePage(newBook, pageList, currentPageIndex - 1, character, location, style);
            }
        }
    });

    // Start the text generation
    await generateText(prompt, model, textGenerationWithID);
    console.log("DONE: createInRealTime")
}

/**
 * Parses the generated text for the book and cover and returns the key value pairs
 * Saves the Book to the database
 * @param generatedText text generated by OpenAI up to textIndex
 * @param newText full text generated by OpenAI
 * @param keyValueMap key value pairs for the book and cover
 * @param pageList list of pages
 * @param textIndex index of the text to start parsing from
 * @returns [keyValueMap, pageList, textIndex]
 */
function createBookInRealTime(generatedText: string, newText: string, keyValueMap: Map<string, string | number>, pageList: generatedTextPage[], textIndex: number
): [Map<string, string | number>, generatedTextPage[], number] {

    // Get the keys and values for the book and cover
    if (generatedText.includes(`"pages":[`)) {
        for (const key of propertyParsingNames) {
            const result = parseJsonKey(key, newText);
            if (result !== null) {
                const [value, endIdx] = result;
                keyValueMap.set(key, value);
                generatedText = generatedText.substring(endIdx + 1);
            }
        }

        pageList = Array.from({ length: keyValueMap.get('pageCount') as unknown as number }, () => ({} as generatedTextPage));
        textIndex = newText.indexOf(`"pages":[`) + `"pages":[`.length;
    }

    return [keyValueMap, pageList, textIndex];
}

/**
 * Parses the generated text for a given page and returns the key value pairs
 * Saves the Page to the database
 * @param generatedText text generated by OpenAI up to textIndex
 * @param newText full text generated by OpenAI
 * @param pageList list of pages
 * @param textIndex index of the text to start parsing from
 * @param currentPageIndex index of the current page
 * @returns [pageList, textIndex, currentPageIndex]
 */
function createPagesInRealTime(generatedText: string, newText: string, pageList: generatedTextPage[], textIndex: number, currentPageIndex: number
): [generatedTextPage[], number, number] {

    // Get the keys and values for each page
    if (generatedText.includes(`}`)) {
        for (const key of propertyParsingListNames) {
            const result = parseJsonKey(key, generatedText);
            if (result !== null) {
                const [value, _endIdx] = result;
                (pageList[currentPageIndex] as any)[key] = value;
            }
        }

        currentPageIndex++;
        textIndex = newText.indexOf(`}`, textIndex) + 1;
    }

    return [pageList, textIndex, currentPageIndex];
}

/**
 * Parses the generated text for a given page key
 * @param key from propertyParsingListNames of page keys
 * @param generatedText 
 * @returns value of the key
 */
function parseJsonKey(key: string, generatedText: string): [string | number, number] | null {
    const pattern = `"${key}":`;
    const startIdx = generatedText.indexOf(pattern);

    if (startIdx === -1) return null;

    let endIdx, value;
    const valueStartIdx = startIdx + pattern.length;

    if (generatedText.charAt(valueStartIdx) === '"') {
        // String value
        endIdx = generatedText.indexOf('"', valueStartIdx + 1);
        value = generatedText.substring(valueStartIdx + 1, endIdx);
    } else {
        // Numeric or otherwise
        endIdx = generatedText.indexOf(',', valueStartIdx);
        value = generatedText.substring(valueStartIdx, endIdx);
    }

    return [value, endIdx];
}


/**
 * Saves the book to the database
 * Starts the image generation for the cover page
 * @param newBook update the book with the generated text and image
 * @param keyValueMap values from generated text
 * @param character 
 * @param location 
 * @param style 
 */
async function saveBook(newBook: BooksAttributes, keyValueMap: Map<string, string | number>, character: string, location: string, style: string) {

    // Create the image generation record
    const model = process.env.IMAGE_GENERATION_MODEL as "256x256" | "512x512" | "1024x1024" | "test" || 'test'
    const prompt = imagePrompt(keyValueMap.get('titleImageDescription')!.toString(), character, location, style);
    const generation: ImageGenerationsAttributes = {
        Company: 'OpenAI',
        Model: model,
        Type: 'create',
        Input: prompt,
    };
    const imageGenerationWithID = await ImageGenerations.createGeneration(generation) as unknown as ImageGenerationsAttributes;

    newBook.Title = keyValueMap.get('title') as string;
    newBook.GeneratedImageID = imageGenerationWithID.id!;
    newBook.PageCount = keyValueMap.get('pageCount') as number;
    await Books.updateBook(newBook);

    // Start the image generation
    await generateImage(prompt, model, imageGenerationWithID);
}

/**
 * Saves the page to the database
 * Starts the image generation for the page
 * @param newBook update the book with the generated text and image
 * @param pageList list of pages
 * @param currentPageIndex index of the current page
 * @param character 
 * @param location 
 * @param style 
 */
async function savePage(newBook: BooksAttributes, pageList: generatedTextPage[], currentPageIndex: number, character: string, location: string, style: string) {
    // Create the image generation record
    const model = process.env.IMAGE_GENERATION_MODEL as "256x256" | "512x512" | "1024x1024" | "test" || 'test'
    const prompt = imagePrompt(pageList[currentPageIndex].imageDescription, character, location, style);
    const generation: ImageGenerationsAttributes = {
        Company: 'OpenAI',
        Model: model,
        Type: 'create',
        Input: prompt,
    };
    const imageGenerationWithID = await ImageGenerations.createGeneration(generation) as unknown as ImageGenerationsAttributes;

    await Pages.save({
        BookID: newBook.id!,
        PageNumber: pageList[currentPageIndex].pageNumber,
        GeneratedImageID: imageGenerationWithID.id!,
        Text: pageList[currentPageIndex].text
    });

    // Start the image generation
    await generateImage(prompt, model, imageGenerationWithID);
}