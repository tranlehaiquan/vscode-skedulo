// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { SkeduloTreeDataProvider } from "./SkeduloTreeDataProvider";
import { TenantTreeView } from './TenantTreeDataProvider';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "vscode-skedulo.helloWorld",
    async () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      const answer = await vscode.window.showInformationMessage(
        "How are you?",
        "Good",
        "Bad"
      );

      if (answer === "Good") {
        vscode.window.showInformationMessage("That's great!");
      }

      if (answer === "Bad") {
        vscode.window.showInformationMessage("That's too bad!");
      }
    }
  );
  context.subscriptions.push(disposable);
  
  const skeduloProvider = new SkeduloTreeDataProvider();
  vscode.window.registerTreeDataProvider("skedulo-detail", skeduloProvider);

  const skeduloTenantProvider = new TenantTreeView();
  vscode.window.registerTreeDataProvider("skedulo-tenant", skeduloTenantProvider);
}

// This method is called when your extension is deactivated
export function deactivate() {}
