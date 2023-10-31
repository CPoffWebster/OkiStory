import React, { useEffect, useState } from "react";
import styles from "./books.module.css";
import { arrowLeftIcon, arrowRightIcon } from "@/data/icons";
import { useRouter } from "next/router";
import axios from "axios";
import { BooksAttributes } from "@/services/database/models/Books";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import Image from "next/image";
import { getBooks } from "@/services/books";
import { headers } from "next/headers";

const numberOfBooks = 3;

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const session = await getSession(context);
//   const userEmail =
//     session && session.user ? (session.user.email as string) : "";

//   // const booksBatch = await getBooks(userEmail, numberOfBooks, 0);
//   const booksBatch = await axios
//     .post("/api/read/getUserBooks", {
//       count: numberOfBooks,
//       offset: 0,
//     })
//     .then((res) => res.data.bookList);
//   // console.log("LOOK HERE FOR BOOKS", booksBatch);
//   return {
//     props: { userEmail, booksBatch },
//   };
// };

export default function BookShelf() {
  const router = useRouter();
  const session = useSession();
  console.log("Frontend session:", session);
  const [skipBooks, setSkipBooks] = useState<number>(0); // [0, 3, 6, 9, 12, 15, 18, 21, 24, 27
  const [books, setBooks] = useState<BooksAttributes[] | null>(null);

  // const handleBack = (): void => {
  //   router.push("/");
  //   return;
  // };

  // const handleSelectElement = (book: BooksAttributes): void => {
  //   router.push(`/read/${book.GUID}`);
  // };

  // Initial load of books
  useEffect(() => {
    if (!session.data?.user) return;

    const getBooks = async () => {
      const booksBatch = await axios.post("/api/read/getUserBooks", {
        userEmail: session.data?.user!.email,
        count: numberOfBooks,
        offset: 0,
      });
      // const booksBatch = await fetch("http://localhost:3000/api/projects", {
      //   method: "GET",
      //   headers: headers(),
      // });
      console.log("get books", booksBatch);
      // console.log("get books", booksBatch.data.bookList);
      // setBooks(booksBatch.data.bookList);
    };
    getBooks();
  }, [session]);

  // Load next batch of books
  const handleNextBooks = async (direction: string) => {
    let newSkipBooks = 0;
    if (direction === "back") newSkipBooks = skipBooks - numberOfBooks;
    if (direction === "forward") newSkipBooks = skipBooks + numberOfBooks;
    setSkipBooks(newSkipBooks);

    const booksBatch = await axios.post("/api/read/getUserBooks", {
      userEmail: session.data?.user!.email,
      count: numberOfBooks,
      offset: newSkipBooks,
    });
    setBooks(booksBatch.data.bookList);
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
          onClick={() => handleNextBooks("back")}
          className={`${styles.leftClick} ${["clickable-container-small"]}`}
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
          onClick={() => handleNextBooks("forward")}
          className={`${styles.leftClick} ${["clickable-container-small"]}`}
        >
          {arrowRightIcon}
        </span>
      </div>
    </div>
  );
}
