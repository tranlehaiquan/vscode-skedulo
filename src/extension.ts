import * as vscode from "vscode";
import { SkeduloTreeDataProvider } from "./DetailView";
import { initAuthenticate } from "./AuthenticateTenant";
import { TenantManager } from "./TenantManager";
import StatusBar from "./StatusBar";
import ObjectView from "./ObjectView";
import { COMMANDS } from "./commands";

export function activate(context: vscode.ExtensionContext) {
  TenantManager.workspaceState = context.workspaceState;

  initAuthenticate(context);
  const statusBar = new StatusBar(context);

  const skeduloProvider = new SkeduloTreeDataProvider();
  vscode.window.registerTreeDataProvider("skedulo-detail", skeduloProvider);

  const objectsView = new ObjectView(context);
  vscode.window.registerTreeDataProvider("skedulo-objects", objectsView);

  vscode.commands.registerCommand(COMMANDS.REFRESH_EXTENSION, () => {
    skeduloProvider.refresh();
    objectsView.refresh();
    statusBar.doUpdate();
  });
}

// This method is called when your extension is deactivated
export function deactivate() {}
