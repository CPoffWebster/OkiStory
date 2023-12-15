import sequelize from "sequelize/lib/sequelize";
import { Books, BooksAttributes } from "./database/models/Books";
import { ImageGenerations } from "./database/models/ImageGenerations";
import { Pages, PagesAttributes } from "./database/models/Pages";
import { Transaction } from 'sequelize';
import { connectToDb } from "./database/database";

/**
 * Get the bookshelf list of books for a user
 * @param userID 
 * @param count x number of books
 * @param offset x number of books to skip
 * @returns 
 */
export async function getUserBooks(userID: number, count: number, offset: number): Promise<[number, BooksAttributes[]]> {
    // create a transaction to get both the count of the user books and the count of the default books
    const db = connectToDb();
    const transaction = await db.transaction();
    const [userTotal, defaultTotal] = await Promise.all([
        Books.count({ where: { UserID: userID }, transaction }),
        Books.count({ where: { DefaultBook: true }, transaction })
    ]);

    // Fetch user's books
    let books = await Books.getUserBooks(userID, count, offset, transaction);
    if (books === null) books = [];

    await transaction.commit(); // Commit the transaction

    // Calculate the number of user-specific books that have been skipped or displayed
    const userBooksFetched = Math.min(userTotal, offset + count);

    // Check if all user-specific books are fetched
    if (userBooksFetched >= userTotal) {
        // Calculate new offset for default books
        const defaultBooksOffset = Math.max(0, offset - userTotal);

        // Calculate how many more books are needed to meet the count
        const remainingCount = count - books.length;

        // Fetch default books with the new offset
        const defaultBooks = await Books.getDefaultBooks(remainingCount, defaultBooksOffset);
        if (defaultBooks !== null) {
            books = [...books, ...defaultBooks];
        }
    }

    return [userTotal + defaultTotal, await addImageGCSLocationArray(books) as BooksAttributes[]];
}

/**
 * Get the bookshelf list of default books available for all users
 * @param count x number of books
 * @param offset x number of books to skip
 * @returns 
 */
export async function getDefaultBooks(count: number, offset: number): Promise<[number, BooksAttributes[]]> {
    const defaultTotal = await Books.count({
        where: {
            DefaultBook: true
        }
    });
    const books = await Books.getDefaultBooks(count, offset);
    if (books === null) return [0, []];

    return [defaultTotal, await addImageGCSLocationArray(books) as BooksAttributes[]];
}

/**
 * Get a book by its GUID
 * @param guid 
 * @returns 
 */
export async function getBookByGUID(guid: string): Promise<BooksAttributes | null> {
    const book = await Books.getBook(guid);
    if (book === null) return null;
    return await addImageGCSLocation(book) as BooksAttributes;
}

/**
 * Get the pages for a book
 * @param bookID 
 * @returns 
 */
export async function getPagesByBookId(bookID: number): Promise<PagesAttributes[] | null> {
    const pages = await Pages.getBookPages(bookID);
    if (pages === null) return null;
    return await addImageGCSLocationArray(pages) as PagesAttributes[];
}

// Modified addImageGCSLocationArray to use a transaction
async function addImageGCSLocationArray(books: (BooksAttributes | PagesAttributes)[]): Promise<(BooksAttributes | PagesAttributes)[]> {
    const db = connectToDb();
    const transaction = await db.transaction();
    try {
        const updatedBooks = await Promise.all(
            books.map(async (book) => {
                return await addImageGCSLocation(book, transaction); // Pass the transaction to the function
            })
        );
        await transaction.commit(); // Commit the transaction
        return updatedBooks as unknown as Promise<(BooksAttributes | PagesAttributes)[]>;
    } catch (error) {
        await transaction.rollback(); // Rollback the transaction in case of error
        throw error;
    }
}

// Modified addImageGCSLocation to accept a transaction
async function addImageGCSLocation(imageUpdate: (BooksAttributes | PagesAttributes), transaction: Transaction | null = null) {
    const imageGeneration = await ImageGenerations.getGeneration(imageUpdate.GeneratedImageID!, transaction); // Use the transaction
    imageUpdate.imageGCSLocation = imageGeneration?.GCSLocation ? `${imageGeneration?.GCSLocation}` : undefined;
    imageUpdate.imageError = imageGeneration?.Error ? true : false;
    return imageUpdate;
}