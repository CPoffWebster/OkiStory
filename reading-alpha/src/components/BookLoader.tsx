import React, { useEffect } from "react";
import { Book } from "../classes/book";
import { environ } from "../config";

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
        const response = await fetch(`${environ.API_URL}/api/createNewBook`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataForBookCreation),
        });
        const data = await response.json();
        console.log("data: ", data);

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
