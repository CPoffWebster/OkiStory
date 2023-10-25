import { CharactersAttributes } from "@/services/database/models/Characters";
import { setSessionStorage } from "@/services/session";
import Image from "next/image";
import styles from "./Selections.module.css";

export interface StoryElement extends CharactersAttributes {}

type SelectionsProps = {
  elementType: string;
  elements: StoryElement[];
  onSelectElement: () => void;
};

export const Selections: React.FC<SelectionsProps> = ({
  elementType,
  elements,
  onSelectElement,
}) => {
  const handleSelectElement = async (element: StoryElement): Promise<void> => {
    setSessionStorage(elementType, element.GUID);
    onSelectElement();
  };

  return (
    <div className={styles["selection-container"]}>
      {elements.map((element, index) => (
        <span onClick={() => handleSelectElement(element)} key={index}>
          <div
            className={`${styles["selection"]} ${[
              "clickable-container-large",
            ]}`}
          >
            <div className={styles["selection-image"]}>
              <Image
                src={`/api/images/getImage?filename=${element.GCSLocation}&imageType=${elementType}`}
                layout="fill"
                objectFit="contain"
                priority={true}
                alt={"selection-image"}
              />
            </div>
          </div>
          <span className={styles["section-name"]}>{element.Name}</span>
        </span>
      ))}
    </div>
  );
};
