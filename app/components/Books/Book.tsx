import React, { useEffect, useState } from "react";
import styles from "./Book.module.css";
import { useRouter } from "next/router";
import NavigationButtons, { useFlippedPages } from "../NavButtons/NavButtons";

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
  const [renderedPages, setRenderedPages] = useState<React.JSX.Element[]>([]);

  // Pre-render pages
  useEffect(() => {
    const pageRendering = pagesContent.map((content, index) => {
      // Determine if the page should have left/right offset
      let style = {};
      if (currentIndex !== 0) {
        if (index % 2 !== 0) style = { left: "1vw" };
        else style = { right: "1vw" };
      }
      return (
        <div
          key={index}
          className={`${styles.page} ${index === 0 ? styles.coverPage : ""}`}
          style={style} // Apply the dynamic style here
        >
          {content}
        </div>
      );
    });
    setRenderedPages(pageRendering);
  }, [pagesContent, currentIndex]); // Include currentIndex in dependency array

  // Set the z-index of the pages so that the odd pages are on top of the even pages
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

  // Update the page flip state
  useEffect(() => {
    console.log(currentIndex, pageCount, pagesFound);
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
    return new Promise<void>((resolve, reject) => {
      if (currentIndex <= 1) return;
      flipPage(currentIndex, false);
      // Wait for the animation to complete before updating currentIndex
      setTimeout(() => {
        setCurrentIndex((prevIndex) => prevIndex - 2);
        resolve(); // Resolve the promise after the timeout
      }, 500);
    });
  };

  const handleFlipRight = () => {
    return new Promise<void>((resolve, reject) => {
      if (currentIndex >= pageCount * 2) {
        reject("Index out of bounds"); // Reject the promise if the condition is not met
        return;
      }

      flipPage(currentIndex, true);
      // Wait for the animation to complete before updating currentIndex
      setTimeout(() => {
        setCurrentIndex((prevIndex) => prevIndex + 2);
        resolve(); // Resolve the promise after the timeout
      }, 500);
    });
  };

  // Html variables
  const disableRightArrow =
    pageCount != pagesFound
      ? currentIndex >= pagesFound * 2 - 4
      : currentIndex >= pageCount * 2;
  const isLoading =
    pagesFound < pageCount || pageCount === 0 || pagesFound === 0;
  console.log(disableRightArrow, isLoading, pagesFound, pageCount);

  return (
    <div>
      {currentIndex === 0 ? (
        <div className={styles.coverContainer}>{renderedPages}</div>
      ) : (
        <div className={styles.pageContainer}>{renderedPages}</div>
      )}
      <NavigationButtons
        disableLeftArrow={currentIndex <= 1}
        disableRightArrow={disableRightArrow}
        loadingRightArrow={isLoading}
        rightArrowMessage={isLoading ? "Loading..." : undefined}
        rightImportant={currentIndex < pageCount * 2}
        homeImportant={currentIndex >= pageCount * 2}
        onFlipLeft={handleFlipLeft}
        onFlipRight={handleFlipRight}
        onReturnHome={() => router.push("/")}
      />
    </div>
  );
};

export default Book;
