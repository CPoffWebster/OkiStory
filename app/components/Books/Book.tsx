import React, { useEffect, useState } from "react";
import styles from "./Book.module.css";
import { useRouter } from "next/router";
import NavigationButtons, { useFlippedPages } from "./NavButtons";

interface BookReaderProps {
  pagesContent: React.JSX.Element[];
  pageCount: number;
  pagesFound: number;
}

const Book: React.FC<BookReaderProps> = ({
  pagesContent,
  pageCount,
  pagesFound,
}) => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { flippedPages, flipPage } = useFlippedPages();

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

  const handleFlipLeft = () => {
    if (currentIndex <= 1) return;
    flipPage(currentIndex, false);
    setCurrentIndex((prevIndex) => prevIndex - 2);
  };

  const handleFlipRight = () => {
    if (currentIndex >= pageCount * 2) return;
    flipPage(currentIndex, true);
    setCurrentIndex((prevIndex) => prevIndex + 2);
  };

  return (
    <div>
      <div className={styles.pages}>
        {pagesContent.map((content, index) => (
          <div
            key={index}
            className={`${styles.page} ${
              currentIndex === 0 ? styles.coverPage : ""
            }`}
          >
            {content}
          </div>
        ))}
      </div>
      <NavigationButtons
        disableLeftArrow={currentIndex <= 1}
        disableRightArrow={currentIndex >= pageCount * 2}
        loadingRightArrow={
          pagesFound < pageCount && currentIndex >= pagesFound * 2
        }
        onFlipLeft={handleFlipLeft}
        onFlipRight={handleFlipRight}
        onReturnHome={() => router.push("/")}
      />
    </div>
  );
};

export default Book;
