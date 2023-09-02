import { Character } from "../classes/character";
import { environ } from "../config";

/**
 * Get a list of all default characters
 * @returns a list of all default characters
 */
export const getAllDefaultCharacters = async (): Promise<Character[]> => {
  const response = await fetch(
    `${environ.API_URL}/api/characters/getAllDefaultCharacters`
  );
  const data = await response.json();
  return data.defaultCharacters;
};
