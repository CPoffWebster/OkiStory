import React, { useEffect, useState } from "react";
import "./CharacterSelection.css";
import { getAllDefaultCharacters } from "../../utilities/Characters";
import { Character } from "../../classes/character";

export interface CharacterSelectionProps {
  sendCharacterInfo: (character: string) => void;
}

const CharacterSelection: React.FC<CharacterSelectionProps> = ({
  sendCharacterInfo,
}) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const fetchedCharacters = await getAllDefaultCharacters();
        setCharacters(fetchedCharacters);
        console.log("fetchedCharacters", fetchedCharacters);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError("Error fetching data");
      }
    };

    fetchData();
  }, []);

  const handleSelectCharacter = (character: string): void => {
    sendCharacterInfo(character);
  };

  return (
    <div>
      <h2 className="title">Character Selection</h2>
      <div className="selection-container">
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {!loading &&
          !error &&
          characters.map((character, index) => (
            <button
              className="selection-button"
              key={index}
              onClick={() => handleSelectCharacter(character.name)}
            >
              <img src={character.imageUrl} alt={character.name} />
              <br />
              {character.name}
            </button>
          ))}
      </div>
    </div>
  );
};

export default CharacterSelection;
