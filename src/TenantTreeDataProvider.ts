// TenantTreeView
import * as vscode from "vscode";

export class TenantTreeView implements vscode.TreeDataProvider<Tenant> {
  getChildren(element?: Tenant | undefined): vscode.ProviderResult<Tenant[]> {
    const testTenant = new Tenant("Test Tenant");
    return [testTenant];
  }

  getTreeItem(element: Tenant): vscode.TreeItem {
    return element;
  }
}

class Tenant extends vscode.TreeItem {
  constructor(name: string) {
    super(name, vscode.TreeItemCollapsibleState.None);
  }
}
