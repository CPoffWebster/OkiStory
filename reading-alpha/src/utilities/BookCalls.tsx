import { Book } from "../classes/book";
import { environ } from "../config";

/**
 *
 * @param dataForBookCreation
 * @returns
 */
export const createNewBook = async (
  dataForBookCreation: Book | null
): Promise<Book> => {
  const response = await fetch(`${environ.API_URL}/api/createNewBook`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataForBookCreation),
  });

  // Mimic delay
  const delay = (ms: number | undefined) =>
    new Promise((res) => setTimeout(res, ms));
  await delay(3000);

  const data = await response.json();
  return data.book;
};

/**
 *
 * @param bookId
 * @returns
 */
export const getBook = async (bookId: string): Promise<Book> => {
  const response = await fetch(`${environ.API_URL}/api/getBook/${bookId}`);
  const data = await response.json();
  return data.book;
};
