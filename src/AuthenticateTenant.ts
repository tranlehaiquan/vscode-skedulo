import * as vscode from "vscode";
import Auth0Utils from "./core/auth0-utils";
import { Environment, SkedError } from "./core/types";
import { setAuthenticate } from "./Services";
import { TenantManager } from "./TenantManager";
import { COMMANDS } from "./commands";

type TenantInfo = {
  name: string;
  accessToken: string;
};

// key store in workspaceState
const KEY_AUTHENTICATE = "vscode-skedulo-authenticate";

export class AuthenticateTenant {
  // current tenant
  private currentTenant: TenantInfo | undefined;

  constructor(context: vscode.ExtensionContext) {
    const authenticateCommand = vscode.commands.registerCommand(
      COMMANDS.LOGIN,
      async () => {
        // vscode open input tenant name
        const tenant = await TenantManager.showQuickPickTenants();

        if (tenant) {
          try {
            await this.loginTenant(tenant);

            vscode.commands.executeCommand(COMMANDS.REFRESH_EXTENSION);
            // show message success login
            vscode.window.showInformationMessage(
              "Successfully authenticated tenant: " + tenant
            );
          } catch (error) {
            if (error instanceof SkedError) {
              vscode.window.showErrorMessage(
                "Error authenticating tenant: " + (error as any).message
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

    const logoutCommand = vscode.commands.registerCommand(
      COMMANDS.LOGOUT,
      async () => {
        this.logoutTenant();
        vscode.commands.executeCommand(COMMANDS.REFRESH_EXTENSION);
      }
    );

    context.subscriptions.push(authenticateCommand);
    context.subscriptions.push(logoutCommand);
    this.loadAuthenticateFromWorkspaceState();
  }

  loadAuthenticateFromWorkspaceState() {
    const authenticate =
      TenantManager?.workspaceState.get<TenantInfo>(KEY_AUTHENTICATE);

    if (authenticate) {
      this.currentTenant = authenticate;
      setAuthenticate(authenticate.accessToken);
    }
  }

  async loginTenant(tenant: string) {
    const auth0 = new Auth0Utils();
    const accessToken = await auth0.performAuth0Login(
      tenant,
      Environment.Production
    );

    this.currentTenant = {
      name: tenant,
      accessToken,
    };

    // save to workspaceState
    TenantManager?.workspaceState.update(KEY_AUTHENTICATE, this.currentTenant);
    TenantManager.addTenantToGlobalState({ ...this.currentTenant });
    setAuthenticate(accessToken);
    return accessToken;
  }

  getCurrentTenant() {
    return this.currentTenant;
  }

  logoutTenant() {
    this.currentTenant = undefined;
    vscode.commands.executeCommand(COMMANDS.REFRESH_EXTENSION);
    // show message logout success
    vscode.window.showInformationMessage("Successfully logout tenant");

    // remove from workspaceState
    TenantManager?.workspaceState.update(KEY_AUTHENTICATE, undefined);
  }
}

let authenticateTenant: AuthenticateTenant;

export const initAuthenticate = (context: vscode.ExtensionContext) => {
  if (!authenticateTenant) {
    authenticateTenant = new AuthenticateTenant(context);
  }
  return authenticateTenant;
};

export const getAuthenticate = () => {
  return authenticateTenant;
};

export const getCurrentLoginTenant = () => {
  return authenticateTenant.getCurrentTenant();
};
