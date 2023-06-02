import * as vscode from "vscode";
import { AuthenticateTenant, getAuthenticate } from "./AuthenticateTenant";

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
      this.statusBar.text = `$(server) ${tenant?.name}`;
      this.statusBar.show();
      // add command to logout
      this.statusBar.command = AuthenticateTenant.commandLogout;
    } else {
      this.statusBar.text = `$(server) No tenant selected`;
      this.statusBar.command = AuthenticateTenant.commandLogin;
      this.statusBar.show();
    }
  }
}
