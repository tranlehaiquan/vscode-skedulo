import * as vscode from "vscode";

type TenantInfo = {
  name: string;
  accessToken: string;
};

const KEY = "vscode-skedulo-tenant-manager";

export class TenantManager {
  static workspaceState: vscode.Memento;
  private currentTenant: TenantInfo | undefined;

  getCurrentTenant(): TenantInfo | undefined {
    return this.currentTenant;
  }

  setCurrentTenant(tenant: TenantInfo) {
    this.currentTenant = tenant;
  }

  static addTentantToGlobalState(tenant: TenantInfo) {
    const tenants = TenantManager.workspaceState.get<Record<string, TenantInfo>>(
      KEY,
      {}
    );
    tenants[tenant.name] = tenant;

    return TenantManager.workspaceState.update(KEY, tenants);
  }
}

const tenantManager = new TenantManager();

export default tenantManager;
