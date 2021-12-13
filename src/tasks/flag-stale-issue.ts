import { Actions } from "../action/actions";
import { IssueHandler } from "../issue/issue-handler";
import { IssueInfo } from "../issue/issue-info";

export class FlagStaleIssue implements IssueHandler {

  constructor(readonly message: string) {

  }

  public execute(issueInfo: IssueInfo, actions: Actions): void {
    // already have 
    if (issueInfo.hasLabel('lifecycle/frozen') || issueInfo.hasLabel('lifecycle/stale')) {
      return;
    }

    const info: string = "Add lifecycle/stale as issue is inactive";
    console.info('Adding lifecycle/stale on issue ' + issueInfo.humanUrl());
    actions.getAddLabels().add(["lifecycle/stale"], info);
    actions.getAddComment().comment(this.message);
  }
}
