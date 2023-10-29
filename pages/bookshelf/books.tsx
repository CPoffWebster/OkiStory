import React, { useEffect, useState } from "react";
import styles from "./books.module.css";
import { arrowLeftIcon, arrowRightIcon } from "@/data/icons";
import { useRouter } from "next/router";
import axios from "axios";
import { BooksAttributes } from "@/services/database/models/Books";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import Image from "next/image";
import { connectToDb } from "@/services/database/database";
import { getBooks } from "@/services/books";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const userEmail =
    session && session.user ? (session.user.email as string) : "";

  connectToDb();
  const booksBatch = await getBooks(userEmail, 3, 0);
  return {
    props: { userEmail, booksBatch },
  };
};

export default function BookShelf(props: {
  userEmail: string;
  booksBatch: BooksAttributes[];
}) {
  const router = useRouter();
  const [books, setBooks] = useState<BooksAttributes[]>(props.booksBatch); // State to hold books
  const handleBack = (): void => {
    router.push("/");
    return;
  };
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
        <span
          onClick={handleBack}
          className={`${styles.leftClick} ${["clickable-container-small"]}`}
        >
          {arrowLeftIcon}
        </span>
        {books.map((book, index) => (
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
          onClick={handleBack}
          className={`${styles.leftClick} ${["clickable-container-small"]}`}
        >
          {arrowRightIcon}
        </span>
      </div>
    </div>
  );
}
