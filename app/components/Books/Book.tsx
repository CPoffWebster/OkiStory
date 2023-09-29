import React, { useEffect } from "react";
import styles from "./Book.module.css";
import { homeIcon } from "@/data/icons";
import { useRouter } from "next/router";

type PageProps = {
  content: React.ReactNode;
  className?: string;
  index: number;
};

const Page: React.FC<PageProps> = ({ content, className, index }) => {
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
            onClick={returnHome}
          >
            {homeIcon}
          </span>
        </div>
      )}
    </div>
  );
};

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

  const pagesContent = [
    "Open Me, please!",
    <img src="/book_pile.png" alt="Books" className={`${styles.image}`} />,
    <p className={styles.text}>
      More content... More content... More content... More content... More
      content... More content...
    </p>,
    "More content... image",
    "More content...",
    "More content... image",
    "More content...",
    "More content... image",
    "More content...",
  ];

  return (
    <div className={styles.book}>
      {pagesContent.map((content, index) => (
        <Page
          key={index}
          content={content}
          index={index}
          className={index % 2 === 0 ? styles.centerContent : ""}
        />
      ))}
    </div>
  );
};

export default Book;
