import axios from "axios";

// create instance of axios with baseURL https://api.skedulo.com
const instance = axios.create({
  baseURL: "https://api.skedulo.com",
});

// fnc set Authenticate
export const setAuthenticate = (token: string) => {
  // if token empty unset Authorization header
  if (!token) {
    delete instance.defaults.headers.common["Authorization"];
    return;
  }

  instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export type ObjectSchema = {
  "name": string,
  "label": string,
  "mapping": string
}

// Get all custom schemas
export const getCustomSchemas = async (): Promise<ObjectSchema[]> => {
  const res = await instance.get("/custom/schemas");
  return res.data;
}

export default instance;
