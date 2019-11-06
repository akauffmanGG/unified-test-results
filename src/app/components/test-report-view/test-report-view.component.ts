import _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { JenkinsService } from '@service/jenkins/jenkins.service';
import { JiraService } from '@service/jira/jira.service';
import { TcdbService } from '@service/tcdb/tcdb.service';

import JenkinsTestReport from '@service/jenkins/jenkins-test-report';
import { JenkinsJob } from '@service/jenkins/jenkins-job';
import { JenkinsBuild } from '@service/jenkins/jenkins-build';

import { JiraQuery } from '@service/jira/jira-query'; 
import { JiraIssue } from '@service/jira/jira-issue';

import TestCaseResult from './test-case-result';
import { TestReport } from './test-report';
import teamSuiteMap from './team-suite-map';
import { MissingTeam } from './team';
import { TestCaseJobResult } from './test-case-job-result';



@Component({
    selector: 'test-report-view',
    templateUrl: './test-report-view.component.html',
    styleUrls: ['./test-report-view.component.scss'],
    providers: [JenkinsService, JiraService, TcdbService]
})
export class TestReportViewComponent implements OnInit {

    testReport: TestReport;
    loading: boolean = false;
    selectedJob: JenkinsJob;
    icatJobs: JenkinsJob[] = [];
    isFilterCollapsed = false;
    isNodeStatusCollapsed = true;

    constructor(private jenkinsService: JenkinsService, private jiraService: JiraService, private tcdbService: TcdbService) {
    }

    ngOnInit() {
        this.jenkinsService.getIcatJobs().then((jobs:JenkinsJob[]) => {
            this.icatJobs = jobs;

            this.selectedJob = _.find(jobs, ['name', 'client.test.latest_systest']);
        });
    }

    getTestReport(): void {
        this.loading = true;

        this.jenkinsService.getLatestTestReport(this.selectedJob).then(jenkinsTestReport => {
            this.testReport = new TestReport(jenkinsTestReport);
        }).then(() => {
            this.addTeamsToResults();

            // Unique list of TCDB test cases
            let cases: String[] = _.uniq(_.map(_.filter(this.testReport.testCaseResults, 'isTcdb'), 'caseNumber'));

            let promises : Promise<any>[] = [
                this.addJiraIssues(),

                this.setJobTrends(),

                this.tcdbService.getTestCasePriorities(cases)
                .then(results => {
                    this.addPriorities(results);
                }),

                this.jenkinsService.getHistoricalReports(this.selectedJob)
                .then(results => {
                    this.addHistory(_.map(results, result => {
                        return new TestReport(result.report);
                    }));
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
            _.forEach(this.testReport.testCaseResults, result => {
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

    private addHistory(historicalResults: TestReport[]): void {
        // Create list of maps of class name to result
        let resultsMapList = _.map(historicalResults, (testReport:TestReport) => {
            return _.keyBy(testReport.testCaseResults, (result: TestCaseResult) => result.displayName);
        });

        //iterate through testCaseResults
        _.map(this.testReport.testCaseResults, (testCaseResult: TestCaseResult) => {
            _.map(resultsMapList, (resultMap:any) => {
                let key = testCaseResult.displayName;

                if(resultMap[key]) {
                    testCaseResult.addHistory(resultMap[key].jobResult);
                }
                
            });
        })

    }

    private addPriorities(priorities: [{ TestCaseId : String, Priority : String }] ) : void {
        let priorityMap = _.keyBy( priorities, 'TestCaseId');

        this.testReport.testCaseResults.forEach( (testCaseResult: TestCaseResult) => {
            let priorityRecord = priorityMap[testCaseResult.caseNumber];

            if(priorityRecord) {
                testCaseResult.priority = priorityRecord.Priority;
            }
        });
    }

    private addTeamsToResults(): void {
        _.each(this.testReport.testCaseResults, (testCaseResult: TestCaseResult) => {
            testCaseResult.team = teamSuiteMap.get(testCaseResult.suite) || MissingTeam;
        });
    }

    private setJobTrends(): Promise<any> {
        this.testReport.successTrend = 0;
        this.testReport.failTrend = 0;

        let job = this.selectedJob;

        return this.jenkinsService.setJenkinsJobBuildInfo(job)
        .then(() => {
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
