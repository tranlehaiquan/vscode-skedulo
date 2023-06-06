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

  // pull all objects and fields file from server
  async pullObjectsFile() {
    // create skedulo/objects folder
    debugger;

    const workspacePath =
      vscode.workspace.workspaceFolders?.[0].uri.fsPath || "";

    const objectFolder = path.resolve(workspacePath, "skedulo/objects");
    await fs.mkdir(objectFolder, {
      recursive: true,
    });

    const objects = await getAllSchemas();

    return await Promise.all(
      objects.map(async (object) => {
        const objectPath = path.resolve(objectFolder, object.name);
        await fs.mkdir(objectPath);
        // also create folder fields
        const fieldsPath = path.resolve(objectPath, "fields");
        await fs.mkdir(fieldsPath);
      })
    );
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
