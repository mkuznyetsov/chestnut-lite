import * as GitHub from "@octokit/rest";

/**
 * Close a given issue
 */
export class CloseIssue {

  private githubPush: GitHub;
  private owner: string;
  private repo: string;
  private issueNumber: number;

  constructor(githubPush: GitHub, owner: string, repo: string, issueNumber: number) {
    this.githubPush = githubPush;
    this.owner = owner;
    this.repo = repo;
    this.issueNumber = issueNumber;
  }

  public async close(): Promise<void> {
    const params: GitHub.IssuesUpdateParams = {
      issue_number: this.issueNumber,
      owner: this.owner,
      repo: this.repo,
      state: "closed"
    };

    await this.githubPush.issues.update(params);
  }
}
