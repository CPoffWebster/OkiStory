import { BooksAttributes } from "@/services/database/models/Books";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { PagesAttributes } from "@/services/database/models/Pages";
import Book from "@/app/components/Books/Book";
import Image from "next/image";
import axios from "axios";
import styles from "./id.module.css";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const guid = context.query.id as unknown as string; // Access 'id' directly
  return {
    props: { guid },
  };
};

export default function GetBookData(props: { guid: string }) {
  const [book, setBook] = useState<BooksAttributes>({
    GUID: "",
    LocationGUID: "",
    CharacterGUID: "",
    ThemeGUID: "",
    StyleGUID: "",
    UserEmail: "",
  });
  const [pages, setPages] = useState<PagesAttributes[]>([]);
  const [coverPage, setCoverPage] = useState<React.JSX.Element | null>(null); // pagesContent[0]
  const [pagesContent, setPagesContent] = useState<React.JSX.Element[]>([]);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const response = await axios.post("/api/read/getBook", {
        guid: props.guid,
      });
      const data = response.data.book;
      if (
        data &&
        data.PageCount !== null &&
        data.imageGCSLocation !== undefined &&
        data.Title !== ""
      ) {
        setBook(data);
        const coverPage = (
          <div>
            <h1 className={styles.title}>{data.Title}</h1>
            <div className={styles["coverImage"]}>
              <Image
                src={`/api/images/getImage?filename=${data.imageGCSLocation}&imageType=book`}
                layout="fill"
                objectFit="contain"
                priority={true}
                alt={"Cover"}
              />
            </div>
          </div>
        );
        setPagesContent([coverPage]);
        setCoverPage(coverPage);
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  useEffect(() => {
    if (book === null) return; // Skip if book is null

    // console.log("calling pages");
    const intervalId = setInterval(async () => {
      const response = await axios.post("/api/read/getBook", {
        guid: props.guid,
        includePages: true,
      });
      const data = response.data.pages;
      // console.log("pages data", data);
      if (data && data.length !== 0) {
        setPages(data);
        const updatePagesContent: React.JSX.Element[] = [];
        updatePagesContent.push(coverPage!);

        let pagesConfigured = 0;
        for (let i = 0; i < data.length; i++) {
          if (
            data[i].imageGCSLocation &&
            data[i].imageGCSLocation !== undefined
          ) {
            pagesConfigured++;
            const newImageContent = (
              <div className={styles["pageImage"]}>
                <Image
                  src={`/api/images/getImage?filename=${data[i].imageGCSLocation}&imageType=book`}
                  layout="fill"
                  objectFit="contain"
                  priority={true}
                  alt={"PageImage"}
                />
              </div>
            );
            const newTextContent = (
              <div className={styles.pageText}>
                <p key="PageText">{data[i].Text}</p>
              </div>
            );
            updatePagesContent.push(newImageContent);
            updatePagesContent.push(newTextContent);
          }
        }
        if (
          data.length === book!.PageCount &&
          pagesConfigured === book!.PageCount
        ) {
          // console.log("clearing pages interval", data.length, book!.PageCount);
          clearInterval(intervalId);
        }
        setPagesContent(updatePagesContent);
      }
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [book]);

  return (
    <>
      <Book
        pagesContent={pagesContent}
        pageCount={book.PageCount!}
        pagesFound={pages.length}
      />
      {/* {book ? (
      ) : (
        <div>Loading...</div>
      )} */}
    </>
  );
}
