import JenkinsTestCase from '@service/jenkins/jenkins-test-case';

import { JiraIssue } from '@service/jira/jira-issue';

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
        if(this.suite) {
            return this.suite + ' ' + this.case;
        }

        return this.case;
        
    }

    get caseNumber(): string {
        return (this.case && this.case.length > 2) ? this.case.substring(2) : '';
    }

    get isConsistentlyFailing(): boolean {
        return this.jobResult.isConsistentlyFailing;
    }

    get needsJiraIssue(): boolean {
        return !this.jiraIssue && this.isConsistentlyFailing && !this.isCreatingJiraIssue;
    }

    get tcdbUrl(): string {
        if(this.isTcdb) {
            return 'http://tcdb.inin.com/phaster/#/testcases/' + this.caseNumber;
        }
    }

    get isTcdb(): boolean {
        return this.case && this.case.toLowerCase().startsWith('tc');
    }

    get isIcws(): boolean {
        return this.case && this.case.toLowerCase().startsWith('icws');
    }

    constructor(testCase: JenkinsTestCase) {

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
