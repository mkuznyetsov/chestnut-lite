import * as GitHub from "@octokit/rest";

/**
 * Remove a label on a specific issue and notify the notifier.
 */
export class RemoveLabel {

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

  public remove(name: string, link: string): void {
    const params: GitHub.IssuesRemoveLabelParams = {
      issue_number: this.issueNumber,
      name,
      owner: this.owner,
      repo: this.repo
    };

    this.githubPush.issues.removeLabel(params);
    console.info("Removed the label " + name + " on issue " + this.issueNumber + ":" + link);
  }
}
