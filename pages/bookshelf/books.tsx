import React, { useEffect, useState } from "react";
import Link from "next/link";
// import fetchBooks from '../api/fetchBooks';  // Replace with your actual API
import styles from "./books.module.css";
import { arrowLeftIcon } from "@/data/icons";
import { useRouter } from "next/router";

const testBook = {
  title: "Test Book",
};

export default function BookShelf() {
  const router = useRouter();
  const [books, setBooks] = useState([testBook, testBook, testBook]); // State to hold books

  const handleBack = (): void => {
    router.push("/");
    return;
  };

  useEffect(() => {
    // Simulate fetching the access token; replace with your actual method
    const accessToken = "your_access_token_here";

    // Fetch books
    // fetchBooks(accessToken).then(data => {
    //   setBooks(data);
    // });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {/* <Link href="/">{arrowLeftIcon}</Link> */}
        <span
          onClick={handleBack}
          className={`${styles.leftClick} ${["clickable-container-small"]}`}
        >
          {arrowLeftIcon}
        </span>
        <h2 className={styles.title}>My Book Shelf</h2>
        <div></div> {/* Empty div for layout balance */}
      </div>
      <ul className={styles["book-list"]}>
        {books.map((book, index) => (
          <li key={index} className={styles["book-list-item"]}>
            {book.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
