import TestCaseResult from './test-case-result';

import * as moment from 'moment';
import _ from 'lodash';
import JenkinsTestReport from '@service/jenkins/jenkins-test-report';

export class TestReport {
    _testCaseResults: TestCaseResult[];
    displayedRows: TestCaseResult[];

    successTrend: number;
    failTrend: number;
    reportUrl: string;
    duration: number;
    timestamp:number;
    buildNumber: number;

    get displayTrend(): string {

        return this.successTrend ? this.successTrend.toString() : this.failTrend.toString();
    }

    get displayDuration(): string {
        return moment.utc(this.duration).format('H [hr] mm [min]');
    }

    get displayTime(): string {
        return moment(this.timestamp).format('MMM Do, YYYY h:mm A')
    }

    get testCaseResults(): TestCaseResult[] {
        return this._testCaseResults;
    }

    constructor(jenkinsTestReport: JenkinsTestReport) {
        this.reportUrl = jenkinsTestReport.url;

        let testReportResults: TestCaseResult[] = _.map(jenkinsTestReport.testCases, testCase => new TestCaseResult(testCase));
        this._testCaseResults = this.mergeResults(testReportResults);
        this.displayedRows = this._testCaseResults;
    }

    //ICWS Tests can report multiple results for a single test case. Merge them into a single record.
    private mergeResults(results: TestCaseResult[]): TestCaseResult[] {
        let resultsMap = _.keyBy(results, (result: TestCaseResult) => result.displayName);

        _.forEach(results, (result: TestCaseResult) => {
            resultsMap[result.displayName].jobResult.merge(result.jobResult);
        });

        return _.values(resultsMap);
    }
}
