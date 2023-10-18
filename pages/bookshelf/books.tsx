import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./books.module.css";
import { arrowLeftIcon } from "@/data/icons";
import { useRouter } from "next/router";
import axios from "axios";
import { BooksAttributes } from "@/services/database/models/Books";

export default function BookShelf() {
  const router = useRouter();
  const [books, setBooks] = useState<BooksAttributes[] | null>(null); // State to hold books

  const handleBack = (): void => {
    router.push("/");
    return;
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.post("/api/read/getUserBooks", {
        userID: 1,
        count: 3,
        offset: 0,
      });
      setBooks(response.data.bookList);
    };
    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
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
        {books ? (
          books.map((book, index) => (
            <li key={index} className={styles["book-list-item"]}>
              {book.Title} {book.id}
              {/* todo add default image */}
              <img
                src={`/api/images/getImage?filename=${book.imageGCSLocation}&imageType=book`}
                alt="Book cover"
                loading="lazy"
              />
            </li>
          ))
        ) : (
          <li>Loading...</li>
        )}
      </ul>
    </div>
  );
}
