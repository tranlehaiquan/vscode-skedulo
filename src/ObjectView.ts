// this object show all Object (schema) in the tenant
import * as vscode from "vscode";
import {
  BaseObjectSchema,
  CustomObjectSchema,
  getAllSchemas,
} from "./Services";
import { getCurrentLoginTenant } from "./AuthenticateTenant";
import * as fs from "fs-extra";
import { COMMANDS } from "./commands";
import path = require("path");

class ObjectView implements vscode.TreeDataProvider<any> {
  private _onDidChangeTreeData: vscode.EventEmitter<
    ObjectTreeItem | undefined | void
  > = new vscode.EventEmitter<ObjectTreeItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<
    ObjectTreeItem | undefined | void
  > = this._onDidChangeTreeData.event;
  private objectSchema: (CustomObjectSchema | BaseObjectSchema)[] = [];

  constructor(context: vscode.ExtensionContext) {
    console.log("ObjectView constructor");
    context.subscriptions.push(
      vscode.commands.registerCommand(COMMANDS.REFRESH_OBJECTS, () =>
        this.refresh()
      )
    );

    context.subscriptions.push(
      vscode.commands.registerCommand(COMMANDS.PULL_OBJECTS, async () => {
        try {
          await this.pullObjectsFile();
        } catch (error) {
          vscode.window.showErrorMessage(
            (error as any)?.message || "Something went wrong"
          );
        }
      })
    );
  }

  async pullObjectsFile() {
    // pull all object file from server
    const objects = await getAllSchemas();
    const workspacePath =
      vscode.workspace.workspaceFolders?.[0].uri.fsPath || "";

    // write to file object.json
    const result = await fs.writeFile(
      path.resolve(workspacePath, "objects.json"),
      JSON.stringify(objects, null, 2)
    );

    return result;
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  async getChildren(element?: any) {
    // if root
    if (!element) {
      const tenant = getCurrentLoginTenant();
      if (!tenant) {
        return Promise.resolve([]);
      }

      const objects = await getAllSchemas();
      const objectTreeItem = objects.map(
        (object) =>
          new ObjectTreeItem(object.name, vscode.TreeItemCollapsibleState.None)
      );

      return objectTreeItem;
    }

    return Promise.resolve([]);
  }

  getTreeItem(element: any): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }
}

class ObjectTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command
  ) {
    super(label, collapsibleState);
    this.contextValue = "object";
  }
}

export default ObjectView;
