import React, { useEffect, useState } from "react";
import { createNewBook } from "@/services/books";
import { decrypt } from "@/services/encryption"; // Import your decryption function
import "./book.css";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const encryptedData = context.query.data;
  if (encryptedData) {
    const { theme, hero } = JSON.parse(decrypt(encryptedData as string));
    return {
      props: {
        theme,
        hero,
      },
    };
  }
  return {
    props: {},
  };
};

export default function creatingBookLoader(theme: number, hero: number) {
  const [count, setCount] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const creatingBook = await createNewBook(theme, hero);
        console.log(creatingBook);
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
