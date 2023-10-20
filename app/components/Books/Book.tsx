import React, { useEffect, useState } from "react";
import styles from "./Book.module.css";
import { arrowLeftIcon, arrowRightIcon, homeIcon } from "@/data/icons";
import { useRouter } from "next/router";

type PageProps = {
  content: React.ReactNode;
  index: number;
  pageCount: number;
  pagesFound: number;
  onFlipLeft: (index: number) => void;
  onFlipRight: (index: number) => void;
};

const Page: React.FC<PageProps> = ({
  content,
  index,
  pageCount,
  pagesFound,
  onFlipLeft,
  onFlipRight,
}) => {
  const router = useRouter();
  const pageRef = React.useRef<HTMLDivElement>(null);

  const disableLeftArrow = index <= 1;
  const disableRightArrow = index >= pageCount * 2;
  const loadingRightArrow = pagesFound < pageCount && index >= pagesFound * 2;

  const returnHome = () => {
    router.push("/");
  };

  return (
    <div ref={pageRef} className={`${styles.page} ${styles.centerContent}`}>
      {content}
      {index % 2 !== 1 && (
        <div className={styles.navButtons}>
          <span
            className={`${["clickable-container-small"]} ${
              disableLeftArrow ? styles.disabled : ""
            }`}
            onClick={() => {
              if (!disableLeftArrow) {
                onFlipLeft(index);
              }
            }}
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
            className={`${["clickable-container-small"]} ${
              disableRightArrow ? styles.disabled : ""
            } ${loadingRightArrow ? styles.loading : ""}`}
            onClick={() => !disableRightArrow && onFlipRight(index)}
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
  pageCount: number;
  pagesFound: number;
}

// const Book: React.FC = () => {
const Book: React.FC<BookReaderProps> = ({
  pagesContent,
  pageCount,
  pagesFound,
}) => {
  useEffect(() => {
    const pages = Array.from(
      document.getElementsByClassName(styles.page)
    ) as HTMLElement[];

    pages.forEach((page, i) => {
      if (i % 2 === 0) {
        page.style.zIndex = `${pages.length - i}`;
      }
    });
  }, [pagesContent]);

  const [flippedPages, setFlippedPages] = useState<Set<number>>(new Set());

  const handleFlipLeft = (index: number) => {
    setFlippedPages((prev) => {
      const newSet = new Set(prev);
      newSet.delete(index - 1);
      newSet.delete(index - 2);
      return newSet;
    });
  };

  const handleFlipRight = (index: number) => {
    setFlippedPages((prev) => {
      const newSet = new Set(prev);
      newSet.add(index);
      newSet.add(index + 1);
      return newSet;
    });
  };

  useEffect(() => {
    const pages = Array.from(
      document.getElementsByClassName(styles.page)
    ) as HTMLElement[];
    pages.forEach((page, i) => {
      if (flippedPages.has(i)) {
        page.classList.add(styles.flipped);
      } else {
        page.classList.remove(styles.flipped);
      }
    });
  }, [flippedPages]);

  return (
    <div className={styles.book}>
      {pagesContent.map((content, index) => (
        <Page
          key={index}
          content={content}
          index={index}
          pageCount={pageCount}
          pagesFound={pagesFound}
          onFlipLeft={handleFlipLeft}
          onFlipRight={handleFlipRight}
        />
      ))}
    </div>
  );
};

export default Book;
