import { CharactersAttributes } from "@/services/database/models/Characters";
import { setSessionStorage } from "@/services/session";
import Image from "next/image";
import styles from "./Selection.module.css";

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
  );
};
