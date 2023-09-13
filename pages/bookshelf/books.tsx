import React, { useEffect, useState } from "react";
import Link from "next/link";
// import fetchBooks from '../api/fetchBooks';  // Replace with your actual API
import "./books.css";
import { arrowLeftIcon } from "@/data/icons";

const testBook = {
  title: "Test Book",
};

export default function BookShelf() {
  const [books, setBooks] = useState([testBook, testBook, testBook]); // State to hold books

  useEffect(() => {
    // Simulate fetching the access token; replace with your actual method
    const accessToken = "your_access_token_here";

    // Fetch books
    // fetchBooks(accessToken).then(data => {
    //   setBooks(data);
    // });
  }, []);

  return (
    <div className="container">
      <div className="header">
        <Link href="/">{arrowLeftIcon}</Link>
        <h1>My Book Shelf</h1>
        <div></div> {/* Empty div for layout balance */}
      </div>

      <ul className="book-list">
        {books.map((book, index) => (
          <li key={index} className="book-list-item">
            {book.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
