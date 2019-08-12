import JenkinsTestCase from '../services/jenkins/jenkins-test-case';
import JenkinsJobEnum from '../services/jenkins/jenkins-job-enum';

import { JiraIssue } from '../services/jira/jira-issue';

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
    priority: string;
    jobResult: TestCaseJobResult;
    history: TestCaseJobResult[] = [];

    jiraIssue: JiraIssue;
    isCreatingJiraIssue: boolean;

    get displayName(): string {
        return this.suite + ' ' + this.case;
    }

    get caseNumber(): string {
        return this.case.substring(2);
    }

    get isConsistentlyFailing(): boolean {
        return this.jobResult.isConsistentlyFailing;
    }

    get needsJiraIssue(): boolean {
        return !this.jiraIssue && this.isConsistentlyFailing && !this.isCreatingJiraIssue;
    }

    constructor(testCase: JenkinsTestCase, job: JenkinsJobEnum) {

        this.className = testCase.className;

        this.name = testCase.name;

        this.suite = testCase.suite;
        this.case = testCase.case;

        this.jobResult = new TestCaseJobResult(testCase);

        this.team = MissingTeam;
    }

    addHistory(result: TestCaseJobResult) {
        this.history.push(result);
    }

}
