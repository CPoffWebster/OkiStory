import { BooksAttributes } from "@/services/database/models/Books";
import { GetServerSideProps } from "next";
// import styles from "./cover.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Book from "@/app/components/Books/Book";

import { getPage } from "@/services/books";
import { PagesAttributes } from "@/services/database/models/Pages";
import { arrowLeftIcon, arrowRightIcon, homeIcon } from "@/data/icons";
import { FlippingPages } from "flipping-pages";
import { useRouter } from "next/router";
import Link from "next/link";
import "flipping-pages/dist/style.css";
import styles from "./book.module.css";
import { getSessionStorage } from "@/services/session";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const guid = context.query.id as unknown as string; // Access 'id' directly
  return {
    props: { guid },
  };
};

export default function GetBookData(props: { guid: string }) {
  const [book, setBook] = useState<BooksAttributes | null>(null);
  const [pages, setPages] = useState<PagesAttributes[]>([]);

  useEffect(() => {
    console.log("calling again...");
    const intervalId = setInterval(async () => {
      const response = await axios.post("/api/read/getBook", {
        guid: props.guid,
      });
      if (response.data.book) {
        // console.log("LOOK HERE", response.data.book);
        setBook(response.data.book);
        clearInterval(intervalId);
        return;
      }
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  useEffect(() => {
    if (book) {
      const intervalId = setInterval(async () => {
        const pageIndex = 0;
        // const fetchedPages = await getPage(book.GUID, pageIndex); // Assume getPages fetches all pages for a book
        // if (fetchedPages && fetchedPages.length > 0) {
        // setPages(fetchedPages);
        // clearInterval(intervalId);
        // }
      }, 1000);

      return () => clearInterval(intervalId); // Cleanup on unmount
    }
  }, [book]);

  // return <Book />;
  // return {book && pages.length > 0 ? <BookReader book={book} pages={pages} /> : 'Loading...'}
  return (
    <>
      {book ? <BookReader book={book} pages={pages} /> : <div>Loading...</div>}
    </>
  );
}

interface BookReaderProps {
  book: BooksAttributes;
  pages: PagesAttributes[];
}

const BookReader: React.FC<BookReaderProps> = ({ book, pages }) => {
  const router = useRouter();
  // const [book, setBook] = useState<BooksAttributes>(
  //   bookValues as BooksAttributes
  // );
  const [currentPage, setCurrentPage] = useState(0);
  // const [pages, setPages] = useState<PagesAttributes[]>([]);
  return (
    <div>
      <Book />
    </div>
  );
  // const [flippedPages, setFlippedPages] = useState<number[]>([]);
  // const totalPages = 7; // Number of pages

  // useEffect(() => {
  //   const bookString = getSessionStorage("book");
  //   if (bookString === "") {
  //     router.push("/");
  //     return;
  //   }
  //   setBook(JSON.parse(bookString as string) as BooksAttributes);
  // }, []);

  // For flipping pages
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    setCurrentPage(selected);
  }, [selected]);

  useEffect(() => {
    setSelected(currentPage);
  }, [currentPage]);

  // useEffect(() => {
  //   // Fetch the next page
  //   const fetchPage = async (pageNumber: number) => {
  //     const page = await getPage(book.GUID, pageNumber + 1);
  //     setPages((prevPages) => [...prevPages, page]);
  //   };

  //   if (currentPage > 0 && currentPage >= pages.length) {
  //     fetchPage(currentPage);
  //   }
  // }, [currentPage]);

  const back = () => {
    setCurrentPage(Math.max(currentPage - 1, 0));
  };

  const next = () => {
    setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    const iframe = document.getElementById(
      "flipping-pages-iframe"
    ) as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ selected: selected }, "*");
    }
  }, [selected]);

  return (
    <div className={styles.App}>
      <div className={styles.container}>
        <FlippingPages
          direction="right-to-left"
          selected={selected}
          onSwipeEnd={setSelected}
        >
          <div className={styles.page}>
            <img src={book.GeneratedImageID.toString()} alt="cover" />
            <h1>{book.Title}</h1>
          </div>
          {pages.map((page, index) => (
            <div className={styles.page} key={index}>
              <img
                src={page.GeneratedImageID.toString()}
                alt={`page-${index}`}
              />
              <p>{page.Text}</p>
            </div>
          ))}
        </FlippingPages>
      </div>
      <div className={styles.navigation}>
        <p>last todo</p>
        {currentPage > 0 && <span onClick={back}>{arrowLeftIcon}</span>}
        {<span onClick={next}>{arrowRightIcon}</span>}
        <Link href="/">
          <span className={styles["home-icon-wrapper"]}>{homeIcon}</span>
        </Link>
      </div>
      <div className={styles["page-count"]}>Page {currentPage + 1}</div>
    </div>
  );
};
