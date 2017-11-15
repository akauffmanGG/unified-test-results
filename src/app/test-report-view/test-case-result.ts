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

    //TODO: Factor into separate class
    qaAge: number;
    qaFailedSince: number;
    qaStatus: string;
    qaStackTrace: string;
    qaStackTraceMessage: string;
    get qaFailed(): boolean {
        return this.qaStatus === 'FAILED';
    }

    mainAge: number;
    mainFailedSince: number;
    mainStatus: string;
    mainStackTrace: string;
    mainStackTraceMessage: string;
    get mainFailed(): boolean {
        return this.mainStatus === 'FAILED';
    }

    jiraIssue: JiraIssue;
    isCreatingJiraIssue: boolean;

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
        return !this.jiraIssue && this.isConsistentlyFailing && !this.isCreatingJiraIssue;
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
            this.qaStackTrace = testCase.errorStackTrace;
            this.qaStackTraceMessage = this.getStackTraceMessage(testCase.errorStackTrace);
        } else if (job == JenkinsJob.MAIN){
            this.mainAge = testCase.age;
            this.mainFailedSince = testCase.failedSince;
            this.mainStatus = testCase.status;
            this.mainStackTrace = testCase.errorStackTrace;
            this.mainStackTraceMessage = this.getStackTraceMessage(testCase.errorStackTrace);
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

    private getStackTraceMessage(stackTrace: string): string {
        if(!stackTrace || stackTrace.length === 0) {
            return;
        }

        let message = stackTrace.split('+++')[0];
        message = message
            .replace(/\n/g, '')
            .replace(/\s{2,}/g,'')
            .replace('MESSAGE:ININ.Testing.Automation.Core.TraceTrueException :', '')
            .replace('MESSAGE:ININ.Testing.Automation.ManagedICWS.NegativeICWSResponseException :', '');

        return message;
    }

    merge(other: TestCaseResult) {
        this.qaAge = this.qaAge || other.qaAge;
        this.qaFailedSince = this.qaFailedSince || other.qaFailedSince;
        this.qaStatus = this.qaStatus || other.qaStatus;
        this.qaStackTrace = this.qaStackTrace || other.qaStackTrace;
        this.qaStackTraceMessage = this.qaStackTraceMessage || other.qaStackTraceMessage;

        this.mainAge = this.mainAge || other.mainAge;
        this.mainFailedSince = this.mainFailedSince || other.mainFailedSince;
        this.mainStatus = this.mainStatus || other.mainStatus;
        this.mainStackTraceMessage = this.mainStackTraceMessage || other.mainStackTraceMessage;
    }
}
