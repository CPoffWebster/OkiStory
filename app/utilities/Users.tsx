import axios from "axios";

/**
 * Get a list of all default location
 * @returns a list of all default location
 */
export const userLogin = async () => {
  const { data } = await axios.post("/api/users/verifyUser");
  const { access_token } = data;
  return access_token;
};

export const userLogout = async () => {
  await axios.post("/api/users/logout");
};

export const verifyUser = async () => {
  const { data } = await axios.post("/api/users/verifyUser");
  return data;
};
