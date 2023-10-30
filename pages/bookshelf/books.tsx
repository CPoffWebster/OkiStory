import React, { useEffect, useState } from "react";
import styles from "./books.module.css";
import { arrowLeftIcon, arrowRightIcon } from "@/data/icons";
import { useRouter } from "next/router";
import axios from "axios";
import { BooksAttributes } from "@/services/database/models/Books";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Image from "next/image";
import { getBooks } from "@/services/books";

const numberOfBooks = 3;
const numberOfBooksToSkip = 0;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const userEmail =
    session && session.user ? (session.user.email as string) : "";

  const booksBatch = await getBooks(userEmail, numberOfBooks, 0);
  return {
    props: { userEmail, booksBatch },
  };
};

export default function BookShelf(props: {
  userEmail: string;
  booksBatch: BooksAttributes[];
}) {
  const router = useRouter();
  const [skipBooks, setSkipBooks] = useState<number>(0); // [0, 3, 6, 9, 12, 15, 18, 21, 24, 27
  const [books, setBooks] = useState<BooksAttributes[] | null>(
    props.booksBatch
  );

  const handleBack = (): void => {
    router.push("/");
    return;
  };

  const handleSelectElement = (book: BooksAttributes): void => {
    const serializedData = encodeURIComponent(JSON.stringify(book));
    router.push(`/read/${book.GUID}`);
  };

  const handleNextBooks = async (): Promise<void> => {
    // setSkipBooks(skipBooks + numberOfBooks);
    // const booksBatch = await getBooks(
    //   props.userEmail,
    //   numberOfBooks,
    //   skipBooks + numberOfBooks
    // );
    // setBooks(booksBatch);
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
        <span
          onClick={handleNextBooks}
          className={`${styles.leftClick} ${["clickable-container-small"]}`}
        >
          {arrowLeftIcon}
        </span>
        {books &&
          books.map((book, index) => (
            <span onClick={() => handleSelectElement(book)} key={index}>
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
          onClick={handleNextBooks}
          className={`${styles.leftClick} ${["clickable-container-small"]}`}
        >
          {arrowRightIcon}
        </span>
      </div>
    </div>
  );
}
