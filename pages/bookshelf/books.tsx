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

  const handleSelectElement = (book: BooksAttributes): void => {
    const serializedData = encodeURIComponent(JSON.stringify(book));
    router.push(`/read/${book.GUID}`);
  };

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
        <div></div>
      </div>
      <div className={styles["selection-container"]}>
        {books ? (
          books.map((book, index) => (
            <span onClick={() => handleSelectElement(book)} key={index}>
              <div
                className={`${styles["selection"]} ${[
                  "clickable-container-large",
                ]}`}
              >
                <img
                  src={`/api/images/getImage?filename=${book.imageGCSLocation}&imageType=book`}
                  alt="Book cover"
                  loading="lazy"
                />
              </div>
              <span className={styles["section-name"]}>
                {book.Title} {book.id}
              </span>
            </span>
          ))
        ) : (
          <li>Loading...</li>
        )}
      </div>
    </div>
  );
}
