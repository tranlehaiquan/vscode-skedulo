import * as vscode from "vscode";
import { SkeduloTreeDataProvider } from "./SkeduloTreeDataProvider";
import { AuthenticateTenant } from "./AuthenticateTenant";
import { TenantManager } from "./TenantManager";

export function activate(context: vscode.ExtensionContext) {
  TenantManager.workspaceState = context.workspaceState;

  new AuthenticateTenant(context);

  const skeduloProvider = new SkeduloTreeDataProvider();
  vscode.window.registerTreeDataProvider("skedulo-detail", skeduloProvider);
  vscode.commands.registerCommand("skedulo.skedulo-detail:refresh", () => {
    skeduloProvider.refresh();
  });

  // register command skedulo.showStatus
  vscode.commands.registerCommand("skedulo.showStatus", () => {
    const myStatusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      100
    );
    myStatusBarItem.command = "skedulo.showStatus";
    context.subscriptions.push(myStatusBarItem);
    myStatusBarItem.text = `$(skedulo) line(s) selected`;
    myStatusBarItem.show();
  });
}

// This method is called when your extension is deactivated
export function deactivate() {}
