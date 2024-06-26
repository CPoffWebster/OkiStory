import { connectToDb } from "../database/database";
import { Books, BooksAttributes } from "../database/models/Books";
import { ImageGenerations, ImageGenerationsAttributes } from "../database/models/ImageGenerations";
import { TextGenerations, TextGenerationsAttributes } from "../database/models/TextGenerations";
import { bookPrompt, getStoryIDs, imagePrompt } from "./bookPrompting";
import { generateText, textGenerationEmitter } from "./chatGPT";
import { v4 as uuidv4 } from 'uuid';
import { generateImage } from "./dalle";
import { Pages } from "../database/models/Pages";
import { PaidAccounts } from "../database/models/PaidAccounts";

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

const propertyParsingNames = ['title', 'titleImageDescription', 'pageCount'];
const propertyParsingListNames = ['pageNumber', 'text', 'imageDescription'];

export async function initializeBookCreation(locationGUID: string, characterGUID: string, themeGUID: string, userID: number) {
    const bookGUID = uuidv4();
    const newBook: BooksAttributes = {
        GUID: bookGUID,
        LocationGUID: locationGUID,
        CharacterGUID: characterGUID,
        ThemeGUID: themeGUID,
        StyleGUID: '0',
        UserID: userID
    };
    initiateBookCreation(newBook);
    return bookGUID;
}

// Used as a buffer so no await is needed
async function initiateBookCreation(newBook: BooksAttributes) {
    connectToDb();
    PaidAccounts.updatedAmountOfGenerations(newBook.UserID!);
    createInRealTime(newBook);
}

/**
 * Creates a book in real time
 * As the text is generated, it is parsed and saved to the database for the book and each page
 * @param newBook 
 */
async function createInRealTime(newBook: BooksAttributes) {
    console.info('START: createInRealTime')

    let keyValueMap = new Map<string, string | number>();
    let pageList: generatedTextPage[] = [];
    let generatedText = '';
    let textIndex = 0;
    let currentPageIndex = 0;
    let bookOverall = true;

    // Create the text generation record
    const db = connectToDb();
    const transaction = await db.transaction();
    const model = process.env.TEXT_GENERATION_MODEL || 'test'
    const [character, location, theme, style] = await getStoryIDs(newBook, transaction);
    const prompt = bookPrompt(character, location, theme);
    const generation: TextGenerationsAttributes = {
        Company: 'OpenAI',
        Model: model,
        InputCharacters: prompt.length,
    };
    const textGenerationWithID: TextGenerationsAttributes = await TextGenerations.createGeneration(generation, transaction);
    newBook.GeneratedTextID = textGenerationWithID.id!;
    newBook = await Books.createBook(newBook, transaction) as unknown as BooksAttributes;
    await transaction.commit();

    // Listen for the text generation event
    const handleTextGenerated = (newText: string) => {
        generatedText = newText.replace(/\n/g, '').replace(/\\/g, '').replace(/\\\\/g, '').substring(textIndex);

        // Stop listening
        if (generatedText.includes(']')) {
            textGenerationEmitter.off('textGenerated', handleTextGenerated);
            return;
        }

        try {
            if (bookOverall) {
                [keyValueMap, pageList, textIndex] = createBookInRealTime(generatedText, keyValueMap, pageList, textIndex);
                if (textIndex !== 0) {
                    bookOverall = false;
                    saveBook(newBook, keyValueMap, character, location, style);
                }
            } else {
                const currTextIndex = textIndex;
                [pageList, textIndex, currentPageIndex] = createPagesInRealTime(generatedText, pageList, textIndex, currentPageIndex);
                if (textIndex !== currTextIndex) {
                    savePage(newBook, pageList, currentPageIndex - 1, character, location, style);
                }
            }
        } catch (err) {
            console.error(`ERROR: createInRealTime ${JSON.stringify(err)}`)
        }
    };

    // Listen for the text generation event
    textGenerationEmitter.on('textGenerated', handleTextGenerated);

    // Start the text generation
    await generateText(prompt, model, textGenerationWithID);
    console.info("DONE: createInRealTime")
}

/**
 * Parses the generated text for the book and cover and returns the key value pairs
 * Saves the Book to the database
 * @param generatedText augmented text generated by OpenAI
 * @param keyValueMap key value pairs for the book and cover
 * @param pageList list of pages
 * @param textIndex index of the text to start parsing from
 * @returns [keyValueMap, pageList, textIndex]
 */
