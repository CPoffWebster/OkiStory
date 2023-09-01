import React, { useEffect } from "react";
import { Book } from "../classes/book";

interface BookCreation {
  dataForBookCreation: Book | null;
  createFullBook: (newBook: Book) => void;
}

const BookLoader: React.FC<BookCreation> = ({
  createFullBook,
  dataForBookCreation,
}) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://www.example.com/api/books", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataForBookCreation),
        });
        const data = await response.json();

        createFullBook(data);
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
