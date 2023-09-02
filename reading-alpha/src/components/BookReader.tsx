import { useState } from "react";
import { Book } from "../classes/book";

interface ReadBook {
  fullBook: Book;
}

const BookReader: React.FC<ReadBook> = ({ fullBook }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const book = fullBook!.generatedBook!;
  const totalPages = book.pages.length;

  return (
    <div className="App">
      <div className="container">
        <div className="left">
          <img
            src={
              currentPage === 0
                ? book.cover
                : book.pages[currentPage - 1].picture
            }
            alt="cover"
          />
        </div>
        <div className="right">
          {currentPage === 0 ? (
            <h1>{book.title}</h1>
          ) : (
            <p>{book.pages[currentPage - 1].text}</p>
          )}
        </div>
      </div>
      <div className="navigation">
        <button
          disabled={currentPage <= 0}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          ←
        </button>
        <button
          disabled={currentPage >= totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          →
        </button>
      </div>
    </div>
  );
};

export default BookReader;
