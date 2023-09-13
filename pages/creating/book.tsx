import React, { useEffect } from "react";
import "./book.css";
import { createNewBook } from "@/services/books";

export default function creatingBookLoader() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const creatingBook = await createNewBook(90, 9);
        console.log(creatingBook);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>BookLoader</h1>
    </div>
  );
}
