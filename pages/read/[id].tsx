import { BooksAttributes } from "@/services/database/models/Books";
import { GetServerSideProps } from "next";
import { useEffect, useRef, useState } from "react";
import { PagesAttributes } from "@/services/database/models/Pages";
import Book from "@/app/components/Books/Book";
import axios from "axios";
import styles from "./id.module.css";
import { LocationsAttributes } from "@/services/database/models/Locations";
import { Selection } from "@/app/components/Selections/Selection";
import ImageWithFallback from "@/app/components/Image/ImageWithFallback";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const guid = context.query.id as unknown as string; // Access 'id' directly
  return {
    props: { guid },
  };
};

export default function GetBookData(props: { guid: string }) {
  const intervalRef = useRef<NodeJS.Timeout | undefined>();
  const [pagesContent, setPagesContent] = useState<React.JSX.Element[]>([
    <div key="initial-loading" className={styles.coverContainer}>
      <h1 className={styles.title} style={{ marginTop: "-10vw" }}>
        Loading your story!
      </h1>
      <div className={styles.spinner}></div>
    </div>,
  ]);
  const [location, setLocation] = useState<LocationsAttributes | null>(null);
  const [character, setCharacter] = useState<LocationsAttributes | null>(null);
  const [bookPageCount, setBookPageCount] = useState<number>(0);
  const [coverConfigured, setCoverConfigured] = useState<boolean>(false);
  const [pagesConfigured, setPagesConfigured] = useState<number>(0);
  const [selectedRating, setSelectedRating] = useState<number>(0);

  // Initial load of location and character for newly created books
  useEffect(() => {
    const getBookCreationElements = async (
      locationGUID: string,
      characterGUID: string
    ) => {
      if (locationGUID !== "" && characterGUID !== "") {
        const response = await axios.post("/api/read/getCreationElements", {
          locationGUID,
          characterGUID,
        });
        setLocation(response.data.location);
        setCharacter(response.data.character);
        sessionStorage.clear();
      }
    };
    const locationGUID = sessionStorage.getItem("Location") || "";
    const characterGUID = sessionStorage.getItem("Character") || "";
    getBookCreationElements(locationGUID, characterGUID);
  }, []);

  useEffect(() => {
    const fetchBookData = async () => {
      const response = await axios.post("/api/read/getBook", {
        guid: props.guid,
      });
      const bookData: BooksAttributes = response.data.book;
      const pagesData: PagesAttributes[] = response.data.pages;

      if (location === null && character === null) {
        setLocation(response.data.location);
        setCharacter(response.data.character);
      }

      if (
        bookData !== null &&
        pagesData !== null &&
        pagesData.length === bookData.PageCount &&
        (bookData.imageGCSLocation || bookData.imageError === true)
      ) {
        setBookPageCount(bookData.PageCount + 1);
        const [pagesContentUpdate] = createBookLayout(
          bookData,
          pagesData,
          setCoverConfigured,
          setPagesConfigured
        );
        setPagesContent(pagesContentUpdate);
      }
    };

    // Call fetchBookData immediately and then set an interval
    fetchBookData();
    intervalRef.current = setInterval(fetchBookData, 10000);

    // Cleanup function to clear the interval when component unmounts
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    };
  }, []);

  // UseEffect to check for state updates and clear interval
  useEffect(() => {
    if (coverConfigured && bookPageCount === pagesConfigured) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    }
  }, [coverConfigured, bookPageCount, pagesConfigured]);

  return (
    <>
      <span className={styles.storyOutline}>
        <h1 className={styles.storyOutlineTitle}>Story Outline</h1>
        {location && character && (
          <div className={styles.selectionContainer}>
            <Selection
              key={location.GUID}
              elementType={"Location"}
              element={location}
              size="small"
            />
            <Selection
              key={character.GUID}
              elementType={"character"}
              element={character}
              size="small"
            />
          </div>
        )}
      </span>
      <span className={styles.ratingOutline}>
        <div className={styles.pageText}>
          <h1 className={styles.storyOutlineTitle}>Rate Story</h1>
          <ul className={styles.emojiRating}>
            <li
              onClick={() => setSelectedRating(1)}
              style={{ opacity: selectedRating === 1 ? 1 : 0.5 }}
            >
              😠
            </li>
            <li
              onClick={() => setSelectedRating(2)}
              style={{ opacity: selectedRating === 2 ? 1 : 0.5 }}
            >
              😦
            </li>
            <li
              onClick={() => setSelectedRating(3)}
              style={{ opacity: selectedRating === 3 ? 1 : 0.5 }}
            >
              😐
            </li>
            <li
              onClick={() => setSelectedRating(4)}
              style={{ opacity: selectedRating === 4 ? 1 : 0.5 }}
            >
              🙂
            </li>
            <li
              onClick={() => setSelectedRating(5)}
              style={{ opacity: selectedRating === 5 ? 1 : 0.5 }}
            >
              😀
            </li>
          </ul>
        </div>
      </span>
      <Book
        pagesContent={pagesContent}
        pageCount={bookPageCount}
        coverConfigured={coverConfigured}
        pagesConfigured={pagesConfigured}
      />
    </>
  );
}

/**
 * Creates the book layout
 * @param bookData BooksAttributes
 * @param pagesData PagesAttributes[]
 * @returns React.JSX.Element[]
 */
function createBookLayout(
  bookData: BooksAttributes,
  pagesData: PagesAttributes[],
  setCoverConfigured: React.Dispatch<React.SetStateAction<boolean>>,
  setPagesConfigured: React.Dispatch<React.SetStateAction<number>>
): [React.JSX.Element[]] {
  if (bookData === null) return [[]];
  const updatePagesContent: React.JSX.Element[] = [];

  // Set Cover Page
  updatePagesContent.push(
    <div className={styles.coverContainer}>
      <h1 className={styles.title}>{bookData.Title}</h1>
      <ImageWithFallback
        key={`page-image-cover`}
        className={styles.coverImage}
        filename={bookData.imageGCSLocation || ""}
        error={bookData.imageError}
        onLoad={() => setCoverConfigured(true)}
      />
    </div>
  );
  if (pagesData === null) [updatePagesContent, 0];

  // Set Pages
  let pagesConfigured = 0;
  for (let i = 0; i < pagesData.length; i++) {
    if (pagesData[i].imageGCSLocation || pagesData[i].imageError === true) {
      pagesConfigured++;
      updatePagesContent.push(
        <ImageWithFallback
          key={`page-image-${i}`}
          className={styles.pageImage}
          filename={pagesData[i].imageGCSLocation || ""}
          error={pagesData[i].imageError}
          onLoad={() => setPagesConfigured((curr) => curr + 1)}
        />
      );
      updatePagesContent.push(
        <div className={styles.pageText}>
          <p>{pagesData[i].Text}</p>
        </div>
      );
    }
  }

  // Set Back Cover Page
  if (pagesConfigured === bookData.PageCount) {
    updatePagesContent.push(
      <div className={styles.coverContainer}>
        <h1 className={styles.title}>The End</h1>
        <ImageWithFallback
          key={`last-page-image`}
          className={styles.coverImage}
          filename={bookData.imageGCSLocation || ""}
          error={bookData.imageError}
          onLoad={() => setPagesConfigured((curr) => curr + 1)}
        />
      </div>
    );
  }

  return [updatePagesContent];
}
