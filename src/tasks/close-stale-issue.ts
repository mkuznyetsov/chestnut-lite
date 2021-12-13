import { Actions } from "../action/actions";
import { IssueHandler } from "../issue/issue-handler";
import { IssueInfo } from "../issue/issue-info";

export class CloseStaleIssue implements IssueHandler {

  constructor(readonly message: string) {

  }

  public execute(issueInfo: IssueInfo, actions: Actions): void {
    // already have 
    if (!issueInfo.hasLabel('lifecycle/stale')) {
      return;
    }

    const info: string = "Close lifecycle/stale as issue is inactive since 7 days and is flagged lifecycle/stale";
    console.info('Close lifecycle/stale as issue is inactive since 7 days and is flagged lifecycle/stale ' + issueInfo.humanUrl());
    actions.getCloseIssue().close();
  }
}
