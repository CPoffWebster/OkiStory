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
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pages, setPages] = useState<PagesAttributes[]>([]);
  const [pagesContent, setPagesContent] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    console.log("calling books");
    const intervalId = setInterval(async () => {
      // console.log("GET BOOK HERE", book);
      const response = await axios.post("/api/read/getBook", {
        guid: props.guid,
      });
      const data = response.data.book;
      if (data) {
        // console.log(data);
        setBook(data);
        setPagesContent([
          <div>
            <p>{data.Title}</p>
            <img
              key="page1_image"
              src={`/api/images/getImage?filename=${data.imageGCSLocation}&imageType=book`}
              alt="Books"
              className={`${styles.coverImage}`}
            />
          </div>,
        ]);
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  useEffect(() => {
    if (book === null) return; // Skip if book is null

    console.log("calling pages");
    const intervalId = setInterval(async () => {
      console.log("READ PAGES HERE");
      const response = await axios.post("/api/read/getBook", {
        guid: props.guid,
        includePages: true,
      });
      const data = response.data.pages;
      console.log("data", data);
      if (data) {
        setPages(data);
        if (pages[pageIndex] != null) {
          data.push(data[pageIndex]);
          setPageIndex(pageIndex + 1);
          // setPages(pages);
          const newImageContent = (
            <img
              key="page1_image"
              src="/book_pile.png"
              alt="Books"
              className={`${styles.image}`}
            />
          );
          const newTextContent = (
            <p key="page1_text" className={styles.text}>
              More content... More content... More content... More content...
              More content... More content...
            </p>
          );
          pagesContent.push(newImageContent);
          pagesContent.push(newTextContent);
          setPagesContent(pagesContent);
        }
        console.log(
          "LOOK HERE FOR PAGES",
          data.length,
          book!.PageCount,
          data.length === book!.PageCount,
          data
        );
        if (data.length === book!.PageCount) clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [book]);

  // return <Book />;
  // return {book && pages.length > 0 ? <BookReader book={book} pages={pages} /> : 'Loading...'}
  return (
    <>{book ? <Book pagesContent={pagesContent} /> : <div>Loading...</div>}</>
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
