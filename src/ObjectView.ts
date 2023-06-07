// this object show all Object (schema) in the tenant
import * as vscode from "vscode";
import {
  BaseObjectSchema,
  CustomField,
  CustomObjectSchema,
  getAllFields,
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
    const workspacePath =
      vscode.workspace.workspaceFolders?.[0].uri.fsPath || "";

    const objectFolder = path.resolve(workspacePath, "skedulo/objects");
    await fs.mkdir(objectFolder, {
      recursive: true,
    });

    const [objects, customFields] = await Promise.all([
      getAllSchemas(),
      getAllFields(),
    ]);

    // group customFields by schemaName
    const customFieldsGroupBySchemaName = customFields.reduce<
      Record<string, CustomField[]>
    >((pre, curr) => {
      const { schemaName } = curr;

      if (!pre[schemaName]) {
        pre[schemaName] = [curr];
      } else {
        pre[schemaName].push(curr);
      }
      return pre;
    }, {});

    return await Promise.all(
      objects.map(async (object) => {
        const objectPath = path.resolve(objectFolder, object.name);
        const fieldsPath = path.resolve(objectPath, "fields");

        await fs.mkdirs(fieldsPath);
        await fs.writeJson(path.resolve(objectPath, "object.json"), object, {
          spaces: 2,
        });

        // get custom fields
        const customFields = customFieldsGroupBySchemaName[object.name] || [];
        await Promise.all(
          customFields.map(async (field) => {
            const { name } = field;
            // create field file fields/[name].json
            await fs.writeJson(
              path.resolve(fieldsPath, `${name}.json`),
              field,
              {
                spaces: 2,
              }
            );
          })
        );
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
