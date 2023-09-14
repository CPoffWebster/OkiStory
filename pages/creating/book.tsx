import React, { useEffect, useState } from "react";
import { createNewBook } from "@/services/books";
import {
  doubleDecryptSession,
  doubleEncryptSession,
} from "@/services/encryption";
import { useRouter } from "next/router";
import "./book.css";

export default function creatingBookLoader() {
  const router = useRouter();
  const [count, setCount] = useState(1);

  useEffect(() => {
    const hero = (doubleDecryptSession("hero") as unknown as number) || 0;
    const theme = (doubleDecryptSession("theme") as unknown as number) || 0;
    if (hero === 0 || theme === 0) {
      router.push("/");
      return;
    }
    const fetchData = async () => {
      try {
        const creatingBook = await createNewBook(theme, hero);
        doubleEncryptSession("book", JSON.stringify(creatingBook));
        router.push("/read/book");
        return;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => prevCount + 1);
    }, 1000);

    // Stop at 3
    if (count >= 3) {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [count]);

  return (
    <div>
      <h1>BookLoader</h1>
      <h2>Mimicking await time...: {count}</h2>
    </div>
  );
}
