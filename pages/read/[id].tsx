import { getBook } from "@/services/books";
import { BooksAttributes } from "@/services/database/models/Books";
import { GetServerSideProps } from "next";
import styles from "./cover.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Book from "@/app/components/Books/Book";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.query.id as unknown as string; // Access 'id' directly
  const book = await getBook(id);
  return {
    props: { book },
  };
};

export default function CoverPage(props: { book: BooksAttributes }) {
  return (
    <div>
      <Book />
    </div>
  );
  // const [flippedPages, setFlippedPages] = useState<number[]>([]);
  // const totalPages = 7; // Number of pages

  // useEffect(() => {
  //   const pages = Array.from(document.getElementsByClassName('page'));
  //   for (let i = 0; i < pages.length; i++) {
  //     const page = pages[i] as HTMLElement;
  //     if (i % 2 === 0) {
  //       page.style.zIndex = `${totalPages - i}`;
  //     }
  //   }
  // }, []);

  // const handlePageClick = (pageNum: number) => {
  //   if (pageNum % 2 === 0) {
  //     setFlippedPages((prev) => prev.filter((p) => p !== pageNum && p !== pageNum - 1));
  //   } else {
  //     setFlippedPages((prev) => [...prev, pageNum, pageNum + 1]);
  //   }
  // };

  // return (
  //   <div className={styles.container}>
  //     <div className={styles.book}>
  //       <div className={styles.pages}>
  //         {Array.from({ length: totalPages }, (_, index) => {
  //           const isFlipped = flippedPages.includes(index + 1);
  //           return (
  //             <div
  //               key={index}
  //               className={`${styles.page} ${isFlipped ? 'flipped' : ''}`}
  //               onClick={() => handlePageClick(index + 1)}
  //             >
  //               {index === 0 && <p className={styles.pageContent}>Open Me, <br />please!</p>}
  //               {index === 2 && <p className={styles.pageContent}>Hello there!</p>}
  //             </div>
  //           );
  //         })}
  //       </div>
  //     </div>
  //   </div>
  // );
}
