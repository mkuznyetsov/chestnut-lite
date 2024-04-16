
import * as Octokit from "@octokit/rest";
import { IssueHandler } from "../issue/issue-handler";
import { Logger } from "../log/logger";
import { IssueInfo } from "../issue/issue-info";
import { Actions } from "../action/actions";
import { FlagStaleIssue } from "../tasks/flag-stale-issue";
import { CloseStaleIssue } from "../tasks/close-stale-issue";

/**
 * Manage the stale issues
 */
export class Stale {

  private githubRead: Octokit;
  private githubPush: Octokit;
  private logger: Logger;

  private CHECK_STALE_DAYS = 180;
  private ROT_AFTER_STALE_DAYS = 7;
  private BT = '`';

  private flagIssueHandlers: IssueHandler[] = [];
  private closeStaleIssueHandlers: IssueHandler[] = [];

  private readonly STALE_MESSAGE = `Issues go stale after ${this.BT}${this.CHECK_STALE_DAYS}${this.BT} days of inactivity. ${this.BT}lifecycle/stale${this.BT} issues rot after an additional ${this.BT}${this.ROT_AFTER_STALE_DAYS}${this.BT} days of inactivity and eventually close.\n\nMark the issue as fresh with ${this.BT}/remove-lifecycle stale${this.BT} in a new comment.\n\nIf this issue is safe to close now please do so.\n\nModerators: Add ${this.BT}lifecycle/frozen${this.BT} label to avoid stale mode.`

  constructor(
    githubRead: Octokit,
    githubPush: Octokit,
    logger: Logger,
  ) {
    this.githubRead = githubRead;
    this.githubPush = githubPush;
    this.logger = logger;
    this.flagIssueHandlers.push(new FlagStaleIssue(this.STALE_MESSAGE));
    this.closeStaleIssueHandlers.push(new CloseStaleIssue(this.STALE_MESSAGE));
  }

  public async compute(): Promise<void> {

    // compute 180 days from now in the past
    const beforeDate = new Date();
    beforeDate.setDate(beforeDate.getDate() - this.CHECK_STALE_DAYS);
    const simpleDate = beforeDate.toISOString().substring(0, 10);

    this.logger.debug("Stale before date", simpleDate);

    // get all issues not updated since this date and that are not in frozen state
    const options = this.githubRead.search.issuesAndPullRequests.endpoint.merge({
      q: `repo:eclipse-che/che state:open updated:<=${simpleDate} -label:lifecycle/frozen`,
      sort: 'created',
      order: 'asc',
      per_page: 100,
    });

    //this.logger.debug('Request is' + `GET /search/issues?q=repo%3Aeclipse-che%2Fche+is:issue+updated%3A%3C%3D${simpleDate}+-label%3Alifecycle%2Ffrozen+state:open&sort=created&order=asc`);
    const response = await this.githubRead.paginate(options);
    this.handleStaleIssues(response, beforeDate);

    // ok now will do the same for stale issues that are not updated since 7 days

    // compute 180 days from now in the past
    const inThePasteDate = new Date();
    inThePasteDate.setDate(inThePasteDate.getDate() - this.ROT_AFTER_STALE_DAYS);
    const inThePasteDateSimple = inThePasteDate.toISOString().substring(0, 10);

    this.logger.debug("close before date", inThePasteDate);

    // get all issues not updated since this date and that are not in frozen state
    const searchOptions = this.githubRead.search.issuesAndPullRequests.endpoint.merge({
      q: `repo:eclipse-che/che state:open updated:<=${inThePasteDateSimple} label:lifecycle/stale`,
      sort: 'created',
      order: 'asc',
      per_page: 100,
    });

    //this.logger.debug('Request is' + `GET /search/issues?q=repo%3Aeclipse-che%2Fche+is:issue+updated%3A%3C%3D${simpleDate}+-label%3Alifecycle%2Ffrozen+state:open&sort=created&order=asc`);
    const staleResponse = await this.githubRead.paginate(searchOptions);
    this.handleClosingStaleIssues(staleResponse);

  }

  protected handleStaleIssues(data: any, beforeDate: Date): void {
    this.logger.debug("we are in handleStaleIssues... and array is ", data.length);

    // ok so now for each issue, need to flag it as stale and add label on it

    // for now, only took first 20 issues
    const updatedData = data;
    if (updatedData.length > 20) {
      updatedData.length = 20;
    }

    // for each issue, grab details
    const issuesInfos: IssueInfo[] = data.map((issueData: any) => new IssueInfo(issueData, 'che'));

    issuesInfos.forEach(issueInfo => {
      // flag
      const actions = new Actions(this.githubPush, 'eclipse-che', 'che', issueInfo.number());
      this.flagIssueHandlers.forEach((handler: IssueHandler) => handler.execute(issueInfo, actions));
    });

  }

  protected handleClosingStaleIssues(data: any): void {
    this.logger.debug("we are in handleClosingStaleIssues... and array is ", data.length);

    // ok so now for each issue, need to flag it as stale and add label on it

    // for now, only took first 20 issues
    const updatedData = data;
    if (updatedData.length > 40) {
      updatedData.length = 40;
    }

    // for each issue, grab details
    const issuesInfos: IssueInfo[] = data.map((issueData: any) => new IssueInfo(issueData, 'che'));

    issuesInfos.forEach(issueInfo => {
      // flag
      const actions = new Actions(this.githubPush, 'eclipse-che', 'che', issueInfo.number());
      this.closeStaleIssueHandlers.forEach((handler: IssueHandler) => handler.execute(issueInfo, actions));
    });

  }

}
