import { exampleBook, examplePages } from "@/static-examples/exampleBook";
import { Books, BooksAttributes } from "./database/models/Books";
import { ImageGenerations } from "./database/models/ImageGenerations";
import { booksBucket, getStorage } from "./storage";

/**
 * Create a new book using data from the BookCreation workflow
 * @param dataForBookCreation data from the BookCreation workflow
 * @returns created book data
 */
export async function createNewBook(locationGUID: string, characterGUID: string): Promise<BooksAttributes> {
    // console.log(`createNewBook: locationGUID: ${locationGUID}, characterGUID: ${characterGUID}`)

    // Mimic delay
    await new Promise((res) => setTimeout(res, 3000));

    return exampleBook;
};

/**
 * 
 * @param userID 
 * @param count 
 * @param offset 
 * @returns 
 */
export async function getBooks(userID: number, count: number, offset: number) {
    const books = await Books.getUserBooks(userID, count, offset);
    if (books === null) return null;

    const booksWithPhotoStream = await Promise.all(
        books.map(async (book) => {
            // const storage = getStorage();
            const imageGeneration = await ImageGenerations.getGeneration(book.GeneratedImageID);
            // const imageStream = await storage.getReadStream(`gs://${booksBucket}/${imageGeneration?.GCSLocation}`);
            book.imageGCSLocation = `${imageGeneration?.GCSLocation}`;
            return book;
        })
    );

    return booksWithPhotoStream;
}

export async function getPage(bookGUID: string, pageNumber: number) {
    // console.log(`getPage: bookGUID: ${bookGUID}, pageNumber: ${pageNumber}`)

    // Mimic delay
    await new Promise((res) => setTimeout(res, 3000));

    return examplePages[pageNumber - 1];
}