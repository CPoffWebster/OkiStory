import React, { useEffect } from "react";
import { Book } from "../classes/book";
import { createNewBook } from "../utilities/BookCalls";
import "./BookLoader.css";

interface BookCreation {
  createFullBook: (newBook: Book) => void;
  dataForBookCreation: Book | null;
}

const BookLoader: React.FC<BookCreation> = ({
  createFullBook,
  dataForBookCreation,
}) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const newBook = await createNewBook(dataForBookCreation);
        createFullBook(newBook);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [createFullBook, dataForBookCreation]);

  return (
    <div>
      <h1>BookLoader</h1>
    </div>
  );
};

export default BookLoader;
