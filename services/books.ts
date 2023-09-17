import { exampleBook, examplePages } from "@/static-examples/exampleBook";
import { BooksAttributes } from "./database/models/Books";

/**
 * Create a new book using data from the BookCreation workflow
 * @param dataForBookCreation data from the BookCreation workflow
 * @returns created book data
 */
export async function createNewBook(locationGUID: string, characterGUID: string): Promise<BooksAttributes> {
    // console.log(`createNewBook: locationGUID: ${locationGUID}, characterGUID: ${characterGUID}`)

    // Mimic delay
    await delay(3000)

    return exampleBook;
};

/**
 *
 * @param bookID
 * @returns
 */
export async function getBook(bookGUID: string): Promise<BooksAttributes> {
    // console.log(`getBook: bookGUID: ${bookGUID}`)

    // Mimic delay
    await delay()

    return exampleBook;
};

export async function getPage(bookGUID: string, pageNumber: number) {
    // console.log(`getPage: bookGUID: ${bookGUID}, pageNumber: ${pageNumber}`)

    // Mimic delay
    await delay()

    return examplePages[pageNumber - 1];
}

async function delay(timeout: number = 1000) {
    // Mimic delay
    const delay = (ms: number | undefined) =>
        new Promise((res) => setTimeout(res, ms));
    await delay(timeout);
    return;
}