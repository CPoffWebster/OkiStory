import React, { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import { decrypt } from "@/services/encryption";
import { BooksAttributes } from "@/services/database/models/Books";
import { getPage } from "@/services/books";
import { PagesAttributes } from "@/services/database/models/Pages";
import { arrowLeftIcon, arrowRightIcon, homeIcon } from "@/data/icons";
import Link from "next/link";
import "./book.css";
import { FlippingPages } from "flipping-pages";
import "flipping-pages/dist/style.css";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const encryptedData = context.query.data;
  if (encryptedData) {
    const book = JSON.parse(decrypt(encryptedData as string));
    return {
      props: { book },
    };
  }
  return {
    props: {},
  };
};

export default function BookReader(props: { book: BooksAttributes }) {
  const { book } = props;
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState<PagesAttributes[]>([]);
  const isLastPage = pages[currentPage]?.LastPage || false;

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
    <div className="App">
      <div className="container">
        <FlippingPages
          direction="right-to-left"
          selected={selected}
          onSwipeEnd={setSelected}
        >
          <div className="page">
            <img src={book.CoverImage} alt="cover" />
            <h1>{book.Title}</h1>
          </div>
          {pages.map((page, index) => (
            <div className="page" key={index}>
              <img src={page.Image} alt={`page-${index}`} />
              <p>{page.Text}</p>
            </div>
          ))}
        </FlippingPages>
      </div>
      <div className="navigation">
        {currentPage > 0 && <span onClick={back}>{arrowLeftIcon}</span>}
        {!isLastPage && <span onClick={next}>{arrowRightIcon}</span>}
        <Link href="/">
          <span className="home-icon-wrapper">{homeIcon}</span>
        </Link>
      </div>
      <div className="page-count">Page {currentPage + 1}</div>
    </div>
  );
}
