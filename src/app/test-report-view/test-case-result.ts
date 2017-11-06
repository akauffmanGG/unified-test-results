import JenkinsTestCase from '../jenkins/jenkins-test-case';
import JenkinsJob from '../jenkins/jenkins-job';

import { JiraIssue } from '../jira/jira-issue';

const FAILED = 'FAILED';
const REGRESSION = 'REGRESSION';
const CONSISTENT_FAIL_NUMBER = 3;

export default class TestCaseResult {
    className: string;
    name: string;
    suite: string;
    case: string;
    team: string;

    qaAge: number;
    qaFailedSince: number;
    qaStatus: string;
    get qaFailed(): boolean {
        return this.qaStatus === 'FAILED';
    }

    mainAge: number;
    mainFailedSince: number;
    mainStatus: string;
    get mainFailed(): boolean {
        return this.mainStatus === 'FAILED';
    }

    jiraIssue: JiraIssue;

    get displayName(): string {
        return this.suite + ' ' + this.case;
    }

    get caseNumber(): string {
        return this.case.substring(2);
    }

    get isQaConsistentlyFailing(): boolean {
        return this.qaFailed && this.qaAge > CONSISTENT_FAIL_NUMBER;
    }

    get isMainConsistentlyFailing(): boolean {
        return this.mainFailed && this.mainAge > CONSISTENT_FAIL_NUMBER;
    }

    get isConsistentlyFailing(): boolean {
        return (this.mainFailed && this.mainAge > CONSISTENT_FAIL_NUMBER) || (this.qaFailed && this.qaAge > CONSISTENT_FAIL_NUMBER);
    }

    get needsJiraIssue(): boolean {
        return !this.jiraIssue && this.isConsistentlyFailing;
    }

    constructor(testCase: JenkinsTestCase, job: JenkinsJob) {

        this.className = testCase.className;

        this.name = testCase.name;

        this.suite = testCase.suite;
        this.case = testCase.case;

        if(job == JenkinsJob.QA) {
            this.qaAge = testCase.age;
            this.qaFailedSince = testCase.failedSince;
            this.qaStatus = testCase.status;
        } else if (job == JenkinsJob.MAIN){
            this.mainAge = testCase.age;
            this.mainFailedSince = testCase.failedSince;
            this.mainStatus = testCase.status;
        } else {
            console.error('Invalid Jenkins Job');
        }

        if(this.qaStatus == 'REGRESSION') {
            this.qaStatus = 'FAILED';
        }

        if(this.mainStatus == 'REGRESSION') {
            this.mainStatus = 'FAILED';
        }
    }
}
