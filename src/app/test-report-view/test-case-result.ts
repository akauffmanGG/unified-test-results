import JenkinsTestCase from '../jenkins/jenkins-test-case';
import JenkinsJob from '../jenkins/jenkins-job';

import { JiraIssue } from '../jira/jira-issue';

import { Team, MissingTeam } from './team';
import { TestCaseJobResult } from './test-case-job-result';

const FAILED = 'FAILED';
const REGRESSION = 'REGRESSION';

export default class TestCaseResult {
    className: string;
    name: string;
    suite: string;
    case: string;
    team: Team;
    qaResult: TestCaseJobResult;
    mainResult: TestCaseJobResult;
    jiraIssue: JiraIssue;
    isCreatingJiraIssue: boolean;

    get displayName(): string {
        return this.suite + ' ' + this.case;
    }

    get caseNumber(): string {
        return this.case.substring(2);
    }

    get isConsistentlyFailing(): boolean {
        return this.qaResult.isConsistentlyFailing || this.mainResult.isConsistentlyFailing;
    }

    get needsJiraIssue(): boolean {
        return !this.jiraIssue && this.isConsistentlyFailing && !this.isCreatingJiraIssue;
    }

    constructor(testCase: JenkinsTestCase, job: JenkinsJob) {

        this.className = testCase.className;

        this.name = testCase.name;

        this.suite = testCase.suite;
        this.case = testCase.case;

        if(job === JenkinsJob.QA) {
            this.qaResult = new TestCaseJobResult(testCase);
            this.mainResult = new TestCaseJobResult({});
        } else if (job === JenkinsJob.MAIN){
            this.mainResult = new TestCaseJobResult(testCase);
            this.qaResult = new TestCaseJobResult({});
        } else {
            console.error('Invalid Jenkins Job');
        }

        this.team = MissingTeam;
    }

    merge(other: TestCaseResult) {
        if(!this.qaResult.status) {
            this.qaResult = other.qaResult;
        }
        if(!this.mainResult.status) {
            this.mainResult = other.mainResult;
        }
    }
}
