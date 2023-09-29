import React, { useEffect } from "react";
import styles from "./Book.module.css";

const Book: React.FC = () => {
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
      page.onclick = function () {
        if ((i + 1) % 2 === 0) {
          page.classList.remove(styles.flipped);

          // Check if previousElementSibling exists
          if (page.previousElementSibling) {
            (page.previousElementSibling as HTMLElement).classList.remove(
              styles.flipped
            );
          }
        } else {
          page.classList.add(styles.flipped);

          // Check if nextElementSibling exists
          if (page.nextElementSibling) {
            (page.nextElementSibling as HTMLElement).classList.add(
              styles.flipped
            );
          }
        }
      };
    });
  }, []);

  return (
    <div className={styles.book}>
      <div id="pages" className={styles.pages}>
        <div className={styles.page}>
          <p>
            Open Me, <br />
            please!
          </p>
          <p>
            Open Me, <br />
            please!
          </p>
        </div>
        <div className={`${styles.page} ${styles.centerContent}`}>
          <img src="/book_pile.png" alt="Books" className={styles.image} />
        </div>
        <div className={`${styles.page} ${styles.centerContent}`}>
          <p className={styles.text}>
            More ContentMore ContentMore ContentMore ContentMore ContentMore
            ContentMore ContentMore Content
          </p>
        </div>
        <div className={styles.page}></div>
        <div className={styles.page}></div>
        <div className={styles.page}></div>
        <div className={styles.page}></div>
      </div>
    </div>
  );
};

export default Book;
