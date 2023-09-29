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
    // <div className={styles.book}>
    //   <div id="pages" className={styles.pages}>
    //     <div className={styles.page}>
    //       <div className={`${styles.pageContent} ${styles.front}`}>
    //         <p>
    //           Open Me, <br />
    //           please!
    //         </p>
    //       </div>
    //       <div className={`${styles.pageContent} ${styles.back}`}>
    //         <p>Another Side</p>
    //       </div>
    //     </div>
    //     <div className={styles.page}></div>
    //     <div className={styles.page}>
    //       <div className={`${styles.pageContent} ${styles.front}`}>
    //         <p>Hello there!</p>
    //       </div>
    //       <div className={`${styles.pageContent} ${styles.back}`}>
    //         <p>More Content</p>
    //       </div>
    //     </div>
    //   </div>
    // </div>
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
        <div className={styles.page}>
          <img
            src="/book_pile.png"
            alt="Books"
            style={{
              width: "90%",
              height: "90%",
              objectFit: "cover",
            }}
          />
        </div>
        <div className={styles.page}>
          <p
            style={{
              fontSize: "3rem",
              fontWeight: "bold",
              textAlign: "center",
              paddingTop: "2rem",
            }}
          >
            Hello there!
          </p>
          <p
            style={{
              fontSize: "2rem",
              textAlign: "center",
            }}
          >
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
