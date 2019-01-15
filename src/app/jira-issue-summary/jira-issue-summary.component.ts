import { Component, Input, ViewChild } from '@angular/core';

import { JiraIssue } from '../jira/jira-issue';

@Component({
    selector: 'jira-issue-summary',
    templateUrl: './jira-issue-summary.component.html',
    styleUrls: ['./jira-issue-summary.component.scss'],
})
export class JiraIssueSummaryComponent {
    @Input() issue: JiraIssue;

    isInProgress(): boolean {
        return this.issue.statusName.toLowerCase() === "in progress";
    }
}