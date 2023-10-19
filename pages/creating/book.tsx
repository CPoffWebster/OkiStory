import React, { useEffect, useState } from "react";
import { createNewBook } from "@/services/books";
import { useRouter } from "next/router";
import { getSessionStorage, setSessionStorage } from "@/services/session";

export default function CreatingBookLoader() {
  const router = useRouter();
  const [count, setCount] = useState(1);

  useEffect(() => {
    const hero = getSessionStorage("hero");
    const theme = getSessionStorage("theme");
    if (hero === "" || theme === "") {
      router.push("/");
      return;
    }
    const fetchData = async () => {
      try {
        const creatingBook = {
          id: 1,
          GUID: "1234567890",
          Title: "The Bear in the Forest",
          GeneratedImageID: 1,
          GeneratedTextID: 1,
          LocationID: 1,
          CharacterID: 1,
          ThemeID: 0,
          PageCount: 4,
          UserID: 1,
        }; // await createNewBook(theme, hero);
        setSessionStorage("book", JSON.stringify(creatingBook));
        router.push(`/read/${creatingBook.GUID}`);
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
