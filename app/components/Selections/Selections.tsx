import { CharactersAttributes } from "@/services/database/models/Characters";
import styles from "./Selections.module.css";
import { Selection } from "./Selection";

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
  return (
    <div className={styles["selection-container"]}>
      {elements.map((element) => (
        <Selection
          elementType={elementType}
          element={element}
          onSelectElement={onSelectElement}
        />
      ))}
    </div>
  );
};
