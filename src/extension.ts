import * as vscode from "vscode";
import { SkeduloTreeDataProvider } from "./SkeduloTreeDataProvider";
import { initAuthenticate } from "./AuthenticateTenant";
import { TenantManager } from "./TenantManager";
import StatusBar from "./StatusBar";

export function activate(context: vscode.ExtensionContext) {
  TenantManager.workspaceState = context.workspaceState;

  initAuthenticate(context);
  const statusBar = new StatusBar(context);

  const skeduloProvider = new SkeduloTreeDataProvider();
  vscode.window.registerTreeDataProvider("skedulo-detail", skeduloProvider);
  vscode.commands.registerCommand("skedulo.skedulo-detail:refresh", () => {
    skeduloProvider.refresh();
    statusBar.doUpdate();
  });
}

// This method is called when your extension is deactivated
export function deactivate() {}
