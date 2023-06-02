// vscode skedulo tree view
import * as vscode from "vscode";
// TODO:
// Add TreeItem Objects
//  - collapsibleState: vscode.TreeItemCollapsibleState
//  - contextValue: string
// Add TreeItem ListView
// Add TreeItem Features Flag -> Quick check if tenant has feature enabled
// Add TreeItem Webhooks

const LIST_CHILDREN = ["Objects", "ListView", "Features", "Webhooks"];

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

  async getChildren(element?: SkeduloTreeItem | undefined) {
    if (element) {
      return Promise.resolve([]);
    }

    const listTreeItem = LIST_CHILDREN.map(
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
