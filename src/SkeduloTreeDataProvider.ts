// vscode skedulo tree view
import { Schema } from "inspector";
import * as vscode from "vscode";
import {
  CustomObjectSchema,
  getCustomSchemas,
  getBaseSchemas,
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
  private objectSchema: CustomObjectSchema[] = [];

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: SkeduloTreeItem): vscode.TreeItem {
    return element;
  }

  async getItemObjectSchema() {
    const loginTenant = getCurrentLoginTenant();
    if (!loginTenant) {
      return [];
    }
    const customSchemas = await getCustomSchemas();
    const baseSchemas = await getBaseSchemas();

    const customObjectSchema = customSchemas.result.map(
      (schema) =>
        new SkeduloTreeItem(schema.name, vscode.TreeItemCollapsibleState.None)
    );

    const baseObjectSchema = baseSchemas.result.map(
      (schema) =>
        new SkeduloTreeItem(schema.name, vscode.TreeItemCollapsibleState.None)
    );

    return [...customObjectSchema, ...baseObjectSchema];
  }

  async getChildren(element?: SkeduloTreeItem | undefined) {
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

    const listTreeItem = Object.values(ListChildren).map(
      (label) =>
        new SkeduloTreeItem(label, vscode.TreeItemCollapsibleState.Collapsed)
    );

    return Promise.resolve(listTreeItem);
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
