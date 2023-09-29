import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import {
  getAllDefaultCharacters,
  getAllDefaultLocations,
} from "@/services/storyElements";
import { arrowLeftIcon } from "@/data/icons";
import { useRouter } from "next/router";
import { CharactersAttributes } from "@/services/database/models/Characters";
import styles from "./story.module.css";
import { setSessionStorage } from "@/services/session";

export interface StoryElement extends CharactersAttributes {}

export const getServerSideProps: GetServerSideProps = async () => {
  const themes = await getAllDefaultLocations();
  const characters = await getAllDefaultCharacters();
  return {
    props: { themes, characters },
  };
};

export default function Story(props: {
  themes: StoryElement[];
  characters: StoryElement[];
}) {
  const router = useRouter();
  const [selectionType, setSelectionType] = useState<string>("Theme");
  const [elements, setElements] = useState<StoryElement[]>(props.themes);
  const [selectedTheme, setSelectedTheme] = useState<string>();

  const handleSelectElement = (element: StoryElement): void => {
    if (selectionType === "Theme") {
      setSelectedTheme(element.GUID);
      setSelectionType("Hero");
      setElements(props.characters);
    } else if (selectionType === "Hero") {
      setSessionStorage("hero", element.GUID);
      setSessionStorage("theme", selectedTheme!);
      router.push("/creating/book");
      return;
    }
  };

  const handleBack = (): void => {
    if (selectionType === "Hero") {
      setSelectionType("Theme");
      setElements(props.themes);
    }

    if (selectionType === "Theme") {
      router.push("/");
      return;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span
          onClick={handleBack}
          className={`${styles.leftClick} ${["clickable-container-small"]}`}
        >
          {arrowLeftIcon}
        </span>
        <h2 className={styles.title}>
          Choose your <u className={styles.titleFiller}>{selectionType}</u>!{" "}
        </h2>
        <div></div>
      </div>
      <div className={styles["selection-container"]}>
        {elements.map((element, index) => (
          <span onClick={() => handleSelectElement(element)} key={index}>
            <div
              className={`${styles["selection"]} ${[
                "clickable-container-large",
              ]}`}
            >
              <img
                src={`/api/images/getImage?filename=${element.Image}&imageType=${selectionType}`}
                className={styles["selection-image"]}
                alt={element.Name}
              />
            </div>
            <span className={styles["section-name"]}>{element.Name}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
