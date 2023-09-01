import React from "react";
import { CharacterSelectionProps } from "../../classes/book";

const CharacterSelection: React.FC<CharacterSelectionProps> = ({
  sendCharacterInfo,
}) => {
  const handleSelectCharacter = (character: string): void => {
    sendCharacterInfo(character);
  };

  return (
    <div>
      <h2>Character Selection</h2>
      <button onClick={() => handleSelectCharacter("Character 1")}>
        Character 1
      </button>
      <button onClick={() => handleSelectCharacter("Character 2")}>
        Character 2
      </button>
    </div>
  );
};

export default CharacterSelection;
