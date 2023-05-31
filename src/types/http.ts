import { AxiosHeaders, AxiosResponse } from "axios";
import { HTTPHeaders } from ".";

export enum HTTPMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

// we do this so we don't expose any external deps. to axios if we change to another pkg later
export type HTTPResponse<T = any, D = any> = AxiosResponse<T, D>;
export { AxiosHeaders as HTTPHeaders };

export interface RequestOptions {
  method: HTTPMethod;
  url: string;
  headers?: HTTPHeaders;
  body?: any;
}

export interface AuthRequestOptions {
  auth: SkeduloAuthOptions;
  endpoint: string;
  method: HTTPMethod;
  headers?: HTTPHeaders;
  body?: any;
}

export interface SkeduloAuthOptions {
  accessToken: string;
  apiBasePath: string;
}
