import * as Octokit from "@octokit/rest";
import { Logger } from "./log/logger";
import { Stale } from "./stale/stale";

export class Main {

  async start(): Promise<boolean> {
    try {
      await this.flagStale();
      return true;
    } catch (error) {
      console.error('Unable to start', error);
      return false;
    }
  }

  async flagStale(): Promise<void> {
    const githubReadToken: string = process.env.GITHUB_TOKEN || "";
    if ("" === githubReadToken) {
      throw new Error("Unable to start as GITHUB_TOKEN is missing");
    }
    const githubRead: Octokit = new Octokit({ auth: `token ${githubReadToken}` });

    const githubPushToken: string = process.env.GITHUB_PUSH_TOKEN || "";
    if ("" === githubPushToken) {
      throw new Error("Unable to start as GITHUB_PUSH_TOKEN is missing");
    }

    const githubPush: Octokit = new Octokit({ auth: `token ${githubPushToken}` });
    const logger: Logger = new Logger();
    const stale = new Stale(githubRead, githubPush, logger);
    stale.compute();
  }
}

(async (): Promise<void> => {
  const main = new Main();
  const success = await main.start();
  if (!success) {
    process.exit(1);
  }
})();
