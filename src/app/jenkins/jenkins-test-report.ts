import JenkinsTestCase from './jenkins-test-case';
import * as _ from 'lodash';

export default class JenkinsTestReport {
    failCount: number;
    passCount: number;
    skipCount: number;

    testCases: JenkinsTestCase[];

    url: string;

    constructor(obj: any) {
        this.failCount = obj.failCount;
        this.passCount = obj.passCount;
        this.skipCount = obj.skipCount;
        this.url = obj.url;

        let suites : any[] = obj.suites;
        this.testCases = _.flatten(_.map(suites, suite => _.map(suite.cases, testCase => new JenkinsTestCase( testCase ) ) ) );
    }
}
