import * as GitHub from "@octokit/rest";
import { AddLabel } from "./add-label";
import { AddComment } from "./add-comment";
import { RemoveLabel } from "./remove-label";
import { SetMilestone } from "./set-milestone";
import { CloseIssue } from "./close-issue";

/**
 * Actions are helpers for the tasks that needs to perform some "actions" on the github repository
 */
export class Actions {
  private addLabel: AddLabel;
  private addComment: AddComment;
  private setMilestone: SetMilestone;
  private removeLabel: RemoveLabel;
  private closeIssue: CloseIssue;

  constructor(githubPush: GitHub, owner: string, repo: string, issueNumber: number) {
    this.addLabel = new AddLabel(githubPush, owner, repo, issueNumber);
    this.removeLabel = new RemoveLabel(githubPush, owner, repo, issueNumber);
    this.setMilestone = new SetMilestone(githubPush, owner, repo, issueNumber);
    this.addComment = new AddComment(githubPush, owner, repo, issueNumber);
    this.closeIssue = new CloseIssue(githubPush, owner, repo, issueNumber);
  }

  public getAddLabels(): AddLabel {
    return this.addLabel;
  }

  public getAddComment(): AddComment {
    return this.addComment;
  }

  public getRemoveLabel(): RemoveLabel {
    return this.removeLabel;
  }

  public getSetMilestone(): SetMilestone {
    return this.setMilestone;
  }

  public getCloseIssue(): CloseIssue {
    return this.closeIssue;
  }

}
