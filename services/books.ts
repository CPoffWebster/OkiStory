import sequelize from "sequelize/lib/sequelize";
import { Books, BooksAttributes } from "./database/models/Books";
import { ImageGenerations } from "./database/models/ImageGenerations";
import { Pages, PagesAttributes } from "./database/models/Pages";
import { Transaction } from 'sequelize';
import { connectToDb } from "./database/database";
import { Locations, LocationsAttributes } from "./database/models/Locations";
import { Characters, CharactersAttributes } from "./database/models/Characters";

/**
 * Get the bookshelf list of books for a user
 * @param userID 
 * @param count x number of books
 * @param offset x number of books to skip
 * @returns 
 */
export async function getUserBooks(userID: number, count: number, offset: number): Promise<[number, BooksAttributes[]]> {
    const db = connectToDb();
    const transaction = await db.transaction();
    try {
        const [userTotal, defaultTotal] = await Promise.all([
            Books.count({ where: { UserID: userID }, transaction }),
            Books.count({ where: { DefaultBook: true }, transaction })
        ]);

        // Fetch user's books
        let books = await Books.getUserBooks(userID, count, offset, transaction);
        if (books === null) books = [];

        // Calculate the number of user-specific books that have been skipped or displayed
        const userBooksFetched = Math.min(userTotal, offset + count);

        // Check if all user-specific books are fetched
        if (userBooksFetched >= userTotal) {
            // Calculate new offset for default books
            const defaultBooksOffset = Math.max(0, offset - userTotal);

            // Calculate how many more books are needed to meet the count
            const remainingCount = count - books.length;

            // Fetch default books with the new offset
            const defaultBooks = await Books.getDefaultBooks(remainingCount, defaultBooksOffset, transaction);
            if (defaultBooks !== null) {
                books = [...books, ...defaultBooks];
            }
        }

        const updatedBooks = await addImageGCSLocationArray(books, transaction) as BooksAttributes[];
        await transaction.commit(); // Commit the transaction
        return [userTotal + defaultTotal, updatedBooks];
    } catch (error) {
        await transaction.rollback(); // Rollback the transaction in case of error
        throw error;
    }
}

/**
 * Get the bookshelf list of default books available for all users
 * @param count x number of books
 * @param offset x number of books to skip
 * @returns 
 */
export async function getDefaultBooks(count: number, offset: number): Promise<[number, BooksAttributes[]]> {
    const db = connectToDb();
    const transaction = await db.transaction();
    try {
        const defaultTotal = await Books.count({
            where: { DefaultBook: true },
            transaction: transaction
        });
        const books = await Books.getDefaultBooks(count, offset, transaction);
        if (books === null) return [0, []];

        const updatedBooks = await addImageGCSLocationArray(books, transaction) as BooksAttributes[];
        await transaction.commit(); // Commit the transaction
        return [defaultTotal, updatedBooks];
    } catch (error) {
        await transaction.rollback(); // Rollback the transaction in case of error
        throw error;
    }
}

/**
 * Get a book and its pages by its GUID
 * @param guid 
 * @returns 
 */
export async function getBookByGUID(guid: string): Promise<[BooksAttributes | null, PagesAttributes[] | null, LocationsAttributes | null, CharactersAttributes | null]> {
    const db = connectToDb();
    const transaction = await db.transaction();
    try {
        let book = await Books.getBook(guid, transaction);
        if (book === null) return [null, null, null, null];
        book = await addImageGCSLocation(book, transaction) as BooksAttributes;
        let location: LocationsAttributes = await Locations.getLocation(book.LocationGUID, transaction);
        let character: CharactersAttributes = await Characters.getCharacter(book.CharacterGUID, transaction);

        let pages = await Pages.getBookPages(book.id!, transaction);
        if (pages === null) return [book, null, location, character];
        pages = await addImageGCSLocationArray(pages, transaction) as PagesAttributes[];

        await transaction.commit(); // Commit the transaction
        return [book, pages, location, character];
    } catch (error) {
        await transaction.rollback(); // Rollback the transaction in case of error
        throw error;
    }
}

// Modified addImageGCSLocationArray to use a transaction
async function addImageGCSLocationArray(books: (BooksAttributes | PagesAttributes)[], transaction: Transaction): Promise<(BooksAttributes | PagesAttributes)[]> {
    const updatedBooks = await Promise.all(
        books.map(async (book) => {
            return await addImageGCSLocation(book, transaction); // Pass the transaction to the function
        })
    );
    return updatedBooks as unknown as Promise<(BooksAttributes | PagesAttributes)[]>;
}

// Modified addImageGCSLocation to accept a transaction
async function addImageGCSLocation(imageUpdate: (BooksAttributes | PagesAttributes), transaction: Transaction | null = null) {
    const imageGeneration = await ImageGenerations.getGeneration(imageUpdate.GeneratedImageID!, transaction); // Use the transaction
    imageUpdate.imageGCSLocation = imageGeneration?.GCSLocation ? `${imageGeneration?.GCSLocation}` : undefined;
    imageUpdate.imageError = imageGeneration?.Error ? true : false;
    return imageUpdate;
}