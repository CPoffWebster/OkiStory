import React, { useEffect, useState } from "react";
import "./story.css";
import { GetServerSideProps } from "next";
import {
  getAllDefaultCharacters,
  getAllDefaultLocations,
} from "@/services/storyElements";
import { arrowLeftIcon } from "@/data/icons";
import { useRouter } from "next/router";
import { encrypt } from "@/services/encryption";
import { CharactersAttributes } from "@/services/database/models/Characters";

export interface StoryElement extends CharactersAttributes {}

export const getServerSideProps: GetServerSideProps = async () => {
  const themes = await getAllDefaultLocations();
  const characters = await getAllDefaultCharacters();
  return {
    props: { themes, characters },
  };
};

export default function story(props: {
  themes: StoryElement[];
  characters: StoryElement[];
}) {
  const router = useRouter();
  const [selectionType, setSelectionType] = useState<string>("Theme");
  const [elements, setElements] = useState<StoryElement[]>([]);
  const [selectedStoryElements, setSelectedStoryElements] = useState<any>({
    theme: 0,
    hero: 0,
  });

  useEffect(() => {
    setElements(props.themes);
  }, []);

  const handleSelectElement = (element: StoryElement): void => {
    if (selectionType === "Theme") {
      setSelectedStoryElements({ ...selectedStoryElements, theme: element.id });
      setSelectionType("Hero");
      setElements(props.characters);
    } else if (selectionType === "Hero") {
      const encryptedData = encrypt(
        JSON.stringify({
          ...selectedStoryElements,
          hero: element.id,
        })
      );
      router.push(`/creating/book?data=${encryptedData}`);
    }
  };

  const handleBack = (): void => {
    if (selectionType === "Hero") {
      setSelectionType("Theme");
      setElements(props.themes);
    }

    if (selectionType === "Theme") {
      router.push("/");
    }
  };

  return (
    <div className="container">
      <div className="header">
        <span onClick={handleBack}>{arrowLeftIcon}</span>
        <h2 className="title">
          Choose your <u>{selectionType}</u>!{" "}
        </h2>
        <div></div> {/* Empty div for layout balance */}
      </div>
      <div className="selection-container">
        {elements.map((element, index) => (
          <button
            className="selection-button"
            key={index}
            onClick={() => handleSelectElement(element)}
          >
            <img src={element.Image} alt={element.Name} />
            <br />
            {element.Name}
          </button>
        ))}
      </div>
    </div>
  );
}
