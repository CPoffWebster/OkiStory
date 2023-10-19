import { exampleBook, examplePages } from "@/static-examples/exampleBook";
import { Books, BooksAttributes } from "./database/models/Books";
import { ImageGenerations } from "./database/models/ImageGenerations";
import { booksBucket, getStorage } from "./storage";
import { Pages, PagesAttributes } from "./database/models/Pages";

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
 * Get the bookshelf list of books for a user
 * @param userID 
 * @param count x number of books
 * @param offset x number of books to skip
 * @returns 
 */
export async function getBooks(userID: number, count: number, offset: number) {
    const books = await Books.getUserBooks(userID, count, offset);
    if (books === null) return null;

    const booksWithPhotoLocation = await Promise.all(
        books.map(async (book) => {
            // const storage = getStorage();
            const imageGeneration = await ImageGenerations.getGeneration(book.GeneratedImageID);
            book.imageGCSLocation = `${imageGeneration?.GCSLocation}`;
            return book;
        })
    );

    return booksWithPhotoLocation;
}

/**
 * Get a book by its GUID
 * @param guid 
 * @returns 
 */
export async function getBookByGUID(guid: string): Promise<BooksAttributes | null> {
    const book = await Books.getBook(guid);
    if (book === null) return null;

    const imageGeneration = await ImageGenerations.getGeneration(book.GeneratedImageID);
    book.imageGCSLocation = `${imageGeneration?.GCSLocation}`;
    return book;
}

/**
 * Get the pages for a book
 * @param bookID 
 * @returns 
 */
export async function getPagesByBookId(bookID: number): Promise<PagesAttributes[] | null> {
    const pages = await Pages.getBookPages(bookID);
    if (pages === null) return null;

    const pagesWithPhotoLocation = await Promise.all(
        pages.map(async (page) => {
            // const storage = getStorage();
            const imageGeneration = await ImageGenerations.getGeneration(page.GeneratedImageID);
            page.imageGCSLocation = `${imageGeneration?.GCSLocation}`;
            return page;
        })
    );

    return pagesWithPhotoLocation;
}