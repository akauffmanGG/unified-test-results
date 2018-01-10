import _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { JenkinsService } from '../jenkins/jenkins.service';
import { JiraService } from '../jira/jira.service';
import { FilterResults } from './filter-results';

import JenkinsTestReport from '../jenkins/jenkins-test-report';
import JenkinsJobEnum from '../jenkins/jenkins-job-enum';
import { JenkinsJob } from '../jenkins/jenkins-job';

import { JiraQuery } from '../jira/jira-query';
import { JiraIssue } from '../jira/jira-issue';

import TestCaseResult from './test-case-result';
import { TestReport } from './test-report';
import teamSuiteMap from './team-suite-map';
import { MissingTeam } from './team';


@Component({
    selector: 'test-report-view',
    templateUrl: './test-report-view.component.html',
    styleUrls: ['./test-report-view.component.less'],
    providers: [JenkinsService, JiraService, FilterResults]
})
export class TestReportViewComponent implements OnInit {

    testCaseResults: TestCaseResult[];
    testReport: TestReport;
    qaSelected: boolean = true;
    mainSelected: boolean = true;
    showOnlyFailures: boolean = true;
    showOnlyBothFailures: boolean = false;
    showOnlyConsistentFailures: boolean = false;
    showFixedIssues: boolean = false;
    loading: boolean = false;

    constructor(private jenkinsService: JenkinsService, private jiraService: JiraService, private filterResults: FilterResults) {
    }

    ngOnInit() {
    }

    getTestReport(): void {
        this.loading = true;
        this.testReport = new TestReport();

        this.jenkinsService.getLatestTestReport(JenkinsJobEnum.QA).then(testReport => {
            this.testReport.qaReportUrl = testReport.url;
            return _.map(testReport.testCases, testCase => new TestCaseResult(testCase, JenkinsJobEnum.QA));
        }).then((qaResults: TestCaseResult[]) => {
            return this.jenkinsService.getLatestTestReport(JenkinsJobEnum.MAIN).then(testReport => {
                this.testReport.mainReportUrl = testReport.url;
                let mainResults: TestCaseResult[] = _.map(testReport.testCases, testCase => new TestCaseResult(testCase, JenkinsJobEnum.MAIN));
                this.testCaseResults = this.mergeResults(qaResults, mainResults);
            });
        }).then(() => {
            this.addTeamsToResults();
            this.testReport.displayedRows = this.testCaseResults;

            return this.addJiraIssues();
        }).then(() => { this.loading = false; }) //Ugh, no finally block. Seriously?
        .catch(() => {
            this.loading = false;
        });

        this.setJobTrends();
    }

    filterRows(): void {
        this.filterResults.showMain = this.mainSelected;
        this.filterResults.showQa = this.qaSelected;
        this.filterResults.showOnlyFailures = this.showOnlyFailures;
        this.filterResults.showOnlyBothFailures = this.showOnlyBothFailures;
        this.filterResults.showOnlyConsistentFailures = this.showOnlyConsistentFailures;
        this.filterResults.showFixedIssues = this.showFixedIssues;

        this.testReport.displayedRows = this.filterResults.filter(this.testCaseResults);
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

                mergedResult.merge(mainResult);
                mergedResult.merge(qaResult);
            }
        });

        return mergedResults;
    }

    private addTeamsToResults(): void {
        _.each(this.testCaseResults, (testCaseResult: TestCaseResult) => {
            testCaseResult.team = teamSuiteMap.get(testCaseResult.suite) || MissingTeam;
        });
    }

    private setJobTrends(): void {
        this.testReport.qaSuccessTrend = 0;
        this.testReport.qaFailTrend = 0;
        this.testReport.mainSuccessTrend = 0;
        this.testReport.mainFailTrend = 0;

        this.jenkinsService.getMainJob()
        .then((mainJob: JenkinsJob) => {
            this.testReport.mainSuccessTrend = mainJob.lastCompletedBuild.number - mainJob.lastUnsuccessfulBuild.number;
            this.testReport.mainFailTrend = mainJob.lastCompletedBuild.number - mainJob.lastSuccessfulBuild.number;
        });

        this.jenkinsService.getQaJob()
        .then((qaJob: JenkinsJob) => {
            this.testReport.qaSuccessTrend = qaJob.lastCompletedBuild.number - qaJob.lastUnsuccessfulBuild.number;
            this.testReport.qaFailTrend = qaJob.lastCompletedBuild.number - qaJob.lastSuccessfulBuild.number;
        });
    }

}
