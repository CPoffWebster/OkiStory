import { useState, useEffect } from "react";
import { Book } from "../classes/book";
import { FlippingPages } from "flipping-pages";
import "flipping-pages/dist/style.css";
import "./BookReader.css"; // Make sure to include your CSS

interface ReadBook {
  fullBook: Book;
}

const BookReader: React.FC<ReadBook> = ({ fullBook }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const book = fullBook!.generatedBook!;
  const totalPages = book.pages.length;

  // For flipping pages
  const [selected, setSelected] = useState(0);

  // Update currentPage when selected changes and vice versa
  useEffect(() => {
    setCurrentPage(selected);
  }, [selected]);

  useEffect(() => {
    setSelected(currentPage);
  }, [currentPage]);

  const back = () => {
    setCurrentPage(Math.max(currentPage - 1, 0));
  };

  const next = () => {
    setCurrentPage(Math.min(currentPage + 1, totalPages - 1));
  };

  return (
    <div className="App">
      <div className="container">
        <FlippingPages
          direction="right-to-left"
          onSwipeEnd={setSelected}
          selected={selected}
        >
          <div className="page">
            <img src={book.cover} alt="cover" />
            <h1>{book.title}</h1>
          </div>
          {book.pages.map((page, index) => (
            <div className="page" key={index}>
              <img src={page.picture} alt={`page-${index}`} />
              <p>{page.text}</p>
            </div>
          ))}
        </FlippingPages>
      </div>
      <div className="navigation">
        <button disabled={currentPage <= 0} onClick={back}>
          ←
        </button>
        <button disabled={currentPage >= totalPages - 1} onClick={next}>
          →
        </button>
      </div>
      <div className="page-count">
        Page {currentPage + 1} of {totalPages}
      </div>
    </div>
  );
};

export default BookReader;
