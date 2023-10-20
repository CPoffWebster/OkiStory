import { BooksAttributes } from "@/services/database/models/Books";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { PagesAttributes } from "@/services/database/models/Pages";
import Book from "@/app/components/Books/Book";
import axios from "axios";
import styles from "./aa.module.css";
// import styles from "./book.module.css";
import "flipping-pages/dist/style.css";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const guid = context.query.id as unknown as string; // Access 'id' directly
  return {
    props: { guid },
  };
};

export default function GetBookData(props: { guid: string }) {
  const [book, setBook] = useState<BooksAttributes | null>(null);
  const [pages, setPages] = useState<PagesAttributes[]>([]);
  const [coverPage, setCoverPage] = useState<React.JSX.Element | null>(null); // pagesContent[0]
  const [pagesContent, setPagesContent] = useState<React.JSX.Element[]>([]);

  useEffect(() => {
    console.log("calling books");
    const intervalId = setInterval(async () => {
      const response = await axios.post("/api/read/getBook", {
        guid: props.guid,
      });
      const data = response.data.book;
      if (data) {
        setBook(data);
        const coverPage = (
          <div>
            <p>{data.Title}</p>
            <img
              key="page1_image"
              src={`/api/images/getImage?filename=${data.imageGCSLocation}&imageType=book`}
              alt="Books"
              className={`${styles.coverImage}`}
            />
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

    const intervalId = setInterval(async () => {
      const response = await axios.post("/api/read/getBook", {
        guid: props.guid,
        includePages: true,
      });
      const data = response.data.pages;
      if (data) {
        setPages(data);
        const updatePagesContent: React.JSX.Element[] = [];
        updatePagesContent.push(coverPage!);
        for (let i = 0; i < data.length; i++) {
          const newImageContent = (
            <img
              key="page1_image"
              src={`/api/images/getImage?filename=${data[i].imageGCSLocation}&imageType=book`}
              alt="Books"
              className={`${styles.image}`}
            />
          );
          const newTextContent = (
            <p key="page1_text" className={styles.text}>
              {data[i].Text}
            </p>
          );
          updatePagesContent.push(newImageContent);
          updatePagesContent.push(newTextContent);
        }
        if (data.length === book!.PageCount) {
          // updatePagesContent.push(
          //   <p key="page1_text" className={styles.text}>
          //     The End
          //   </p>
          // );
          clearInterval(intervalId);
        }
        setPagesContent(updatePagesContent);
      }
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [book]);

  // return <Book />;
  // return {book && pages.length > 0 ? <BookReader book={book} pages={pages} /> : 'Loading...'}
  return (
    <>
      {book ? (
        <Book
          pagesContent={pagesContent}
          pageCount={book.PageCount}
          pagesFound={pages.length}
        />
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}

// const pagesContent = [
//   <div>
//     <img
//       key="page1_image"
//       src="/book_pile.png"
//       alt="Books"
//       className={`${styles.coverImage}`}
//     />
//     <p>Test Title</p>
//   </div>,
//   <img
//     key="page1_image"
//     src="/book_pile.png"
//     alt="Books"
//     className={`${styles.image}`}
//   />,
//   <p key="page1_text" className={styles.text}>
//     More content... More content... More content... More content... More
//     content... More content...
//   </p>,
//   <img
//     key="page2_image"
//     src="/happy_book.png"
//     alt="Books"
//     className={`${styles.image}`}
//   />,
//   <p key="page2_text" className={styles.text}>
//     More content... More content... More content... More content... More
//     content... More content...
//   </p>,
//   <img
//     key="page3_image"
//     src="/book_pile.png"
//     alt="Books"
//     className={`${styles.image}`}
//   />,
//   <p key="page3_text" className={styles.text}>
//     More content... More content... More content... More content... More
//     content... More content...
//   </p>,
//   <p key="back_cover" className={styles.text}>
//     More content... More content... More content... More content... More
//     content... More content...
//   </p>,
// ];
