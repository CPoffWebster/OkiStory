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

    textGenerationEmitter.on('textGenerated', (newText: string) => {
        generatedText = newText.substring(textIndex);
        fullGeneratedText = newText;

        // Get the keys and values for the book and cover
        if (generatedText.includes(`"pages":[`)) {
            pageStarted = true;
            for (const key of propertyParsingNames) {
                const pattern = `"${key}":`;
                const startIdx = generatedText.indexOf(pattern);

                if (startIdx === -1) continue;

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

                keyValueMap.set(key, value);
                generatedText = generatedText.substring(endIdx + 1);
            }

            pageList = Array.from({ length: keyValueMap.get('pageCount') as unknown as number }, () => ({} as generatedTextPage));
            textIndex = newText.indexOf(`"pages":[`) + `"pages":[`.length;
        }

        // Get the keys and values for each page
        if (pageStarted && generatedText.includes(`}`)) {
            for (const key of propertyParsingListNames) {
                const pattern = `"${key}":`;
                const startIdx = generatedText.indexOf(pattern);

                if (startIdx === -1) continue;

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

                (pageList[currentPageIndex] as any)[key] = value;
            }

            currentPageIndex++;
            textIndex = newText.indexOf(`}`, textIndex) + 1;
        }
    });

    await testGenerateText();

    // Signal the end of the stream (Optional)
    console.log("DONE: testGenerateText")
    console.log(keyValueMap, pageList)
}

export function createTitlePage() {
    // Your logic here
}

export function createPage() {
    // Your logic here
}