import * as vscode from "vscode";
import Auth0Utils from "./auth0-utils";
import { Environment } from "./types";

export class AuthenticateTenant {
  constructor(context: vscode.ExtensionContext) {
    let authenticateCommand = vscode.commands.registerCommand(
      "vscode-skedulo.openServer",
      async () => {
        this.authenticateTenant("trainingcxvn");
      }
    );

    context.subscriptions.push(authenticateCommand);
  }

  authenticateTenant = async (tenant: string) => {
    const auth0 = new Auth0Utils();
    const accessToken = await auth0.performAuth0Login(
      tenant,
      Environment.Production
    );

    return accessToken;
  };
}
