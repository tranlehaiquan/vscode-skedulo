import * as vscode from "vscode";
import Auth0Utils from "./auth0-utils";
import { Environment } from "./types";

export const openServer = async (tenant: string) => {
  const auth0 = new Auth0Utils();
  const accessToken = await auth0.performAuth0Login(tenant, Environment.Production);

  vscode.ExtensionKind

  return accessToken;
};