import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TestReport } from '../test-report-view/test-report';
import TestCaseResult from '../test-report-view/test-case-result';
import { JiraService } from '../jira/jira.service';
import { JiraIssue } from '../jira/jira-issue';
import * as _ from 'lodash';
import { TestCaseJobResult } from '../test-report-view/test-case-job-result';


function getFlappinessMeasure(history: boolean[]): number {
    let flappiness: number = 0;

    // increment the flappiness measure each time the result changes.
    let lastResult: boolean = history[0];
    history.forEach(result => {
        if(result !== lastResult) {
            flappiness++;
            lastResult = result;
        }
    });

    return flappiness;
}

@Component({
    selector: 'test-report-table',
    templateUrl: './test-report-table.component.html',
    styleUrls: ['./test-report-table.component.scss'],
    providers: [JiraService]
})

export class TestReportTableComponent implements OnInit {
    @ViewChild('testReportTable') table: any;

    @Input()
    testReport: TestReport;

    constructor(private jiraService: JiraService) { }

    ngOnInit() {

    }

    statusCellClass({ row, column, value }): any {
        return {
            'status-failed': value === 'FAILED'
        }
    }

    scrCellClass({ row, column, value }): any {
        return {
            'needs-scr': row.needsJiraIssue
        }
    }

    scrComparator(valueA: JiraIssue, valueB: JiraIssue, rowA: TestCaseResult, rowB: TestCaseResult, sortDirection: string): number {
        if (valueA && valueB) {
            if (valueA.key < valueB.key) {
                return -1;
            } else if (valueA.key > valueB.key) {
                return 1;
            }

        } else if (valueA) {
            return 1;
        } else if (valueB) {
            return -1;
        } else { //valueA and valueB are null
            let rowAHasButton = rowA.needsJiraIssue;
            let rowBHasButton = rowB.needsJiraIssue;

            if (rowAHasButton && !rowBHasButton) {
                return 1;
            } else if (rowBHasButton && !rowAHasButton) {
                return -1;
            }
        }
    }

    //Compares the flappiness of one test history to another.
    historyComparator(valueA: boolean[], valueB: boolean[]): number {
        let flappinessA: number = getFlappinessMeasure(valueA);
        let flappinessB: number = getFlappinessMeasure(valueB);

        if(flappinessA < flappinessB) {
            return -1;
        } else if (flappinessA > flappinessB) {
            return 1;
        }
        
        return 0;
    }


    createScr(row: TestCaseResult): void {
        row.isCreatingJiraIssue = true;
        this.jiraService.postNewIssue(row)
            .then((issue: JiraIssue) => {
                row.jiraIssue = issue;
                return;
            }).then(() => { row.isCreatingJiraIssue = false; })
            .catch(() => { row.isCreatingJiraIssue = false; });
    }

    onActivate(event) {
        if(event.type === 'click' && event.value === 'FAILED') {
            this.table.rowDetail.toggleExpandRow(event.row);
        }

    }
}
