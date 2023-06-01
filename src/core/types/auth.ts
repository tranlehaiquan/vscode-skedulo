export enum Environment {
  Production = "production",
  Staging = "staging",
  Test = "test",
}

export interface TeamAuthConfig {
  region: string;
  team: {
    name: string;
    tenantId?: string;
  };
  auth0: {
    clientId: string;
    audience: string;
    domain: string;
    lock: {
      allowedConnections: string[];
      theme: any; // don't care about this
    };
  };
  server: {
    api: string;
    uiPlatform: string;
  };
  newCustomerModel: boolean;
}

export interface RegionAuthConfig {
  region: string;
  auth0: {
    clientId: string;
    audience: string;
    domain: string;
  };
  server: {
    api: string;
    uiPlatform: string;
  };
  name: string;
}

export type AuthConfig = RegionAuthConfig | TeamAuthConfig;

export interface WhoamiOptions {
  accessToken: string;
  environment: Environment;
  teamName?: string;
}

export interface Whoami {
  username: string;
  userId: string;
  tenantId: string;
  roles: string[];
  resourceId: string;
  vendorInfo: {
    vendor: string;
    vendorUserId: string;
  };
  permissions: string[];
}
