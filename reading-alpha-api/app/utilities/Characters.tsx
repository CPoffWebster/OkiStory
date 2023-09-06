import { Character } from "../classes/character";

/**
 * Get a list of all default characters
 * @returns a list of all default characters
 */
export const getAllDefaultCharacters = async (): Promise<Character[]> => {
  const response = await fetch(`/api/characters/getAllDefaultCharacters`);
  const data = await response.json();
  return data.defaultCharacters;
};
