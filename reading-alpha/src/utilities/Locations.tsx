import { Location } from "../classes/location";
import { environ } from "../config";

/**
 * Get a list of all default location
 * @returns a list of all default location
 */
export const getAllDefaultLocations = async (): Promise<Location[]> => {
  const response = await fetch(
    `${environ.API_URL}/api/locations/getAllDefaultLocations`
  );
  const data = await response.json();
  return data;
};
