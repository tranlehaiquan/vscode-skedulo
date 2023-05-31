import * as vscode from "vscode";
import { SkeduloTreeDataProvider } from "./SkeduloTreeDataProvider";
import { AuthenticateTenant } from './tenantAuthenticate';

export function activate(context: vscode.ExtensionContext) {
  new AuthenticateTenant(context);

  const skeduloProvider = new SkeduloTreeDataProvider();
  vscode.window.registerTreeDataProvider("skedulo-detail", skeduloProvider);
}

// This method is called when your extension is deactivated
export function deactivate() {}
