import { arrowLeftIcon } from "@/data/icons";
import { useRouter } from "next/router";
import { CharactersAttributes } from "@/services/database/models/Characters";
import { Selections } from "@/app/components/Selections/Selections";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./story.module.css";

export interface StoryElement extends CharactersAttributes {}

export default function Story() {
  const router = useRouter();
  const selectionType = "Theme";
  const [themes, setThemes] = useState<StoryElement[] | null>(null);

  // Get themes from database
  const getThemes = async () => {
    const themesList = await axios.post("/api/create/getThemes");
    setThemes(themesList.data.themes);
  };

  // Initial load of themes
  useEffect(() => {
    getThemes();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span
          onClick={() => router.push("/")}
          className={`${styles.leftClick} ${["clickable-container-small"]}`}
        >
          {arrowLeftIcon}
        </span>
        <h2 className={styles.title}>
          Choose your <u className={styles.titleFiller}>{selectionType}</u>!{" "}
        </h2>
        <div></div>
      </div>
      {themes && (
        <Selections
          elementType={selectionType}
          elements={themes}
          onSelectElement={() => router.push("/create/hero")}
        ></Selections>
      )}
    </div>
  );
}
