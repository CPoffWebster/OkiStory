import { connectToDb } from "./database/database";
import { Books, BooksAttributes } from "./database/models/Books";
import { ImageGenerations } from "./database/models/ImageGenerations";
import { Pages, PagesAttributes } from "./database/models/Pages";

/**
 * Get the bookshelf list of books for a user
 * @param userEmail 
 * @param count x number of books
 * @param offset x number of books to skip
 * @returns 
 */
export async function getBooks(userEmail: string, count: number, offset: number) {
    connectToDb();
    const books = await Books.getUserBooks(userEmail, count, offset);
    if (books === null) return null;

    const booksWithPhotoLocation = await Promise.all(
        books.map(async (book) => {
            // const storage = getStorage();
            const imageGeneration = await ImageGenerations.getGeneration(book.GeneratedImageID!);
            book.imageGCSLocation = imageGeneration?.GCSLocation ? `${imageGeneration?.GCSLocation}` : undefined;
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

    const imageGeneration = await ImageGenerations.getGeneration(book.GeneratedImageID!);
    book.imageGCSLocation = imageGeneration?.GCSLocation ? `${imageGeneration?.GCSLocation}` : undefined;
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
            page.imageGCSLocation = imageGeneration?.GCSLocation ? `${imageGeneration?.GCSLocation}` : undefined;
            return page;
        })
    );

    return pagesWithPhotoLocation;
}