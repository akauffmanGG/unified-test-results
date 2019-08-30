import _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { JenkinsService } from '@service/jenkins/jenkins.service';
import { JiraService } from '@service/jira/jira.service';
import { TcdbService } from '@service/tcdb/tcdb.service';

import JenkinsTestReport from '@service/jenkins/jenkins-test-report';
import JenkinsJobEnum from '@service/jenkins/jenkins-job-enum';
import { JenkinsJob } from '@service/jenkins/jenkins-job';
import { JenkinsBuild } from '@service/jenkins/jenkins-build';

import { JiraQuery } from '@service/jira/jira-query';
import { JiraIssue } from '@service/jira/jira-issue';

import TestCaseResult from './test-case-result';
import { TestReport } from './test-report';
import teamSuiteMap from './team-suite-map';
import { MissingTeam } from './team';
import { TestCaseJobResult } from './test-case-job-result';
import { promise } from 'protractor';



@Component({
    selector: 'test-report-view',
    templateUrl: './test-report-view.component.html',
    styleUrls: ['./test-report-view.component.scss'],
    providers: [JenkinsService, JiraService, TcdbService]
})
export class TestReportViewComponent implements OnInit {

    testCaseResults: TestCaseResult[];
    testReport: TestReport = new TestReport();
    loading: boolean = false;
    selectedJob = "client.test.latest_systest";
    icatJobs: string[] = [];
    isFilterCollapsed = false;
    isNodeStatusCollapsed = true;

    constructor(private jenkinsService: JenkinsService, private jiraService: JiraService, private tcdbService: TcdbService) {
    }

    ngOnInit() {
        this.jenkinsService.getIcatJobs().then((jobs:string[]) => {
            this.icatJobs = jobs;
        });
    }

    getTestReport(): void {
        this.loading = true;

        this.jenkinsService.getLatestTestReport(this.selectedJob).then(testReport => {
            this.testReport.reportUrl = testReport.url;
            this.testCaseResults = _.map(testReport.testCases, testCase => new TestCaseResult(testCase));
            return this.testCaseResults;
        }).then(() => {
            this.addTeamsToResults();
            this.testReport.displayedRows = this.testCaseResults;

            let cases: String[] = _.map(this.testCaseResults, 'caseNumber');

            let promises : Promise<any>[] = [
                this.addJiraIssues(),

                this.setJobTrends(),

                this.tcdbService.getTestCasePriorities(cases)
                .then(results => {
                    this.addPriorities(results);
                }),

                this.jenkinsService.getHistoricalReports(this.selectedJob)
                .then(results => {
                    this.addHistory(_.map(results, 'report'));
                })
            ];

            return Promise.all(promises);

        }).then(() => { this.loading = false; }) //Ugh, no finally block. Seriously?
        .catch(() => {
            this.loading = false;
        });
        
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

    private addHistory(historicalResults: JenkinsTestReport[]): void {
        // Create list of maps of class name to result
        let resultsMapList = _.map(historicalResults, (testReport:JenkinsTestReport) => {
            return _.keyBy(testReport.testCases, (result: TestCaseResult) => result.suite + " " + result.case);
        });

        //iterate through testCaseResults
        _.map(this.testCaseResults, (testCaseResult: TestCaseResult) => {
            _.map(resultsMapList, (resultMap:any) => {
                let key = testCaseResult.suite + " " + testCaseResult.case;

                if(resultMap[key]) {
                    testCaseResult.addHistory(new TestCaseJobResult(resultMap[key]));
                }
                
            });
        })

    }

    private addPriorities(priorities: [{ TestCaseId : String, Priority : String }] ) : void {
        let priorityMap = _.keyBy( priorities, 'TestCaseId');

        this.testCaseResults.forEach( (testCaseResult: TestCaseResult) => {
            let priorityRecord = priorityMap[testCaseResult.caseNumber];

            if(priorityRecord) {
                testCaseResult.priority = priorityRecord.Priority;
            }
        });
    }

    private addTeamsToResults(): void {
        _.each(this.testCaseResults, (testCaseResult: TestCaseResult) => {
            testCaseResult.team = teamSuiteMap.get(testCaseResult.suite) || MissingTeam;
        });
    }

    private setJobTrends(): Promise<any> {
        this.testReport.successTrend = 0;
        this.testReport.failTrend = 0;

        return this.jenkinsService.getJenkinsJob(this.selectedJob)
        .then((job: JenkinsJob) => {
            this.testReport.successTrend = job.lastCompletedBuild.number - (job.lastUnsuccessfulBuild ? job.lastUnsuccessfulBuild.number : 0);
            this.testReport.failTrend = job.lastCompletedBuild.number - job.lastSuccessfulBuild.number;
            return this.jenkinsService.getJenkinsBuild(this.selectedJob, job.lastSuccessfulBuild.number);
        }).then((build: JenkinsBuild) => {
            this.testReport.duration = build.duration;
            this.testReport.buildNumber = build.number;
            this.testReport.timestamp = build.timestamp;
        });

    }

}
