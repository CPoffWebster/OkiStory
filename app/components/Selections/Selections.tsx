import { CharactersAttributes } from "@/services/database/models/Characters";
import styles from "./Selections.module.css";
import { Selection } from "./Selection";

export interface StoryElement extends CharactersAttributes {}

type SelectionsProps = {
  elementType: string;
  elements: StoryElement[];
  size?: string;
  onSelectElement: () => void;
};

export const Selections: React.FC<SelectionsProps> = ({
  elementType,
  elements,
  onSelectElement,
}) => {
  return (
    <div className={styles.selectionsContainer}>
      {elements.map((element) => (
        <Selection
          key={element.GUID}
          elementType={elementType}
          element={element}
          onSelectElement={onSelectElement}
        />
      ))}
    </div>
  );
};
