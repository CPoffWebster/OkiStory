import { generatedTextPage, propertyParsingListNames, propertyParsingNames, testGenerateText, textGenerationEmitter } from "./chatGPT";

export async function createBook() {
    await createBookInRealTime();
}

async function createBookInRealTime() {
    console.log('START: createBookInRealTime')

    let keyValueMap = new Map<string, string | number | generatedTextPage[]>();
    let pageList: generatedTextPage[] = [];
    let generatedText = '';
    let fullGeneratedText = '';
    let textIndex = 0;
    let currentPageIndex = 0;
    let pageStarted = false;

    // Listen for the text generation event
    textGenerationEmitter.on('textGenerated', (newText: string) => {
        generatedText = newText.substring(textIndex);
        fullGeneratedText = newText;

        // Get the keys and values for the book and cover
        if (generatedText.includes(`"pages":[`)) {
            pageStarted = true;
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

        // Get the keys and values for each page
        if (pageStarted && generatedText.includes(`}`) && generatedText !== ']}') {
            for (const key of propertyParsingListNames) {
                const result = parseJsonKey(key, newText);
                if (result !== null) {
                    const [value, _endIdx] = result;
                    (pageList[currentPageIndex] as any)[key] = value;
                }
            }

            // console.log(pageList[currentPageIndex])
            currentPageIndex++;
            textIndex = newText.indexOf(`}`, textIndex) + 1;
        }
    });

    await testGenerateText();

    console.log("DONE: testGenerateText")
    console.log(keyValueMap, pageList)
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

export function createTitlePage() {
    // Your logic here
}

export function createPage() {
    // Your logic here
}