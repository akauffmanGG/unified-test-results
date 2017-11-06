import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { JenkinsService } from '../jenkins/jenkins.service';
import { JiraService } from '../jira/jira.service';

import JenkinsTestReport from '../jenkins/jenkins-test-report';
import JenkinsJob from '../jenkins/jenkins-job';

import { JiraQuery } from '../jira/jira-query';
import { JiraIssue } from '../jira/jira-issue';

import TestCaseResult from './test-case-result';
import teamSuiteMap from './team-suite-map';


@Component({
    selector: 'test-report-view',
    templateUrl: './test-report-view.component.html',
    styleUrls: ['./test-report-view.component.less'],
    providers: [JenkinsService, JiraService]
})
export class TestReportViewComponent implements OnInit {

    testCaseResults: TestCaseResult[];
    rows: TestCaseResult[];
    qaSelected: boolean = true;
    mainSelected: boolean = true;
    showOnlyFailures: boolean = true;
    showOnlyBothFailures: boolean = false;
    showOnlyConsistentFailures: boolean = false;

    constructor(private jenkinsService: JenkinsService, private jiraService: JiraService) {
    }

    ngOnInit() {
    }

    getTestReport(): void {
        this.jenkinsService.getLatestTestReport(JenkinsJob.QA).then(testReport => {
            return _.map(testReport.testCases, testCase => new TestCaseResult(testCase, JenkinsJob.QA));
        }).then((qaResults: TestCaseResult[]) => {
            return this.jenkinsService.getLatestTestReport(JenkinsJob.MAIN).then(testReport => {
                let mainResults: TestCaseResult[] = _.map(testReport.testCases, testCase => new TestCaseResult(testCase, JenkinsJob.MAIN));
                this.testCaseResults = this.mergeResults(qaResults, mainResults);
            });
        }).then(() => {
            this.addTeamsToResults();
            this.filterResults();

            return this.addJiraIssues();
        });
    }

    filterResults(): void {
        this.rows = _.filter(this.testCaseResults, (result: TestCaseResult) => {
            return this.isFilteredToBuild(result) &&
                this.isFilteredToConsistentFailures(result) &&
                this.isFilteredToOnlyFailures(result) &&
                this.isFilteredToBothFailures(result);
        });
    }

    private isFilteredToBuild(result: TestCaseResult): boolean {
        if(this.qaSelected && this.mainSelected){
            return true;
        }

        if (!this.qaSelected && !result.mainStatus) {
            return false;
        }

        if (!this.mainSelected && !result.qaStatus) {
            return false;
        }

        return true;
    }

    private isFilteredToOnlyFailures(result: TestCaseResult): boolean {
        if(!this.showOnlyFailures) {
            return true;
        }

        if (!result.qaFailed && !result.mainFailed) {
            return false;
        }

        if (!result.qaFailed && !this.mainSelected) {
            return false;
        }
        if (!result.mainFailed && !this.qaSelected) {
            return false;
        }

        return true;
    }

    private isFilteredToConsistentFailures(result: TestCaseResult): boolean {
        if(!this.showOnlyConsistentFailures) {
            return true;
        }

        if(!result.isConsistentlyFailing) {
            return false;
        }

        if (!result.isQaConsistentlyFailing && !this.mainSelected) {
            return false;
        }
        if (!result.isMainConsistentlyFailing && !this.qaSelected) {
            return false;
        }

        return true;
    }

    private isFilteredToBothFailures(result: TestCaseResult): boolean {
        if(!this.showOnlyBothFailures) {
            return true;
        }

        if (!result.qaFailed || !result.mainFailed) {
            return false;
        }

        return true;
    }

    private addJiraIssues(): Promise<any> {
        return this.jiraService.getFailureIssues()
        .then((query: JiraQuery) => {
            let issueMap = this.mapJiraIssueToTestCase(query.issues);
            _.forEach(this.testCaseResults, result => {
                if(issueMap[result.case]) {
                    result.jiraIssue = issueMap[result.case];
                }
            });
        });
    }

    private mapJiraIssueToTestCase(issues: JiraIssue[]): any {
        let issueMap = {};
        _.forEach(issues, (issue: JiraIssue) => {
            _.forEach(issue.testCases, testCase => {
                issueMap[testCase] = issue;
            });
        });

        return issueMap;
    }

    private mergeResults(qaResults: TestCaseResult[], mainResults: TestCaseResult[]): TestCaseResult[] {
        let mainResultMap = _.keyBy(mainResults, (result: TestCaseResult) => result.className);
        let qaResultMap = _.keyBy(qaResults, (result: TestCaseResult) => result.className);

        let mergedResults = _.unionWith(qaResults, mainResults, (arrVal: TestCaseResult, othVal: TestCaseResult) => {
            return arrVal.suite === othVal.suite && arrVal.case === othVal.case;
        });

        _.forEach(mergedResults, (mergedResult: TestCaseResult) => {
            if (mainResultMap[mergedResult.className] && qaResultMap[mergedResult.className]) {
                let mainResult: TestCaseResult = mainResultMap[mergedResult.className];
                let qaResult: TestCaseResult = qaResultMap[mergedResult.className];

                mergedResult.mainAge = mainResult.mainAge;
                mergedResult.mainStatus = mainResult.mainStatus;
                mergedResult.mainFailedSince = mainResult.qaFailedSince;

                mergedResult.qaAge = qaResult.qaAge;
                mergedResult.qaStatus = qaResult.qaStatus;
                mergedResult.qaFailedSince = qaResult.qaFailedSince;
            }
        });

        return mergedResults;
    }

    private addTeamsToResults(): void {
        _.each(this.testCaseResults, (testCaseResult: TestCaseResult) => {
            testCaseResult.team = teamSuiteMap.get(testCaseResult.suite) || 'None';
        });
    }

}
