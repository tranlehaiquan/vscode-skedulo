// vscode skedulo tree view
import { Schema } from "inspector";
import * as vscode from "vscode";
import {
  CustomObjectSchema,
  getCustomSchemas,
  getBaseSchemas,
  BaseObjectSchema,
} from "./Services";
import { getCurrentLoginTenant } from "./AuthenticateTenant";
// TODO:
// Add TreeItem Objects
//  - collapsibleState: vscode.TreeItemCollapsibleState
//  - contextValue: string
// Add TreeItem ListView
// Add TreeItem Features Flag -> Quick check if tenant has feature enabled
// Add TreeItem Webhooks

// const ListChildren = ["Objects", "ListView", "Features", "Webhooks"];
enum ListChildren {
  OBJECTS = "Objects",
  LISTVIEW = "ListView",
  FEATURES = "Features",
  WEBHOOKS = "Webhooks",
}

export class SkeduloTreeDataProvider
  implements vscode.TreeDataProvider<SkeduloTreeItem>
{
  private _onDidChangeTreeData: vscode.EventEmitter<
    SkeduloTreeItem | undefined | void
  > = new vscode.EventEmitter<SkeduloTreeItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<
    SkeduloTreeItem | undefined | void
  > = this._onDidChangeTreeData.event;
  private objectSchema: (CustomObjectSchema | BaseObjectSchema)[] = [];

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  async getItemObjectSchema() {
    const loginTenant = getCurrentLoginTenant();
    if (!loginTenant) {
      return [];
    }
    const [customSchemas, baseSchemas] = await Promise.all([
      getCustomSchemas(),
      getBaseSchemas(),
    ]);

    const customObjectSchema = customSchemas.result.map(
      (schema) =>
        new SkeduloTreeItem(schema.name, vscode.TreeItemCollapsibleState.None)
    );

    const baseObjectSchema = baseSchemas.result.map((schema) => {
      const a = new SkeduloTreeItem(
        schema.name,
        vscode.TreeItemCollapsibleState.None
      );
      a.iconPath = new vscode.ThemeIcon("skedulo-logo");

      return a;
    });

    return [...baseObjectSchema, ...customObjectSchema].map((i) => {
      i.contextValue = "object";
      return i;
    });
  }

  getTreeItem(element: SkeduloTreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: SkeduloTreeItem | undefined) {
    // if root
    if (!element) {
      const listTreeItem = Object.values(ListChildren).map(
        (label) =>
          new SkeduloTreeItem(label, vscode.TreeItemCollapsibleState.Collapsed)
      );

      return Promise.resolve(listTreeItem);
    }

    // check if is authenticated
    const loginTenant = getCurrentLoginTenant();
    if (
      loginTenant &&
      element?.collapsibleState === vscode.TreeItemCollapsibleState.Collapsed
    ) {
      if (element.label === ListChildren["OBJECTS"]) {
        return await this.getItemObjectSchema();
      }
    }

    // for the rest
    return Promise.resolve([]);
  }
}

class SkeduloTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
    this.tooltip = `${this.label}`;
  }
}
