import Workflow from "./BookCreation/Workflow";
import { Book } from "../classes/book";
import { useState } from "react";
import BookLoader from "./BookLoader";

const HomePage = () => {
  const [book, setBook] = useState<Book | null>(null);

  const handleBookCreation = (newBook: Book): void => {
    setBook(newBook);
    console.log(newBook);
  };

  return (
    <>
      {book !== null && book.created === true && <h1>Book Created</h1>}
      {book !== null && book.created === false && (
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
