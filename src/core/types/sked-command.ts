import { HTTPHeaders, HTTPMethod } from "./http";

export interface UrlOptions {
  text: string;
  uri: string;
  params?: any;
}

export interface PerformAuthRequestOptions {
  endpoint: string;
  method: HTTPMethod;
  headers?: HTTPHeaders;
  body?: any;
  alias?: string;
}
