import { BooksAttributes } from "./database/models/Books";

/**
 * Create a new book using data from the BookCreation workflow
 * @param dataForBookCreation data from the BookCreation workflow
 * @returns created book data
 */
export async function createNewBook(locationID: number, characterID: number): Promise<BooksAttributes> {
    const response = await fetch(`/api/createNewBook`, {
        method: "POST",
        body: JSON.stringify({
            locationID,
            characterID
        }),
    });

    // Mimic delay
    const delay = (ms: number | undefined) =>
        new Promise((res) => setTimeout(res, ms));
    await delay(1000);

    const data = await response.json();
    return data.book;
};

/**
 *
 * @param bookID
 * @returns
 */
export async function getBook(bookID: number): Promise<BooksAttributes> {
    const response = await fetch(`/api/getBook/${bookID}`);
    const data = await response.json();
    return data.book;
};
