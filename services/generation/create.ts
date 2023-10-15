import * as clarinet from 'clarinet';
import { generatedTextPage, testGenerateText, textGenerationEmitter } from "./chatGPT";

interface CustomCStream extends clarinet.CStream {
    write(chunk: string): void;
    end(chunk?: string): void;
}

const parser = clarinet.createStream() as CustomCStream;

let isErrorHandled = false;  // Flag to control the flow

export async function createBook() {
    await createBookInRealTime();
}

async function createBookInRealTime() {
    console.log('START: createBookInRealTime')

    let currentKey: string | null = null;

    // Page streaming variables
    let pageStarted = false;
    let mostRecentPage = 0;
    let pageList: generatedTextPage[] = [];
    const keyValueMap = new Map<string, string>();

    // Log when an object or array opens or closes
    parser.on('openobject', (key: string) => {
        // console.log(`openobject: ${key}`);
        // parsingLogic(key, 'pageNumber');
    });

    parser.on('key', (key: string) => {
        console.log(key)
        currentKey = key;
    });

    function parsingLogic(currentKey: string, value: any) {
        if (!pageStarted && currentKey === 'pages') {
            console.log('SETTING TO PAGES...', `Received complete value for key ${currentKey}: ${value}`)
            pageStarted = true;

            // pageList = new Array(keyValueMap.get('pageCount') as unknown as number);
            // Create pageList with of length "pageCount" all with empty objects
            // In python this would be: pageList = [{} for i in range(pageCount)]
            pageList = Array.from({ length: keyValueMap.get('pageCount') as unknown as number }, () => ({} as generatedTextPage));
        }

        if (!keyValueMap.has(currentKey)) {
            if (typeof value === 'string' && value.includes('{')) return;

            if (!pageStarted) {
                keyValueMap.set(currentKey, value);
            } else {
                if (currentKey === 'pageNumber') mostRecentPage = value;
                (pageList[mostRecentPage] as { [key: string]: any })[currentKey] = value;
            }
        }

        // Your logic here
    }

    parser.on('value', (value: any) => {
        if (currentKey !== null) {
            parsingLogic(currentKey, value);
        }
        currentKey = null;
    });

    parser.on('error', (e: Error) => {
        if (!isErrorHandled) {
            console.log(`Parse error: ${e}`);
            isErrorHandled = true;  // Set the flag to true
            parser.end();  // Terminate the parser stream
        }
    });

    textGenerationEmitter.on('textGenerated', (newText: string) => {
        // {"pageCount":3,"pages":[{"pageNumber":1,"text":"tex 1","imageDescription":"img1"},{"pageNumber":2,"text":"tex 2","imageDescription":"img2"},{"pageNumber":4,"text":"tex 4","imageDescription":"img3"}]}
        parser.write(newText);
    });

    await testGenerateText();

    // Signal the end of the stream (Optional)
    console.log("DONE: testGenerateText")
    console.log(keyValueMap, pageList)
    parser.end();
}

export function createTitlePage() {
    // Your logic here
}

export function createPage() {
    // Your logic here
}
