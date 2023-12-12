import { useRouter } from "next/router";
import { CharactersAttributes } from "@/services/database/models/Characters";
import { Selections } from "@/app/components/Selections/Selections";
import styles from "./story.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Button from "@/app/components/Button/Button";
import { HomeIcon } from "@/app/components/Icons/HomeIcon";

export interface StoryElement extends CharactersAttributes {}

export default function Story() {
  const router = useRouter();
  const selectionType = "Character";
  const [characters, setCharacters] = useState<StoryElement[] | null>(null);

  // Get characters from database
  const getCharacters = async () => {
    const charactersList = await axios.post("/api/create/getCharacters");
    setCharacters(charactersList.data.characters);
  };

  // Initial load of characters
  useEffect(() => {
    getCharacters();
  }, []);

  const handleSubmit = (): void => {
    router.push("/create/verify");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          Choose your <u className={styles.titleFiller}>{selectionType}</u>!{" "}
        </h2>
        <div></div>
      </div>
      {characters && (
        <Selections
          elementType={selectionType}
          elements={characters}
          onSelectElement={() => handleSubmit()}
        ></Selections>
      )}
      <div className={styles.buttonContainer}>
        <Button
          text="Home"
          className="containerBoxSmall"
          markedAsImportant={false}
          icon={<HomeIcon />}
          onClick={() => router.push("/")}
        ></Button>
      </div>
    </div>
  );
}
