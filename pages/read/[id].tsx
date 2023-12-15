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
  const [pagesFound, setPagesFound] = useState<number>(0);

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
      const location = await axios.post("/api/create/getLocation", {
        guid: locationGUID,
      });
      setLocation(location.data.location);
      const character = await axios.post("/api/create/getCharacter", {
        guid: characterGUID,
      });
      setCharacter(character.data.character);
      sessionStorage.clear();
    }
  };

  // Get book and pages data
  const getBook = async () => {
    // Continuously check for book data until a condition is met
    const interval = setInterval(async () => {
      const response = await axios.post("/api/read/getBook", {
        guid: props.guid,
      });
      const bookData: BooksAttributes = response.data.book;
      const pagesData: PagesAttributes[] = response.data.pages;
      if (
        bookData !== null &&
        pagesData !== null &&
        pagesData.length === bookData.PageCount
      ) {
        if (location === null && character === null) {
          getBookCreationElements(
            bookData.LocationGUID,
            bookData.CharacterGUID
          );
        }
        const [pagesContent, pagesConfigured] = createBookLayout(
          bookData,
          pagesData
        );
        setPagesContent(pagesContent);
        setBookPageCount(bookData.PageCount);
        setPagesFound(pagesData.length);
        if (
          bookData.PageCount === pagesData.length &&
          pagesData.length === pagesConfigured
        ) {
          clearInterval(interval);
        }
      }
    }, 5000);
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
        pagesFound={pagesFound}
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
  for (let i = 0; i < pagesData.length; i++) {
    if (pagesData[i].imageGCSLocation || pagesData[i].imageError === true) {
      pagesConfigured++;
      updatePagesContent.push(
        <ImageWithFallback
          className={styles.pageImage}
          filename={pagesData[i].imageGCSLocation || ""}
          error={pagesData[i].imageError}
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
