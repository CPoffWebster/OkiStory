"use client";
import Workflow from "./BookCreation/Workflow";
import { Book } from "../classes/book";
import { useEffect, useState } from "react";
import BookLoader from "./BookCreation/BookLoading/BookLoader";
import BookReader from "./BookReader/BookReader";

const HomePage = () => {
  const [book, setBook] = useState<Book | null>(null);
  const [bookComplete, setBookComplete] = useState<boolean | null>(false); // Add this line

  const handleBookCreation = (newBook: Book): void => {
    setBook(newBook);
    if (!bookComplete && newBook.created === true) {
      setBookComplete(true);
    }
  };

  useEffect(() => {
    if (book !== null && book.created === true && !bookComplete) {
      setBookComplete(true);
    }
  }, [book, bookComplete]);

  return (
    <>
      {book !== null && book.created === true && <BookReader fullBook={book} />}
      {book !== null && !bookComplete && (
        <BookLoader
          createFullBook={handleBookCreation}
          dataForBookCreation={book}
        />
      )}
      {book === null && <Workflow sendBookInfo={handleBookCreation} />}
    </>
  );
};

export default HomePage;
