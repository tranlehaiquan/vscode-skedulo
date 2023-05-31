import * as vscode from "vscode";
import TenantManager from "./TenantManager";
import Auth0Utils from "./auth0-utils";
import { Environment, SkedError } from "./types";

export class AuthenticateTenant {
  constructor(context: vscode.ExtensionContext) {
    let authenticateCommand = vscode.commands.registerCommand(
      "vscode-skedulo.authenticateTenant",
      async () => {
        // vscode open input tenant name
        const tenant = await vscode.window.showInputBox({
          prompt: "Enter tenant name",
          placeHolder: "trainingcxvn",
        });

        if (tenant) {
          try {
            await this.authenticateTenant(tenant);
            vscode.commands.executeCommand("skedulo.skedulo-detail:refresh");
            // show message success login
            vscode.window.showInformationMessage(
              "Successfully authenticated tenant: " + tenant
            );
          } catch (error) {
            if (error instanceof SkedError) {
              vscode.window.showErrorMessage(
                "Error authenticating tenant: " + error.message
              );
              return;
            }

            vscode.window.showErrorMessage(
              "Something went wrong authenticating tenant"
            );
          }
        }
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

    TenantManager.setCurrentTenant({
      name: tenant,
      accessToken,
    });

    return accessToken;
  };
}
