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
    const pageList: generatedTextPage[] = [];
    const keyValueMap = new Map<string, string>();

    parser.on('key', (key: string) => {
        currentKey = key;
    });

    parser.on('value', (value: any) => {
        if (currentKey !== null) {
            // console.log(`Received complete value for key ${currentKey}: ${value}`);


            // if (currentKey === 'pageNumber') console.log(`Received complete value for key ${currentKey}: ${value}`);
            if (!pageStarted && currentKey === 'pages') {
                console.log('HIT HERE', `Received complete value for key ${currentKey}: ${value}`)
                pageStarted = true;
                console.log(keyValueMap)
            }

            if (!keyValueMap.has(currentKey)) {
                if (typeof value === 'string' && value.includes('{')) return;

                if (!pageStarted) {
                    keyValueMap.set(currentKey, value);
                } else {
                    if (currentKey === 'pageNumber') mostRecentPage = value;
                    if (pageList[mostRecentPage] === null) pageList[mostRecentPage] = new generatedTextPage();
                    (pageList[mostRecentPage] as { [key: string]: any })[currentKey] = value;
                    // keyValueMap.set(currentKey, value);
                }

                // console.log(keyValueMap)
            }
            // Your logic here
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
