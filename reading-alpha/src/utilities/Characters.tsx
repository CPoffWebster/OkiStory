import { Character } from "../classes/character";

/**
 * Get a list of all default characters
 * @returns a list of all default characters
 */
export const getAllDefaultCharacters = async (): Promise<Character[]> => {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/api/characters/getAllDefaultCharacters`
  );
  const data = await response.json();
  return data.defaultCharacters;
};
