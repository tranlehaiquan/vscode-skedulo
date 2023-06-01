import axios, { AxiosHeaders } from "axios";
import {
  AuthRequestOptions,
  HTTPMethod,
  HTTPResponse,
  RequestOptions,
} from "../types";

/**
 * Makes a call to Skedulo using the given details, handles authentication and baseurl.
 *
 * @param {AuthRequestOptions} AuthRequestOptions the options to use for the request
 * @returns {HTTPResponse} the response from the HTTP call
 */
export async function performAuthRequest<T = any, D = any>({
  auth: { accessToken, apiBasePath },
  headers,
  endpoint,
  method,
  body,
}: AuthRequestOptions): Promise<HTTPResponse<T, D>> {
  // set headers if not provided
  if (!headers) {
    headers = new AxiosHeaders();
  }

  headers.Authorization = `Bearer ${accessToken}`;

  const fullURL = `${apiBasePath}${endpoint}`;
  return performRequest({
    method: method,
    url: fullURL,
    headers: headers,
    body: body,
  });
}

/**
 * Perform a HTTP request, only intended for direct use if calling non-skedulo endpoints.
 * If calling skedulo, performAuthRequest should be used.
 *
 * @param {RequestOptions} RequestOptions the options to use for the request
 * @returns {HTTPResponse} the response from the HTTP call
 */
export async function performRequest<T = any, D = any>({
  method,
  url,
  headers,
  body,
}: RequestOptions): Promise<HTTPResponse<T, D>> {
  const axiosConfig = {
    headers: headers,
  };
  switch (method) {
    case HTTPMethod.GET: {
      const result = await axios.get(url, axiosConfig);
      return result;
    }

    case HTTPMethod.POST: {
      const result = await axios.post(url, body, axiosConfig);
      return result;
    }

    case HTTPMethod.PUT: {
      const result = await axios.put(url, body, axiosConfig);
      return result;
    }

    case HTTPMethod.DELETE: {
      const result = await axios.delete(url, axiosConfig);
      return result;
    }
  }
}
