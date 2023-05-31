// vscode skedulo tree view
import * as vscode from "vscode";

// a hello the world view
export class SkeduloTreeDataProvider
  implements vscode.TreeDataProvider<SkeduloTreeItem>
{
  getTreeItem(element: SkeduloTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(
    element?: SkeduloTreeItem | undefined
  ): vscode.ProviderResult<SkeduloTreeItem[]> {
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
