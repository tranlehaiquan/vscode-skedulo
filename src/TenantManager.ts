import * as vscode from "vscode";

type TenantInfo = {
  name: string;
  accessToken: string;
};

const KEY = "vscode-skedulo-tenant-manager";

export class TenantManager {
  static workspaceState: vscode.Memento;

  static addTenantToGlobalState(tenant: TenantInfo) {
    const tenants = TenantManager.workspaceState.get<
      Record<string, TenantInfo>
    >(KEY, {});
    tenants[tenant.name] = tenant;

    return TenantManager.workspaceState.update(KEY, tenants);
  }

  static async showQuickPickTenants() {
    const tenants = TenantManager.workspaceState.get<
      Record<string, TenantInfo>
    >(KEY, {});

    const tenantNames = Object.keys(tenants);
    const NEW_TENANT = "New tenant";
    // also add option to login new tenant
    tenantNames.push(NEW_TENANT);

    const tenant = await vscode.window.showQuickPick(tenantNames);

    if (tenant === NEW_TENANT) {
      // open new window to input
      return await vscode.window.showInputBox({
        prompt: "Enter tenant name",
        placeHolder: "Eg: trainingcxvn",
      });
    }

    return tenant;
  }
}

export default TenantManager;
