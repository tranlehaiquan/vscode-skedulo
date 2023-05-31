// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { SkeduloTreeDataProvider } from "./SkeduloTreeDataProvider";
import { openServer } from "./httpServerSample";

export function activate(context: vscode.ExtensionContext) {
  // vscode-skedulo.openServer command
  let disposableServerOpen = vscode.commands.registerCommand(
    "vscode-skedulo.openServer",
    async () => {
      openServer('trainingcxvn');
    }
  );
  context.subscriptions.push(disposableServerOpen);

  const skeduloProvider = new SkeduloTreeDataProvider();
  vscode.window.registerTreeDataProvider("skedulo-detail", skeduloProvider);
}

// This method is called when your extension is deactivated
export function deactivate() {}
