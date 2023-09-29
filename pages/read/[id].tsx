import { useEffect, useState } from "react";
import styles from "./cover.module.css";
import { BooksAttributes } from "@/services/database/models/Books";

export default function CoverPage(props: { book: BooksAttributes }) {
  const [flippedPages, setFlippedPages] = useState<number[]>([]);
  const totalPages = 8; // 7 inner pages + 1 cover

  useEffect(() => {
    const pages = Array.from(document.getElementsByClassName("page"));
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i] as HTMLElement;
      if (i % 2 === 0) {
        page.style.zIndex = `${totalPages - i}`;
      }
    }
  }, []);

  const handlePageClick = (pageNum: number) => {
    if (pageNum === 1) return; // Do not flip the cover page
    setFlippedPages((prev) => {
      if (prev.includes(pageNum)) {
        return prev.filter((p) => p !== pageNum);
      }
      return [...prev, pageNum];
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.book}>
        <div className={styles.pages}>
          {Array.from({ length: totalPages }, (_, index) => {
            const isFlipped = flippedPages.includes(index + 1);
            const isCover = index === 0;
            return (
              <div
                key={index}
                className={`${styles.page} ${isFlipped ? styles.flipped : ""} ${
                  isCover ? styles.cover : ""
                }`}
                onClick={() => handlePageClick(index + 1)}
              >
                {isCover && (
                  <p className={styles.pageContent}>
                    Book Cover <br />
                    {/* {props.book.Title} */}
                  </p>
                )}
                {!isCover && index === 2 && (
                  <p className={styles.pageContent}>Hello there!</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
