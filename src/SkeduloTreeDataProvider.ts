// vscode skedulo tree view
import * as vscode from "vscode";
import TenantManager from "./TenantManager";

// a hello the world view
export class SkeduloTreeDataProvider
  implements vscode.TreeDataProvider<SkeduloTreeItem>
{
  private _onDidChangeTreeData: vscode.EventEmitter<
    SkeduloTreeItem | undefined | void
  > = new vscode.EventEmitter<SkeduloTreeItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<
    SkeduloTreeItem | undefined | void
  > = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: SkeduloTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(
    element?: SkeduloTreeItem | undefined
  ): vscode.ProviderResult<SkeduloTreeItem[]> {
    const tenant = TenantManager.getCurrentTenant();

    if (tenant) {
      return Promise.resolve([
        new SkeduloTreeItem(tenant.name, vscode.TreeItemCollapsibleState.None),
      ]);
    }

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
