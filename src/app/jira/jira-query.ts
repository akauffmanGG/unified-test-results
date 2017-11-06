import { JiraIssue } from './jira-issue';
import * as _ from 'lodash';

export class JiraQuery {
    total: number;
    issues: JiraIssue[];

    constructor(obj: any) {
        this.total = obj.total;
        this.issues = _.map(obj.issues, issue => new JiraIssue(issue));
    }
}
