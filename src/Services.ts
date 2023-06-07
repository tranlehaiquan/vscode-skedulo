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

// get all schema
export const getAllSchemas = async (): Promise<
  (BaseObjectSchema | CustomObjectSchema)[]
> => {
  // check if instance.defaults.headers.common["Authorization"] is set
  if (!instance.defaults.headers.common["Authorization"]) {
    throw new Error("Not authenticated");
  }
  // if not set, throw error
  const base = getBaseSchemas();
  const custom = getCustomSchemas();

  const [baseRes, customRes] = await Promise.all([base, custom]);
  const result = [...baseRes.result, ...customRes.result];
  return result;
};

export type CustomField = {
  id: string;
  name: string;
  schemaName: string;
  label: string;
  description: string | null;
  fieldType: string;
  mapping: string;
  referenceSchemaName: string | null;
  referenceSchemaFieldName: string | null;
  required: boolean;
  upsertKey: boolean;
  accessMode: string;
  readOnly: boolean;
  maxLength: number | null;
  precision: number | null;
  scale: number | null;
  isAlert: boolean;
  showIf: string | null;
  showDesktop: boolean;
  showMobile: boolean;
  editableOnMobile: boolean;
  requiredOnMobile: boolean;
  displayOrder: number | null;
};

// get fields
export const getAllFields = async (): Promise<CustomField[]> => {
  const res = await instance.get(`/custom/fields?legacyAlertPrefix=false`);
  return res.data.result;
};

export default instance;