function createBookInRealTime(generatedText: string, keyValueMap: Map<string, string | number>, pageList: generatedTextPage[], textIndex: number
): [Map<string, string | number>, generatedTextPage[], number] {

    // Get the keys and values for the book and cover
    // const startText = generatedText;
    if (generatedText.includes("pages") && generatedText.includes("[")) {
        for (const key of propertyParsingNames) {
            const result = parseJsonKey(key, generatedText);
            if (result !== null) {
                const [value, endIdx] = result;
                keyValueMap.set(key, value);
                // generatedText = generatedText.substring(endIdx + 1);
            }
        }

        pageList = Array.from({ length: keyValueMap.get('pageCount') as unknown as number }, () => ({} as generatedTextPage));
        textIndex = generatedText.indexOf("[") + 1;
    }

    return [keyValueMap, pageList, textIndex];
}

/**
 * Parses the generated text for a given page and returns the key value pairs
 * Saves the Page to the database
 * @param generatedText augmented text generated by OpenAI
 * @param pageList list of pages
 * @param textIndex index of the text to start parsing from
 * @param currentPageIndex index of the current page
 * @returns [pageList, textIndex, currentPageIndex]
 */
function createPagesInRealTime(generatedText: string, pageList: generatedTextPage[], textIndex: number, currentPageIndex: number
): [generatedTextPage[], number, number] {

    // ', { "pageNumber": 5, "text": "Even though it was fun, the pig promised himself he would return for another adventure and explore more about the vast desert.", "imageDescription": "The pig wistfully looking back at the oasis as he walks away. His new friends wave goodbye to him from the pond." },'
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
        textIndex += generatedText.indexOf(`}`) + 1; // += to set generatedText to the next page
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
    const regexPattern = new RegExp(`"${key}":\\s*("[^"]*"|\\d+)`);
    const match = generatedText.match(regexPattern);

    if (!match) return null;

    const value = match[1];
    const endIdx = match.index! + match[0].length;

    // Remove quotes if it's a string
    return [value.startsWith('"') ? value.slice(1, -1) : Number(value), endIdx];
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
    const db = connectToDb();
    const transaction = await db.transaction();

    // Create the image generation record
    const model = process.env.IMAGE_GENERATION_MODEL || "test";
    const size = process.env.IMAGE_GENERATION_SIZE || "test";

    const prompt = imagePrompt(keyValueMap.get('titleImageDescription')!.toString(), character, location, style);
    const generation: ImageGenerationsAttributes = {
        Company: 'OpenAI',
        Model: model,
        Size: size,
        Type: 'create',
        Input: prompt,
    };
    const imageGenerationWithID = await ImageGenerations.createGeneration(generation, transaction) as unknown as ImageGenerationsAttributes;

    newBook.Title = keyValueMap.get('title') as string;
    newBook.GeneratedImageID = imageGenerationWithID.id!;
    newBook.PageCount = keyValueMap.get('pageCount') as number;
    await Books.updateBook(newBook, transaction);
    await transaction.commit();

    // Start the image generation
    console.log("Generating title page image", imageGenerationWithID.id)
    await generateImage(prompt, imageGenerationWithID, model, size);
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
    const db = connectToDb();
    const transaction = await db.transaction();

    // Create the image generation record
    const model = process.env.IMAGE_GENERATION_MODEL || "test";
    const size = process.env.IMAGE_GENERATION_SIZE || "test";
    const prompt = imagePrompt(pageList[currentPageIndex].imageDescription, character, location, style);
    const generation: ImageGenerationsAttributes = {
        Company: 'OpenAI',
        Model: model,
        Size: size,
        Type: 'create',
        Input: prompt,
    };
    const imageGenerationWithID = await ImageGenerations.createGeneration(generation, transaction) as unknown as ImageGenerationsAttributes;

    await Pages.save({
        BookID: newBook.id!,
        PageNumber: pageList[currentPageIndex].pageNumber as number,
        GeneratedImageID: imageGenerationWithID.id!,
        Text: pageList[currentPageIndex].text
    }, transaction);
    await transaction.commit();

    // Start the image generation
    console.log("Generating page image", imageGenerationWithID.id)
    await generateImage(prompt, imageGenerationWithID, model, size);
}