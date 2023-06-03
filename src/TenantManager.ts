import * as vscode from "vscode";

type TenantInfo = {
  name: string;
  accessToken: string;
};

const KEY = "vscode-skedulo-tenant-manager";

export class TenantManager {
  static workspaceState: vscode.Memento;

  static addTenantToGlobalState(tenant: TenantInfo) {
    const tenants = TenantManager.workspaceState.get<Record<string, TenantInfo>>(
      KEY,
      {}
    );
    tenants[tenant.name] = tenant;

    return TenantManager.workspaceState.update(KEY, tenants);
  }
}

export default TenantManager;