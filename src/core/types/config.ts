import { Environment } from "./auth";

export interface UserConfig {
  accessToken: string;
  apiBasePath: string;
  environment: Environment;
  tenantId: string;
  userId: string;
  username: string;
  vendorInfo: {
    vendor: string;
    vendorUserId: string;
  };
}

export interface GlobalConfig {
  aliases: { [alias: string]: string };
  defaultUsername?: string;
  users: { [username: string]: UserConfig };
}

export interface CreateUserFromAccessTokenOptions {
  accessToken: string;
  environment?: Environment;
  overwrite?: boolean;
  teamName?: string;
}

export interface SetAliasOptions {
  alias: string;
  username: string;
  overwrite?: boolean;
}
