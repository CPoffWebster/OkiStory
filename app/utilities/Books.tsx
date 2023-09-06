import { Book } from "../classes/book";

/**
 * Create a new book using data from the BookCreation workflow
 * @param dataForBookCreation data from the BookCreation workflow
 * @returns created book data
 */
export const createNewBook = async (
  dataForBookCreation: Book | null
): Promise<Book> => {
  const response = await fetch(`/api/createNewBook`, {
    method: "POST",
    body: JSON.stringify(dataForBookCreation),
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
 * @param bookId
 * @returns
 */
export const getBook = async (bookId: string): Promise<Book> => {
  const response = await fetch(`/api/getBook/${bookId}`);
  const data = await response.json();
  return data.book;
};
