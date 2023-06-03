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

export type CustomObjectSchema = {
  description: string;
  id: string;
  label: string;
  mapping: string;
  name: string;
};

export type BaseObjectSchema = {
  name: string;
  label: string;
  mapping: string;
};

// Get all custom schemas
export const getCustomSchemas = async (): Promise<{
  result: CustomObjectSchema[];
}> => {
  const res = await instance.get("/custom/schemas");
  return res.data;
};

// get all schema
export const getBaseSchemas = async (): Promise<{
  result: BaseObjectSchema[];
}> => {
  const res = await instance.get(`/custom/standard_schemas`);
  return res.data;
};

export default instance;
