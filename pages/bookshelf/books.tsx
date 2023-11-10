import React, { useEffect, useState } from "react";
import styles from "./books.module.css";
import { arrowLeftIcon, arrowRightIcon } from "@/data/icons";
import { useRouter } from "next/router";
import axios from "axios";
import { BooksAttributes } from "@/services/database/models/Books";
import { useSession } from "next-auth/react";
import Image from "next/image";

const numberOfBooks = 3;

export default function BookShelf() {
  const router = useRouter();
  const session = useSession();
  const [skipBooks, setSkipBooks] = useState<number>(0); // [0, 3, 6, 9, 12, 15, 18, 21, 24, 27
  const [books, setBooks] = useState<BooksAttributes[] | null>(null);
  const [totalUserBooks, setTotalUserBooks] = useState<number>(0);

  // Get books from database
  const getBooks = async (offset: number) => {
    const booksBatch = await axios.post("/api/read/getUserBooks", {
      apiKey: process.env.NEXT_PUBLIC_API_KEY,
      count: numberOfBooks,
      offset: offset,
    });
    console.log(booksBatch);
    setBooks(booksBatch.data.bookList);
    setTotalUserBooks(booksBatch.data.totalBooks);
  };

  // Initial load of books
  useEffect(() => {
    // if (!session.data?.user) return;
    getBooks(0);
  }, [session]);

  // Load next batch of books
  const handleNextBooks = async (direction: string) => {
    let newSkipBooks = 0;
    if (direction === "back") newSkipBooks = skipBooks - numberOfBooks;
    if (direction === "forward") newSkipBooks = skipBooks + numberOfBooks;
    setSkipBooks(newSkipBooks);
    getBooks(newSkipBooks);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span
          onClick={() => router.push("/")}
          className={`${styles.leftClick} ${["clickable-container-small"]}`}
        >
          {arrowLeftIcon}
        </span>
        <h2 className={styles.title}>My Book Shelf</h2>
        <div></div>
      </div>
      <div className={styles["selection-container"]}>
        <span
          className={`${["clickable-container-small"]} ${
            skipBooks === 0 ? styles.disabled : ""
          }`}
          onClick={() => handleNextBooks("back")}
        >
          {arrowLeftIcon}
        </span>
        {books &&
          books.map((book, index) => (
            <span onClick={() => router.push(`/read/${book.GUID}`)} key={index}>
              <div
                className={`${styles["selection"]} ${[
                  "clickable-container-large",
                ]}`}
              >
                <div className={styles["cover-image"]}>
                  <Image
                    src={`/api/images/getImage?filename=${book.imageGCSLocation}&imageType=book`}
                    layout="fill"
                    objectFit="contain"
                    priority={true}
                    alt={"Book cover"}
                  />
                </div>
              </div>
              <span className={styles["section-name"]}>
                {book.Title} {book.id}
              </span>
            </span>
          ))}
        <span
          className={`${["clickable-container-small"]} ${
            skipBooks + 3 >= totalUserBooks ? styles.disabled : ""
          }`}
          onClick={() => handleNextBooks("forward")}
        >
          {arrowRightIcon}
        </span>
      </div>
    </div>
  );
}
