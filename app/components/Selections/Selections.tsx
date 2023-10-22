import { CharactersAttributes } from "@/services/database/models/Characters";
import styles from "./Selections.module.css";
import { setSessionStorage } from "@/services/session";

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
            <img
              src={`/api/images/getImage?filename=${element.GCSLocation}&imageType=${elementType}`}
              className={styles["selection-image"]}
              alt={element.Name}
            />
          </div>
          <span className={styles["section-name"]}>{element.Name}</span>
        </span>
      ))}
    </div>
  );
};
