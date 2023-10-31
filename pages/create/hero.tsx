import { arrowLeftIcon } from "@/data/icons";
import { useRouter } from "next/router";
import { CharactersAttributes } from "@/services/database/models/Characters";
import { Selections } from "@/app/components/Selections/Selections";
import styles from "./story.module.css";
import axios from "axios";
import { useEffect, useState } from "react";

export interface StoryElement extends CharactersAttributes {}

export default function Story() {
  const router = useRouter();
  const selectionType = "Hero";
  const [heroes, setHeroes] = useState<StoryElement[] | null>(null);

  // Get heroes from database
  const getHeroes = async () => {
    const charactersList = await axios.post("/api/create/getHeroes");
    setHeroes(charactersList.data.heroes);
  };

  // Initial load of heroes
  useEffect(() => {
    getHeroes();
  }, []);

  const handleSelectElement = async (): Promise<void> => {
    const response = await axios.post("/api/generation/story", {
      locationGUID: sessionStorage.getItem("Theme"),
      characterGUID: sessionStorage.getItem("Hero"),
      themeGUID: 0,
    });
    sessionStorage.clear();
    router.push(`/read/${response.data.bookGuid}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span
          onClick={() => router.push("/create/theme")}
          className={`${styles.leftClick} ${["clickable-container-small"]}`}
        >
          {arrowLeftIcon}
        </span>
        <h2 className={styles.title}>
          Choose your <u className={styles.titleFiller}>{selectionType}</u>!{" "}
        </h2>
        <div></div>
      </div>
      {heroes && (
        <Selections
          elementType={selectionType}
          elements={heroes}
          onSelectElement={handleSelectElement}
        ></Selections>
      )}
    </div>
  );
}
