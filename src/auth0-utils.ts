import { Request, Response } from "express";
import * as express from "express";
import * as crypto from "node:crypto";
import * as http from "node:http";
import * as url from "node:url";
import * as vscode from "vscode";
// import open from "open";
import {
  ApiResult,
  Environment,
  HTTPHeaders,
  HTTPMethod,
  SkedError,
  TeamAuthConfig,
} from "./types";
import { performRequest } from "./http/httputils";

const apiGateways: Record<Environment, string> = {
  [Environment.Production]: "https://api.skedulo.com",
  [Environment.Staging]: "https://staging-api.test.skl.io",
  [Environment.Test]: "https://dev-api.test.skl.io",
};

export const getTeamAuthConfig = async (
  teamName: string,
  environment: Environment = Environment.Production
): Promise<TeamAuthConfig> => {
  const apiGateway = apiGateways[environment];
  try {
    const {
      data: { result },
    } = await performRequest<ApiResult<TeamAuthConfig>>({
      method: HTTPMethod.GET,
      url: `${apiGateway}/auth/config/team/web?name=${teamName}`,
    });

    return result;
  } catch (e) {
    const result: any = e;
    if (
      result.response.status === 400 &&
      result.response.data.errorType === "invalid_tenant_domain"
    ) {
      throw new SkedError(
        `No tenant named "${teamName}" was found for in the "${environment}" environment`
      );
    } else {
      throw e as SkedError;
    }
  }
};

export default class Auth0Utils {
  async performAuth0Login(
    teamName: string,
    environment = Environment.Production
  ): Promise<string> {
    // generate the auth url based on team name and env
    const auth0Config = await getTeamAuthConfig(teamName, environment);

    const verifier = this.getVerifier();
    const challenge = this.getChallenge(verifier);
    const authURL = this.buildAuthURL(challenge, auth0Config);

    // open the Skedulo web app in the users browser and start the express server
    // open(authURL);
    // open url in browser
    vscode.env.openExternal(vscode.Uri.parse(authURL));

    const code = await this.runAuthCallbackServer();
    const token = await this.performTokenExchange(code, verifier, auth0Config);
    return token;
  }

  private buildAuthURL(codeChallenge: string, config: TeamAuthConfig): string {
    const formData = new url.URLSearchParams();
    formData.append("response_type", "code");
    formData.append("code_challenge", codeChallenge);
    formData.append("code_challenge_method", "S256");
    formData.append(
      "connection",
      config.auth0.lock.allowedConnections.join(",")
    );
    formData.append("audience", config.auth0.audience);
    formData.append("client_id", config.auth0.clientId);
    formData.append("redirect_uri", "http://localhost:8888/authorize.html");

    return `https://${config.auth0.domain}/authorize?${formData.toString()}`;
  }

  private async performTokenExchange(
    code: string,
    verifier: string,
    config: TeamAuthConfig
  ): Promise<string> {
    const formData = new url.URLSearchParams();
    formData.append("grant_type", "authorization_code");
    formData.append("client_id", config.auth0.clientId); // "9mEJC0qKEZInTa8O2uS30mdwLUyj6YrH");
    formData.append("code_verifier", verifier);
    formData.append("code", code);
    formData.append("redirect_uri", "http://localhost:8888/authorize.html");
    formData.append("scope", "offline_access");

    const result = await performRequest({
      method: HTTPMethod.POST,
      url: `https://${config.auth0.domain}/oauth/token`,
      headers: new HTTPHeaders({
        ContentType: "application/x-www-form-urlencoded",
      }),
      body: formData.toString(),
    });
    return result.data.access_token;
  }

  private async runAuthCallbackServer(): Promise<string> {
    const app = express();

    // if it's stupid and it works, it ain't stupid
    let resolve: (code: string) => void;
    const codePromise = new Promise((_resolve) => {
      resolve = _resolve;
    });

    app.get("/authorize.html", async (req: Request, res: Response) => {
      resolve(req.query.code as string);
      res.setHeader("Content-Type", "text/html");
      res.send(
        "Please close this window and return to your terminal to continue using the Skedulo CLI."
      );
    });

    const server = http.createServer(app);

    server.listen(8888, () => {
      console.log("Opening your default browser to login to Skedulo");
    });

    const code = await codePromise;
    server.close();

    return code as string;
  }

  private base64URLEncode(str: Buffer): string {
    return str
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
  }

  private getVerifier(): string {
    return this.base64URLEncode(crypto.randomBytes(32));
  }

  private sha256(input: Buffer) {
    return crypto.createHash("sha256").update(input).digest();
  }

  private getChallenge(verifier: string): string {
    return this.base64URLEncode(this.sha256(Buffer.from(verifier)));
  }
}
