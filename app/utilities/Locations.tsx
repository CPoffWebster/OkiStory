import { Location } from "../classes/location";

/**
 * Get a list of all default location
 * @returns a list of all default location
 */
export const getAllDefaultLocations = async (): Promise<Location[]> => {
  const response = await fetch(`/api/locations/getAllDefaultLocations`);
  const data = await response.json();
  return data.defaultLocations;
};