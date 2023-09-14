import React, { useState, useEffect } from "react";
import { BooksAttributes } from "@/services/database/models/Books";
import { getPage } from "@/services/books";
import { PagesAttributes } from "@/services/database/models/Pages";
import { arrowLeftIcon, arrowRightIcon, homeIcon } from "@/data/icons";
import { FlippingPages } from "flipping-pages";
import { doubleDecryptSession } from "@/services/encryption";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import "flipping-pages/dist/style.css";
import styles from "./book.module.css";

export default function BookReader() {
  const router = useRouter();
  const [book, setBook] = useState<BooksAttributes>({} as BooksAttributes);
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState<PagesAttributes[]>([]);
  const isLastPage = pages[currentPage]?.LastPage || false;

  useEffect(() => {
    const bookString = doubleDecryptSession("book");
    if (bookString === "") {
      router.push("/");
      return;
    }
    setBook(JSON.parse(bookString as string) as BooksAttributes);
  }, []);

  // For flipping pages
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    setCurrentPage(selected);
  }, [selected]);

  useEffect(() => {
    setSelected(currentPage);
  }, [currentPage]);

  useEffect(() => {
    // Fetch the next page
    const fetchPage = async (pageNumber: number) => {
      const page = await getPage(book.id, pageNumber + 1);
      setPages((prevPages) => [...prevPages, page]);
    };

    if (currentPage > 0 && currentPage >= pages.length) {
      fetchPage(currentPage);
    }
  }, [currentPage]);

  const back = () => {
    setCurrentPage(Math.max(currentPage - 1, 0));
  };

  const next = () => {
    if (!isLastPage) {
      setCurrentPage(currentPage + 1);
    }
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
            <Image src={book.CoverImage} alt="cover" />
            <h1>{book.Title}</h1>
          </div>
          {pages.map((page, index) => (
            <div className={styles.page} key={index}>
              <Image src={page.Image} alt={`page-${index}`} />
              <p>{page.Text}</p>
            </div>
          ))}
        </FlippingPages>
      </div>
      <div className={styles.navigation}>
        {currentPage > 0 && <span onClick={back}>{arrowLeftIcon}</span>}
        {!isLastPage && <span onClick={next}>{arrowRightIcon}</span>}
        <Link href="/">
          <span className={styles["home-icon-wrapper"]}>{homeIcon}</span>
        </Link>
      </div>
      <div className={styles["page-count"]}>Page {currentPage + 1}</div>
    </div>
  );
}
