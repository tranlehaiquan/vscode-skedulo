import * as vscode from "vscode";
import { AuthenticateTenant, getAuthenticate } from "./AuthenticateTenant";
import { COMMANDS } from "./commands";

export default class StatusBar {
  // private statusBar
  private statusBar: vscode.StatusBarItem;

  constructor(context: vscode.ExtensionContext) {
    this.statusBar = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left,
      100
    );

    this.doUpdate();
  }

  doUpdate() {
    const authenticate = getAuthenticate();
    const tenant = authenticate.getCurrentTenant();

    if (tenant) {
      this.statusBar.text = `$(skedulo-logo) ${tenant?.name}`;
      this.statusBar.command = COMMANDS.LOGOUT;
    } else {
      this.statusBar.text = `$(skedulo-logo) None`;
      this.statusBar.command = COMMANDS.LOGIN;
    }
    this.statusBar.show();
  }
}
