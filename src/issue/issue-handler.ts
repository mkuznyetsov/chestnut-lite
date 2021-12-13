import { Actions } from "../action/actions";
import { IssueInfo } from "./issue-info";

export interface IssueHandler {

  execute(issueInfo: IssueInfo, action: Actions): void;

}
