import { BooksAttributes } from "@/services/database/models/Books";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { PagesAttributes } from "@/services/database/models/Pages";
import Book from "@/app/components/Books/Book";
import axios from "axios";
import styles from "./id.module.css";
import { LocationsAttributes } from "@/services/database/models/Locations";
import { Selection } from "@/app/components/Selections/Selection";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const guid = context.query.id as unknown as string; // Access 'id' directly
  return {
    props: { guid },
  };
};

export default function GetBookData(props: { guid: string }) {
  const [book, setBook] = useState<BooksAttributes>({
    GUID: "",
    LocationGUID: "",
    CharacterGUID: "",
    ThemeGUID: "",
    StyleGUID: "",
    UserID: 0,
  });
  const [location, setLocation] = useState<LocationsAttributes | null>(null);
  const [character, setCharacter] = useState<LocationsAttributes | null>(null);
  const [pages, setPages] = useState<PagesAttributes[]>([]);
  const [coverPage, setCoverPage] = useState<React.JSX.Element | null>(null); // pagesContent[0]
  const [pagesContent, setPagesContent] = useState<React.JSX.Element[]>([]);

  // Initial load of book
  useEffect(() => {
    const intervalId = setInterval(async () => {
      const response = await axios.post("/api/read/getBook", {
        guid: props.guid,
      });
      const data = response.data.book;
      if (
        data &&
        data.PageCount !== null &&
        data.imageGCSLocation !== undefined &&
        data.Title !== ""
      ) {
        setBook(data);
        const coverPage = (
          <div className={styles.coverContainer}>
            <h1 className={styles.title}>{data.Title}</h1>
            <img
              className={styles.coverImage}
              src={`/api/images/getImage?filename=${data.imageGCSLocation}&imageType=book`}
              alt={"selection-image"}
            />
          </div>
        );
        setPagesContent([coverPage]);
        setCoverPage(coverPage);
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  // Initial load of location and character
  useEffect(() => {
    (async () => {
      if (location !== null && character !== null) return;
      let locationGUID = "";
      let characterGUID = "";
      if (book !== null) {
        locationGUID = book.LocationGUID;
        characterGUID = book.CharacterGUID;
      } else {
        locationGUID = sessionStorage.getItem("Location") || "";
        characterGUID = sessionStorage.getItem("Character") || "";
      }

      if (locationGUID !== "" && characterGUID !== "") {
        const location = await axios.post("/api/create/getLocation", {
          guid: locationGUID,
        });
        setLocation(location.data.location);
        const character = await axios.post("/api/create/getCharacter", {
          guid: characterGUID,
        });
        setCharacter(character.data.character);
      }
    })();
  }, [book]);

  // Initial load of pages
  useEffect(() => {
    if (book === null) return; // Skip if book is null

    const intervalId = setInterval(async () => {
      const response = await axios.post("/api/read/getBook", {
        guid: props.guid,
        includePages: true,
      });
      const data = response.data.pages;
      if (data && data.length !== 0) {
        setPages(data);
        const updatePagesContent: React.JSX.Element[] = [];
        updatePagesContent.push(coverPage!);

        let pagesConfigured = 0;
        for (let i = 0; i < data.length; i++) {
          if (
            data[i].imageGCSLocation &&
            data[i].imageGCSLocation !== undefined
          ) {
            pagesConfigured++;
            const newImageContent = (
              <img
                className={styles.pageImage}
                src={`/api/images/getImage?filename=${data[i].imageGCSLocation}&imageType=book`}
                alt={"selection-image"}
              />
            );
            const newTextContent = (
              <div className={styles.pageText}>
                <p key="PageText">{data[i].Text}</p>
              </div>
            );
            updatePagesContent.push(newImageContent);
            updatePagesContent.push(newTextContent);
          }
        }
        if (
          data.length === book!.PageCount &&
          pagesConfigured === book!.PageCount
        ) {
          clearInterval(intervalId);
        }
        setPagesContent(updatePagesContent);
      }
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [book]);

  return (
    <>
      <span className={styles.storyOutline}>
        <h1>Story Outline</h1>
        {location && character && (
          <div>
            <div>
              <h2>Location: {location.Name}</h2>
              <Selection
                key={location.GUID}
                elementType={"Location"}
                element={location}
                onSelectElement={() => {}}
              />
            </div>
            <div>
              <h2>Character {character.Name}</h2>
              <Selection
                key={character.GUID}
                elementType={"character"}
                element={character}
                onSelectElement={() => {}}
              />
            </div>
          </div>
        )}
      </span>
      <Book
        pagesContent={pagesContent}
        pageCount={book.PageCount!}
        pagesFound={pages.length}
      />
    </>
  );
}
