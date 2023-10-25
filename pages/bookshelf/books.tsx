import React, { useEffect, useState } from "react";
import styles from "./books.module.css";
import { arrowLeftIcon } from "@/data/icons";
import { useRouter } from "next/router";
import axios from "axios";
import { BooksAttributes } from "@/services/database/models/Books";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Image from "next/image";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/identifier",
        permanent: false,
      },
    };
  }
  const userEmail = session.user!.email;
  return {
    props: { userEmail },
  };
};

export default function BookShelf(props: { userEmail: string }) {
  const router = useRouter();
  const [books, setBooks] = useState<BooksAttributes[] | null>(null); // State to hold books

  const handleBack = (): void => {
    router.push("/");
    return;
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.post("/api/read/getUserBooks", {
        userEmail: props.userEmail,
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
          ))
        ) : (
          <li>Loading...</li>
        )}
      </div>
    </div>
  );
}
