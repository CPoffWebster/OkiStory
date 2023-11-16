import { CharactersAttributes } from "@/services/database/models/Characters";
import { setSessionStorage } from "@/services/session";
import styles from "./Selection.module.css";
import React, { useState } from "react";

export interface StoryElement extends CharactersAttributes {}

type SelectionProps = {
  elementType: string;
  element: StoryElement;
  size?: string;
  onSelectElement?: () => void;
};

export const Selection: React.FC<SelectionProps> = ({
  elementType,
  element,
  size = "large",
  onSelectElement,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const handleSelectElement = async (element: StoryElement): Promise<void> => {
    setSessionStorage(elementType, element.GUID);
    if (onSelectElement) onSelectElement();
  };

  // Determine the container class based on the size
  const containerBoxSize =
    size === "large" ? "containerBoxLarge" : "containerBoxSmall";
  const selectionSize =
    size === "large" ? styles.selectionLarge : styles.selectionSmall;

  // Apply the grey style when onSelectElement is null
  const greyedOutClass = onSelectElement ? "" : styles.greyedOut;

  return (
    <span onClick={() => handleSelectElement(element)} key={element.GUID}>
      <div
        className={`${containerBoxSize} ${selectionSize} ${greyedOutClass} ${styles.selection}`}
      >
        <div className={styles.selectionImage}>
          {!imageLoaded && <div className={styles.imagePlaceholder}></div>}
          <img
            src={`/api/images/getImage?filename=${element.GCSLocation}&imageType=${elementType}`}
            onLoad={() => setImageLoaded(true)}
            alt={"selectionImage"}
            style={{ display: imageLoaded ? "block" : "none" }}
          />
        </div>
      </div>
      <span className={styles.sectionName}>{element.Name}</span>
    </span>
  );
};
