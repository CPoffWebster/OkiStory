import React, { useEffect, useState } from "react";
import styles from "./books.module.css";
import { useRouter } from "next/router";
import axios from "axios";
import { BooksAttributes } from "@/services/database/models/Books";
import { useSession } from "next-auth/react";
import Image from "next/image";
import NavigationButtons from "@/app/components/Books/NavButtons";
import XDBook from "@/app/components/XDBook/XDBook";

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
      count: numberOfBooks,
      offset: offset,
    });
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
        <h2 className={styles.title}>My Book Shelf</h2>
      </div>
      <div className={styles["selection-container"]}>
        {books &&
          books.map((book, index) => (
            <div key={index} onClick={() => router.push(`/read/${book.GUID}`)}>
              <XDBook book={book} />
            </div>
            // <span onClick={() => router.push(`/read/${book.GUID}`)} key={index}>
            //   <div
            //     className={`${styles["selection"]} ${[
            //       "clickable-container-large",
            //     ]}`}
            //   >
            //     <div className={styles["cover-image"]}>
            //       <Image
            //         src={`/api/images/getImage?filename=${book.imageGCSLocation}&imageType=book`}
            //         layout="fill"
            //         objectFit="contain"
            //         priority={true}
            //         alt={"Book cover"}
            //       />
            //     </div>
            //   </div>
            //   <span className={styles["section-name"]}>
            //     {book.Title} {book.id}
            //   </span>
            // </span>
          ))}
      </div>
      <NavigationButtons
        disableLeftArrow={skipBooks === 0}
        disableRightArrow={skipBooks + 3 >= totalUserBooks}
        onFlipLeft={() => handleNextBooks("back")}
        onFlipRight={() => handleNextBooks("forward")}
        onReturnHome={() => router.push("/")}
      />
    </div>
  );
}
