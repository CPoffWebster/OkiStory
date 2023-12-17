import { BooksAttributes } from "@/services/database/models/Books";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
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
  const [location, setLocation] = useState<LocationsAttributes | null>(null);
  const [character, setCharacter] = useState<LocationsAttributes | null>(null);
  const [pagesContent, setPagesContent] = useState<React.JSX.Element[]>([]);
  const [bookPageCount, setBookPageCount] = useState<number>(0);
  const [pagesConfigured, setPagesConfigured] = useState<number>(0);

  // Initial load of location and character for newly created books
  useEffect(() => {
    const locationGUID = sessionStorage.getItem("Location") || "";
    const characterGUID = sessionStorage.getItem("Character") || "";
    getBookCreationElements(locationGUID, characterGUID);
    getBook();
  }, []);

  // Initial load of location and character
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

  // Get book and pages data
  const getBook = async () => {
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
        pagesData.length === bookData.PageCount
      ) {
        const [pagesContent, pagesConfigured] = createBookLayout(
          bookData,
          pagesData
        );
        console.log(pagesContent, pagesConfigured);
        setPagesContent(pagesContent);
        setBookPageCount(bookData.PageCount);
        setPagesConfigured(pagesConfigured);

        if (
          bookData.PageCount === pagesData.length &&
          pagesData.length === pagesConfigured
        ) {
          clearInterval(interval);
        }
      }
    };

    // Call fetchBookData immediately and then set an interval
    fetchBookData();
    const interval = setInterval(fetchBookData, 5000);
  };

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
      <Book
        pagesContent={pagesContent}
        pageCount={bookPageCount}
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
  pagesData: PagesAttributes[]
): [React.JSX.Element[], number] {
  if (bookData === null) return [[], 0];
  const updatePagesContent: React.JSX.Element[] = [];
  updatePagesContent.push(
    <div className={styles.coverContainer}>
      <h1 className={styles.title}>{bookData.Title}</h1>
      <ImageWithFallback
        className={styles.coverImage}
        filename={bookData.imageGCSLocation || ""}
        error={bookData.imageError}
        alt={"selection-image"}
      />
    </div>
  );
  if (pagesData === null) [updatePagesContent, 0];

  let pagesConfigured = 0;
  const incrementPagesConfigured = () => {
    pagesConfigured++;
  };

  for (let i = 0; i < pagesData.length; i++) {
    if (pagesData[i].imageGCSLocation || pagesData[i].imageError === true) {
      pagesConfigured++;
      updatePagesContent.push(
        <ImageWithFallback
          className={styles.pageImage}
          filename={pagesData[i].imageGCSLocation || ""}
          error={pagesData[i].imageError}
          onLoad={incrementPagesConfigured}
        />
      );
      updatePagesContent.push(
        <div className={styles.pageText}>
          <p>{pagesData[i].Text}</p>
        </div>
      );
    }
  }

  return [updatePagesContent, pagesConfigured];
}
