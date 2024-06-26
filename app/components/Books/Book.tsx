import React, { useEffect, useRef, useState } from "react";
import styles from "./Book.module.css";
import { useRouter } from "next/router";
import NavigationButtons, { useFlippedPages } from "../NavButtons/NavButtons";

interface BookReaderProps {
  pagesContent: React.JSX.Element[]; // Array of book pages
  pageCount: number; // Number of pages in the book
  coverConfigured: boolean; // Has the cover page loaded?
  pagesConfigured: number; // Number of pages that have loaded
}

const Book: React.FC<BookReaderProps> = ({
  pagesContent,
  pageCount,
  coverConfigured,
  pagesConfigured,
}) => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { flippedPages, flipPage } = useFlippedPages();
  const [renderedPages, setRenderedPages] = useState<React.JSX.Element[]>([]);

  // Pre-render pages
  useEffect(() => {
    const pageRendering = pagesContent.map((content, index) => {
      // Determine if the page should have left/right offset
      let pageStyle = {};
      let bindingStyle = {};
      if (index % 2 !== 0) {
        pageStyle = { left: "1vw" };
      } else {
        pageStyle = { right: "1vw", zIndex: `${pagesContent.length - index}` };
      }
      if (index === 0 || index === pageCount * 2 - 1) {
        bindingStyle = styles.bindingPage;
      }
      return (
        <div
          key={index}
          className={`${styles.page} ${bindingStyle}`}
          style={pageStyle} // Apply the dynamic style here
        >
          {content}
        </div>
      );
    });
    setRenderedPages(pageRendering);
  }, [pagesContent, currentIndex]); // Include currentIndex in dependency array

  // Update the page flip state
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
    pageCount != pagesConfigured
      ? currentIndex >= pagesConfigured * 2
      : currentIndex >= pageCount * 2;
  const isLoading =
    pagesConfigured < pageCount ||
    pageCount === undefined ||
    pagesConfigured === 0;

  return (
    <div>
      {currentIndex === 0 ? (
        <div className={styles.coverContainer}>{renderedPages}</div>
      ) : currentIndex === pageCount * 2 ? (
        <div className={styles.coverContainer}>{renderedPages}</div>
      ) : (
        <div className={styles.pageContainer}>{renderedPages}</div>
      )}

      <NavigationButtons
        disableLeftArrow={currentIndex <= 1}
        disableRightArrow={disableRightArrow}
        isLoadingRightArrow={isLoading}
        rightImportant={currentIndex < pageCount * 2}
        homeImportant={currentIndex != 0 && currentIndex >= pageCount * 2}
        onFlipLeft={handleFlipLeft}
        onFlipRight={handleFlipRight}
        onReturnHome={() => router.push("/")}
      />
    </div>
  );
};

export default Book;
