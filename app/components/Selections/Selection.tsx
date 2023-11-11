import { CharactersAttributes } from "@/services/database/models/Characters";
import { setSessionStorage } from "@/services/session";
import styles from "./Selection.module.css";
import React, { useState } from "react";

export interface StoryElement extends CharactersAttributes {}

type SelectionProps = {
  elementType: string;
  element: StoryElement;
  onSelectElement: () => void;
};

export const Selection: React.FC<SelectionProps> = ({
  elementType,
  element,
  onSelectElement,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const handleSelectElement = async (element: StoryElement): Promise<void> => {
    setSessionStorage(elementType, element.GUID);
    onSelectElement();
  };

  return (
    <span onClick={() => handleSelectElement(element)} key={element.GUID}>
      <div
        className={`${styles["selection"]} ${["clickable-container-large"]}`}
      >
        <div className={styles["selection-image"]}>
          {!imageLoaded && <div className={styles["image-placeholder"]}></div>}
          <img
            src={`/api/images/getImage?filename=${element.GCSLocation}&imageType=${elementType}`}
            onLoad={() => setImageLoaded(true)}
            alt={"selection-image"}
            style={{ display: imageLoaded ? "block" : "none" }}
          />
        </div>
      </div>
      <span className={styles["section-name"]}>{element.Name}</span>
    </span>
  );
};
