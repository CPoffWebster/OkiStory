import React, { useEffect } from "react";
import styles from "./Book.module.css";
import { arrowLeftIcon, arrowRightIcon, homeIcon } from "@/data/icons";
import { useRouter } from "next/router";
import { BooksAttributes } from "@/services/database/models/Books";
import { PagesAttributes } from "@/services/database/models/Pages";

type PageProps = {
  content: React.ReactNode;
  index: number;
};

const Page: React.FC<PageProps> = ({ content, index }) => {
  const router = useRouter();
  const pageRef = React.useRef<HTMLDivElement>(null);

  const returnHome = () => {
    router.push("/");
  };

  return (
    <div ref={pageRef} className={`${styles.page} ${styles.centerContent}`}>
      {content}
      {index % 2 !== 1 && (
        <div className={styles.navButtons}>
          <span
            className={`${styles.button} ${["clickable-container-small"]}`}
            // onClick={returnHome}
          >
            {arrowLeftIcon}
          </span>
          <span
            className={`${styles.buttonHome} ${["clickable-container-small"]}`}
            onClick={returnHome}
          >
            {homeIcon}
          </span>
          <span
            className={`${styles.button} ${["clickable-container-small"]}`}
            // onClick={returnHome}
          >
            {arrowRightIcon}
          </span>
        </div>
      )}
    </div>
  );
};

interface BookReaderProps {
  pagesContent: React.JSX.Element[];
  book: BooksAttributes;
  pages: PagesAttributes[];
}

// const Book: React.FC = () => {
const Book: React.FC<BookReaderProps> = ({ pagesContent }) => {
  useEffect(() => {
    const pages = Array.from(
      document.getElementsByClassName(styles.page)
    ) as HTMLElement[];

    pages.forEach((page, i) => {
      if (i % 2 === 0) {
        page.style.zIndex = `${pages.length - i}`;
      }
    });

    pages.forEach((page, i) => {
      // page.onclick = function () {
      //   if ((i + 1) % 2 === 0) {
      //     page.classList.remove(styles.flipped);
      //     // Check if previousElementSibling exists
      //     if (page.previousElementSibling) {
      //       (page.previousElementSibling as HTMLElement).classList.remove(
      //         styles.flipped
      //       );
      //     }
      //   } else {
      //     page.classList.add(styles.flipped);
      //     // Check if nextElementSibling exists
      //     if (page.nextElementSibling) {
      //       (page.nextElementSibling as HTMLElement).classList.add(
      //         styles.flipped
      //       );
      //     }
      //   }
      // };
    });
  }, [pagesContent]);

  return (
    <div className={styles.book}>
      {pagesContent.map((content, index) => (
        <Page key={index} content={content} index={index} />
      ))}
    </div>
  );
};

export default Book;
