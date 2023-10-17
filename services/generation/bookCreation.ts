import { connectToDb } from "../database/database";
import { Books, BooksAttributes } from "../database/models/Books";
import { TextGenerations, TextGenerationsAttributes } from "../database/models/TextGenerations";
import { bookPrompt } from "./bookPrompting";
import { testGenerateText, textGenerationEmitter } from "./chatGPT";
import { v4 as uuidv4 } from 'uuid';

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

export function initializeBookCreation(locationID: number, characterID: number, themeID: number, userID: number) {
    connectToDb();
    const bookGUID = uuidv4();
    const newBook: BooksAttributes = {
        GUID: bookGUID,
        Title: '',
        GeneratedTextID: 0,
        GeneratedImageID: 0,
        LocationID: locationID,
        CharacterID: characterID,
        ThemeID: themeID,
        UserID: userID,
        PageCount: 0
    };
    initiateBookCreation(newBook);
    return bookGUID;
}

// Used as a buffer so no await is needed
async function initiateBookCreation(newBook: BooksAttributes) {
    createInRealTime(newBook);
}

async function createInRealTime(newBook: BooksAttributes) {
    console.log('START: createBookInRealTime')

    let keyValueMap = new Map<string, string | number>();
    let pageList: generatedTextPage[] = [];
    let generatedText = '';
    let fullGeneratedText = '';
    let textIndex = 0;
    let currentPageIndex = 0;
    let bookOverall = true;

    // Listen for the text generation event
    textGenerationEmitter.on('textGenerated', (newText: string) => {
        generatedText = newText.substring(textIndex);
        fullGeneratedText = newText;

        if (generatedText === ']}') return;

        if (bookOverall) {
            [keyValueMap, pageList, textIndex] = createBookInRealTime(generatedText, newText, keyValueMap, pageList, textIndex);
            if (textIndex !== 0) {
                bookOverall = false;
                // saveBook(newBook, keyValueMap);
            }
        } else {
            const currTextIndex = textIndex;
            [pageList, textIndex, currentPageIndex] = createPagesInRealTime(generatedText, newText, pageList, textIndex, currentPageIndex);
            if (textIndex !== currTextIndex) {
                // savePage();
            }
        }
    });

    const company = 'OpenAI';
    const model = 'gpt-3.5-turbo'; // 'gpt-4'
    const prompt = await bookPrompt(newBook.CharacterID, newBook.LocationID, newBook.ThemeID);
    const generation: TextGenerationsAttributes = {
        Company: company,
        Model: model,
        InputCharacters: prompt.length,
    };
    const generationWithID = await TextGenerations.createGeneration(generation) as unknown as TextGenerationsAttributes;
    await testGenerateText(prompt, model, generationWithID);

    console.log("DONE: testGenerateText")
    // console.log(keyValueMap, pageList)
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

async function saveBook(newBook: BooksAttributes, keyValueMap: Map<string, string | number>) {
    // const 
    newBook.Title = keyValueMap.get('title') as string;
    newBook.GeneratedTextID = 0;
    newBook.GeneratedImageID = 0;
    newBook.PageCount = keyValueMap.get('pageCount') as number;

    await Books.save(newBook);
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